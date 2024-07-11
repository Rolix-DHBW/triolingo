"use client";

import React, {useCallback, useContext, useEffect, useState} from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import {UserContext} from "@/context/UserContext";
import CreateCourseModal from "@/components/CreateCourseModal";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function KurseSeite() {
    const [kurse, setKurse] = useState<Kurs[]>([]);
    const [kursStatus, setKursStatus] = useState<KursStatus[]>([]);
    const [editingKursId, setEditingKursId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const {user} = useContext(UserContext);

    // Alle Kurse fetchen
    const fetchKurse = async () => {
        try {
            const response = await fetch("/api/Kurse", {
                method: "GET",
            });
            if (response.ok) {
                const kurseData = await response.json();
                setKurse(kurseData);
            } else {
                console.error("Failed to fetch kurse");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Status der Kurse des Nutzers fetchen
    const fetchKursStatus = useCallback(async () => {
        if (!user?.id) {
            console.error("No user ID found");
            return;
        }
        try {
            const response = await fetch(`/api/User/${user.id}/answeredQuestions`, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                setKursStatus(data.kurseStatus);
            } else {
                const errorData = await response.json();
                console.error("Fehler beim Abrufen des Kursstatus:", errorData.error);
            }
        } catch (error) {
            console.error("Fehler:", error);
        }
    }, [user?.id]);

    // Wenn ein Kurs bearbeitet wird, setze die EditingKursId und den Namen auf die jeweiligen Details
    const handleEdit = (kurs: Kurs) => {
        setEditingKursId(kurs.id);
        setEditedName(kurs.name);
    };

    // Wenn der Kurs gelöscht wird, einen API Call zum Backend machen
    const handleDelete = async (kursId: number): Promise<void> => {
        try {
            const response = await fetch(`/api/Kurse/${kursId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setKurse((kurse) => kurse?.filter((kurs) => kurs.id !== kursId) || []);
            } else {
                console.error("Failed to delete kurs");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Wenn die Änderung gespeichert wird, einen API Call zum Backend machen
    const handleSave = async (kursId: number) => {
        try {
            const response = await fetch(`/api/Kurse/${kursId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: editedName}),
            });
            if (response.ok) {
                setKurse(
                    (kurse) =>
                        kurse?.map((kurs) =>
                            kurs.id === kursId ? {...kurs, name: editedName} : kurs,
                        ) || [],
                );
                setEditingKursId(null);
            } else {
                console.error("Failed to update kurs");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Wenn user oder fetchKursStatus sich ändern, Kurse und Status der Kurse fetchen
    useEffect(() => {
        fetchKurse();
        if (user) {
            fetchKursStatus();
        }
    }, [user, fetchKursStatus]);

    // Hintergrundfarbe basierend auf dem Kursstatus festlegen
    const getBackgroundColor = (kursId: number) => {
        const status = kursStatus.find((status) => status.kursId === kursId);
        return status?.alleLektionenRichtigBeantwortet ? "#90EE90" : "white";
    };

    // Anzahl der abgeschlossenen Kurse berechnen
    const getCompletedCoursesCount = () => {
        return kursStatus.filter((status) => status.alleLektionenRichtigBeantwortet)
            .length;
    };

    return (
        <>
            <h1 style={{textAlign: "center", margin: "1%", fontSize: "2rem"}}>
                Kurse
            </h1>
            <Link href={`/`}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{marginTop: 2}}
                    className="m-5"
                >
                    Home
                </Button>
            </Link>
            <h2 style={{textAlign: "center", margin: "1%", fontSize: "1.5rem"}}>
                Du hast {getCompletedCoursesCount()} von {kurse.length} Kursen
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
                {kurse ? (
                    kurse.map((kurs) => (
                        <Card
                            variant="outlined"
                            key={kurs.id}
                            sx={{
                                width: "100%",
                                padding: 2,
                                boxSizing: "border-box",
                                backgroundColor: getBackgroundColor(kurs.id),
                                color: "black",
                            }}
                        >
                            {editingKursId === kurs.id ? (
                                <Box sx={{display: "flex", alignItems: "center"}}>
                                    <TextField
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        size="small"
                                        sx={{flex: 1}}
                                    />
                                    <Button onClick={() => handleSave(kurs.id)}>Save</Button>
                                </Box>
                            ) : (
                                <h3>{kurs.name}</h3>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Link
                                    href={`/Kurse/${kurs.id}`}
                                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                >
                                    <Button>
                                        Zum Kurs
                                    </Button>
                                </Link>

                                {user?.isAdmin && (
                                    <Box sx={{display: "flex", gap: 0.2}} fontSize="small">
                                        <IconButton onClick={() => handleEdit(kurs)}>
                                            <EditOutlinedIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(kurs.id)}>
                                            <DeleteOutlineOutlinedIcon/>
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </Box>
            {user?.isAdmin && (
                <Box sx={{display: "flex", justifyContent: "center", marginTop: 4}}>
                    <CreateCourseModal fetchFrage={fetchKurse}/>
                </Box>
            )}
        </>
    );
}
