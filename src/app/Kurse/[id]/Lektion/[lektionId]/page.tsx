"use client";

import React, { useContext, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import Button from "@mui/material/Button";
import CreateFrageModal from "@/components/CreateFrageModal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

interface Params {
  params: {
    id: number;
    lektionId: string;
  };
}

export default function LektionSeite({ params }: Params) {
  const [lektion, setLektion] = useState<Lektion | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [answeredRightQuestions, setAnsweredRightQuestions] = useState<
    number[]
  >([]);
  const [editingFrageId, setEditingFrageId] = useState<number | null>(null);
  const [editedFrage, setEditedFrage] = useState<string>("");
  const { user } = useContext(UserContext);

  //Lektion mit der ID fetchen
  const fetchLektion = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}`,
        {
          method: "GET",
        },
      );
      if (response.ok) {
        const lektionData = await response.json();
        setLektion(lektionData);
      } else {
        console.error("Failed to fetch lektion");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [params.id, params.lektionId]);

  //Bereits beantwortete Fragen fetchen
  const fetchAnsweredQuestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/User/${user.id}/answeredQuestions`, {
        method: "GET",
      });
      if (response.ok) {
        const answeredData = await response.json();
        setAnsweredQuestions(answeredData.questionsAnswered);
        setAnsweredRightQuestions(answeredData.questionsAnsweredRight);
      } else {
        console.error("Failed to fetch answered questions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [user.id]);

  //Wenn die Änderung gespeichert wird, einen API Call zum Backend machen
  const handleSave = async (frageId: number) => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}/Frage/${frageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ frage: editedFrage }),
        },
      );
      if (response.ok) {
        setLektion((prevLektion) => {
          if (!prevLektion) return prevLektion;
          return {
            ...prevLektion,
            fragen: prevLektion.fragen.map((f) =>
              f.id === frageId ? { ...f, frage: editedFrage } : f,
            ),
          };
        });
        setEditingFrageId(null);
      } else {
        console.error("Failed to update frage");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Wenn die Frage gelöscht wird, einen API Call zum Backend machen
  const handleDelete = async (frageId: number): Promise<void> => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${params.lektionId}/Frage/${frageId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setLektion((prevLektion) =>
          prevLektion
            ? {
                ...prevLektion,
                fragen: prevLektion.fragen.filter((f) => f.id !== frageId),
              }
            : null,
        );
      } else {
        console.error("Failed to delete frage");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Wenn eine Frage geändert wird, die EditingFrageID und die EditedFrage auf die jeweiligen Details setzen
  const handleEdit = (frage: Frage) => {
    setEditingFrageId(frage.id);
    setEditedFrage(frage.frage);
  };

  //Anzahl der richtig beantworteten Fragen anzeigen
  const getCorrectQuestionsCount = () => {
    if (!lektion) return 0;
    return lektion.fragen.filter((frage) =>
      answeredRightQuestions.includes(frage.id),
    ).length;
  };

  //Totale Anzahl der Fragen anzeigen
  const getTotalQuestionsCount = () => {
    if (!lektion) return 0;
    return lektion.fragen.length;
  };

  //Wenn params.id, params.lektionId, fetchLektion oder fetchAnsweredQuestions sich ändern, Lektion und beantworte Fragen
  //vom Backend fetchen
  useEffect(() => {
    if (params.id && params.lektionId) {
      fetchLektion();
      fetchAnsweredQuestions();
    }
  }, [params.id, params.lektionId, fetchLektion, fetchAnsweredQuestions]);

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1%", fontSize: "2rem" }}>
        {lektion ? lektion.name : "Loading..."}
      </h1>
      <Link href={`/Kurse/${params.id}`}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          className="m-5"
        >
          Zurück
        </Button>
      </Link>
      {/*Anzahl der beantworteten Fragen anzeigen*/}
      <h2 style={{ textAlign: "center", margin: "1%", fontSize: "1.5rem" }}>
        Du hast {getCorrectQuestionsCount()} von {getTotalQuestionsCount()}{" "}
        Fragen richtig beantwortet.
      </h2>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {lektion && lektion.fragen.length > 0 ? (
          lektion.fragen.map((frage) => {
            const isAnswered = answeredQuestions.includes(frage.id);
            const isCorrect = answeredRightQuestions.includes(frage.id);
            return (
              <Card
                variant="outlined"
                key={frage.id}
                sx={{
                  width: "100%",
                  padding: 2,
                  boxSizing: "border-box",
                  backgroundColor: isAnswered
                    ? isCorrect
                      ? "#90EE90"
                      : "#FFB6C1"
                    : "white",
                  color: "black",
                }}
              >
                {editingFrageId === frage.id ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={editedFrage}
                      onChange={(e) => setEditedFrage(e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button onClick={() => handleSave(frage.id)}>Save</Button>
                  </Box>
                ) : (
                  <h3>{frage.frage}</h3>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button>
                    <Link
                      href={`/Kurse/${params.id}/Lektion/${lektion.id}/Frage/${frage.id}`}
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                      Zur Frage
                    </Link>
                  </Button>
                  {user?.isAdmin && (
                    <Box sx={{ display: "flex", gap: 0.2 }} fontSize="small">
                      <IconButton onClick={() => handleEdit(frage)}>
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(frage.id)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })
        ) : (
          <p>Loading Fragen...</p>
        )}
      </Box>
      {user && user.isAdmin && lektion && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CreateFrageModal
            fetchLektion={fetchLektion}
            kursId={params.id}
            lektionId={lektion.id}
          />
        </Box>
      )}
    </>
  );
}
