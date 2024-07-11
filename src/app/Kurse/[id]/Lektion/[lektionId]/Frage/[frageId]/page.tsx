"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import CreateAntwortModal from "@/components/CreateAntwortModal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Checkbox, FormControlLabel } from "@mui/material";

interface Params {
  params: {
    id: number;
    lektionId: number;
    frageId: number;
  };
}

export default function FrageSeite({ params }: Params) {
  const [frage, setFrage] = useState<Frage | null>(null);
  const [fragen, setFragen] = useState<Frage[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editingAntwortId, setEditingAntwortId] = useState<number | null>(null);
  const [editedAntwortContent, setEditedAntwortContent] = useState<string>("");
  const [editedAntwortIsCorrect, setEditedAntwortIsCorrect] =
    useState<boolean>(false);

  const { user } = useContext(UserContext);

  //API-Call zum Backend um eine Frage zu holen
  const fetchFrage = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}/Frage/${params.frageId}`,
        {
          method: "GET",
        },
      );
      if (response.ok) {
        const frageData = await response.json();
        setFrage(frageData);
      } else {
        console.error("Fehler beim Abrufen der Frage");
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }, [params.id, params.lektionId, params.frageId]);

  //API-Call zum Backend um die Fragen zu holen
  const fetchFragen = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}`,
        {
          method: "GET",
        },
      );
      if (response.ok) {
        const lektionData = await response.json();
        setFragen(lektionData.fragen);
      } else {
        console.error("Fehler beim Abrufen der Fragen");
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }, [params.id, params.lektionId]);

  const handleSaveAntwort = async (antwortId: number) => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}/Frage/${params.frageId}/Antwort/${antwortId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedAntwortContent,
            isCorrect: editedAntwortIsCorrect,
          }),
        },
      );
      if (response.ok) {
        setFrage((prevFrage) => {
          if (!prevFrage) return prevFrage;
          return {
            ...prevFrage,
            antworten: prevFrage.antworten.map((a) =>
              a.id === antwortId
                ? {
                    ...a,
                    content: editedAntwortContent,
                    isCorrect: editedAntwortIsCorrect,
                  }
                : a,
            ),
          };
        });
        setEditingAntwortId(null);
      } else {
        console.error("Failed to update antwort");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteAntwort = async (antwortId: number) => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}/Frage/${params.frageId}/Antwort/${antwortId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setFrage((prevFrage) =>
          prevFrage
            ? {
                ...prevFrage,
                antworten: prevFrage.antworten.filter(
                  (a) => a.id !== antwortId,
                ),
              }
            : null,
        );
      } else {
        console.error("Failed to delete antwort");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Wenn etwas geändert wird die Id, den Content und das Häkchen setzen
  const handleEditAntwort = (antwort: Answer) => {
    setEditingAntwortId(antwort.id);
    setEditedAntwortContent(antwort.content);
    setEditedAntwortIsCorrect(antwort.isCorrect);
  };

  //Wenn sich params.id, params.lektionId, params.frageId, fetchFrage oder fetchFragen ändern, dann
  //das hier ausführen
  useEffect(() => {
    if (params.id && params.lektionId && params.frageId) {
      fetchFrage();
      fetchFragen();
    }
  }, [params.id, params.lektionId, params.frageId, fetchFrage, fetchFragen]);

  //Wenn auf die Antwort geklickt wird, ein API Call zum Backend schicken
  const handleAnswerClick = async (answerId: number) => {
    if (selectedAnswerId !== null) return;
    setSelectedAnswerId(answerId);
    setShowFeedback(true);

    if (!frage) return;

    const selectedAnswer = frage.antworten.find(
      (answer) => answer.id === answerId,
    );
    const isCorrect = selectedAnswer ? selectedAnswer.isCorrect : false;

    try {
      setIsLoading(true);

      const userId = user.id;
      await fetch(`/api/User/${userId}/Frage/${params.frageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCorrect }),
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Frageantwort:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Anzeigen ob die Antwort richtig oder falsch war
  const getFeedbackMessage = () => {
    if (selectedAnswerId === null || !frage) return "";
    const selectedAnswer = frage.antworten.find(
      (answer) => answer.id === selectedAnswerId,
    );
    return selectedAnswer?.isCorrect ? "Richtig!" : "Falsch!";
  };

  //Den Link zur nächsten Frage suchen, damit der Button gerendert werden kann
  const getNextQuestionLink = () => {
    if (!fragen.length || !frage) return null;
    const currentIndex = fragen.findIndex((q) => q.id === frage.id);
    const nextQuestion = fragen[currentIndex + 1];
    if (nextQuestion) {
      return `/Kurse/${params.id}/Lektion/${params.lektionId}/Frage/${nextQuestion.id}`;
    }
    return null;
  };

  const nextQuestionLink = getNextQuestionLink();

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1%", fontSize: "2rem" }}>
        {frage ? frage.frage : "Laden..."}
      </h1>
      <Link href={`/Kurse/${params.id}/Lektion/${params.lektionId}`}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          className="m-5"
        >
          Zurück
        </Button>
      </Link>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        {/*Wenn die Frage existiert das hier rendern*/}
        {frage ? (
          <Card
            variant="outlined"
            sx={{
              width: "80%",
              padding: 2,
              boxSizing: "border-box",
              marginBottom: 2,
            }}
          >
            <h2 style={{ textAlign: "center", margin: "1%", fontSize: "2rem" }}>
              {frage.frage}
            </h2>
            <Box sx={{ marginTop: 2 }}>
              {/*Alle Fragen mappen*/}
              {frage.antworten.map((antwort) => (
                <Card
                  variant="outlined"
                  key={antwort.id}
                  sx={{
                    width: "100%",
                    padding: 2,
                    boxSizing: "border-box",
                    marginBottom: 1,
                    cursor: "pointer",
                    backgroundColor:
                      selectedAnswerId === antwort.id
                        ? antwort.isCorrect
                          ? "#90EE90"
                          : "#FFB6C1"
                        : "white",
                    color: "black",
                    pointerEvents: selectedAnswerId !== null ? "none" : "auto",
                    position: "relative",
                    minHeight: "80px",
                  }}
                  onClick={() =>
                      user?.isAdmin || !user ? null : handleAnswerClick(antwort.id)
                  }
                >
                  {/*Wenn die Antwort die selbe ID hat wie die Antwort die gerade geändert wird,
                                    dann das TextField rendern und die Buttons ausblenden*/}
                  {editingAntwortId === antwort.id ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        position: "relative",
                      }}
                    >
                      <TextField
                        value={editedAntwortContent}
                        onChange={(e) =>
                          setEditedAntwortContent(e.target.value)
                        }
                        sx={{ width: "100%" }}
                        label="Antwortinhalt"
                        variant="outlined"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={editedAntwortIsCorrect}
                            onChange={(e) =>
                              setEditedAntwortIsCorrect(e.target.checked)
                            }
                          />
                        }
                        label="Ist korrekt"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveAntwort(antwort.id)}
                      >
                        SPEICHERN
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {/*Wenn sie nicht geändert wird, ein Feld mit der Antwortmöglichkeit anzeigen,
                                        wenn der User ein Admin ist dann die beiden Buttons zum ändern und löschen rendern*/}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <p>{antwort.content}</p>
                        {user?.isAdmin && (
                          <Box sx={{ display: "flex", gap: 0.2 }}>
                            <IconButton
                              onClick={() => handleEditAntwort(antwort)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteAntwort(antwort.id)}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                </Card>
              ))}
            </Box>
            {/*Wenn es Feedback gibt, hier anzeigen und wenn es eine nächste Frage gibt den Button dazu*/}
            {showFeedback && (
              <Box sx={{ marginTop: 2, textAlign: "center" }}>
                <p>{getFeedbackMessage()}</p>
                {nextQuestionLink ? (
                  <Link href={nextQuestionLink}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                    >
                      Nächste Frage
                    </Button>
                  </Link>
                ) : (
                  <>
                    {selectedAnswerId !== null &&
                    frage &&
                    frage.antworten.find(
                      (answer) => answer.id === selectedAnswerId,
                    )?.isCorrect ? (
                      <Link
                        href={`/Kurse/${params.id}/Lektion/${params.lektionId}`}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ marginTop: 2 }}
                        >
                          Zurück zur Auswahl der Fragen
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/Kurse/${params.id}/Lektion/${params.lektionId}`}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            marginTop: 2,
                            backgroundColor: "red",
                            color: "white",
                          }}
                        >
                          Versuchen Sie es erneut
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </Box>
            )}
            {/*Möglichkeit zum Antworten erstellen*/}
            {user && user.isAdmin && frage && (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
              >
                <CreateAntwortModal
                  fetchFrage={fetchFrage}
                  kursId={params.id}
                  lektionId={params.lektionId}
                  frageId={frage.id}
                />
              </Box>
            )}
          </Card>
        ) : (
          <p>Frage wird geladen...</p>
        )}
      </Box>
    </>
  );
}
