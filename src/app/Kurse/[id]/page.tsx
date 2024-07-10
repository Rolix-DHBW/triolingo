"use client";

import React, { useContext, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Link from "next/link";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { UserContext } from "@/context/UserContext";
import CreateLektionModal from "@/components/CreateLektionModal";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TextField from "@mui/material/TextField";

interface Params {
  params: {
    id: string;
  };
}

export default function KursSeite({ params }: Params) {
  const [kurs, setKurs] = useState<Kurs | null>(null);
  const [lektionen, setLektionen] = useState<Lektion[]>([]);
  const [lektionenStatus, setLektionenStatus] = useState<LektionStatus[]>([]);
  const [editingLektionId, setEditingLektionId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const { user } = useContext(UserContext);

  // Kurs mit der ID fetchen
  const fetchKurs = useCallback(async () => {
    try {
      const response = await fetch(`/api/Kurse/${params.id}`, {
        method: "GET",
      });
      if (response.ok) {
        const kursData = await response.json();
        setKurs(kursData);
      } else {
        console.error("Failed to fetch kurs");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [params.id]);

  // Lektionen des Kurses fetchen
  const fetchLektionen = useCallback(async () => {
    try {
      const response = await fetch(`/api/Kurse/${params.id}/Lektion`, {
        method: "GET",
      });
      if (response.ok) {
        const lektionenData = await response.json();
        setLektionen(lektionenData);
      } else {
        console.error("Failed to fetch lektionen");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [params.id]);

  // Beantwortete Fragen des Nutzers fetchen
  const fetchUserAnsweredQuestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/User/${user.id}/answeredQuestions`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setLektionenStatus(data.lektionenStatus);
      } else {
        console.error("Failed to fetch user answered questions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [user.id]);

  // Wenn eine Lektion bearbeitet wird, setze die EditingLektionId und den Namen auf die jeweiligen Details
  const handleEdit = (lektion: Lektion) => {
    setEditingLektionId(lektion.id);
    setEditedName(lektion.name);
  };

  // Wenn die Änderung gespeichert wird, einen API Call zum Backend machen
  const handleSave = async (lektionId: number) => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${lektionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedName }),
        },
      );
      if (response.ok) {
        setLektionen((prevLektionen) =>
          prevLektionen.map((l) =>
            l.id === lektionId ? { ...l, name: editedName } : l,
          ),
        );
        setEditingLektionId(null);
      } else {
        console.error("Failed to update lektion");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Wenn die Lektion gelöscht wird, einen API Call zum Backend machen
  const handleDelete = async (lektionId: number) => {
    try {
      const response = await fetch(
        `/api/Kurse/${params.id}/Lektion/${lektionId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setLektionen((prevLektionen) =>
          prevLektionen.filter((l) => l.id !== lektionId),
        );
      } else {
        console.error("Failed to delete lektion");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Wenn params.id, fetchKurs oder fetchLektionen sich ändern, Kurs und Lektionen vom Backend fetchen
  useEffect(() => {
    fetchKurs();
    fetchLektionen();
    if (user) {
      fetchUserAnsweredQuestions();
    }
  }, [params.id, user, fetchKurs, fetchLektionen, fetchUserAnsweredQuestions]);

  // Anzahl der abgeschlossenen Lektionen berechnen
  const getCompletedLessonsCount = () => {
    const completedLessonsIds = lektionenStatus
      .filter((status) => status.alleRichtigBeantwortet)
      .map((status) => status.lektionId);
    return lektionen.filter((lektion) =>
      completedLessonsIds.includes(lektion.id),
    ).length;
  };

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1%", fontSize: "2rem" }}>
        {kurs ? kurs.name : "Loading..."}
      </h1>
      <Link href={`/Kurse`}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          className="m-5"
        >
          Zurück
        </Button>
      </Link>
      <h2 style={{ textAlign: "center", margin: "1%", fontSize: "1.5rem" }}>
        Du hast {getCompletedLessonsCount()} von {lektionen.length} Lektionen
        abgeschlossen.
      </h2>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {lektionen.length > 0 ? (
          lektionen.map((lektion) => {
            const status = lektionenStatus.find(
              (status) => status.lektionId === lektion.id,
            );
            const backgroundColor = status?.alleRichtigBeantwortet
              ? "#90EE90"
              : "white";
            return (
              <Card
                variant="outlined"
                key={lektion.id}
                sx={{
                  width: "100%",
                  padding: 2,
                  boxSizing: "border-box",
                  backgroundColor: backgroundColor,
                }}
              >
                {editingLektionId === lektion.id ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button onClick={() => handleSave(lektion.id)}>Save</Button>
                  </Box>
                ) : (
                  <h3>{lektion.name}</h3>
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
                      href={`/Kurse/${params.id}/Lektion/${lektion.id}`}
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                      Zur Lektion
                    </Link>
                  </Button>
                  {user?.isAdmin && (
                    <Box sx={{ display: "flex", gap: 0.2 }} fontSize="small">
                      <IconButton onClick={() => handleEdit(lektion)}>
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(lektion.id)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </Box>
      {user?.isAdmin && kurs && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CreateLektionModal
            onLektionAdded={fetchLektionen}
            kursId={kurs.id}
          />
        </Box>
      )}
    </>
  );
}
