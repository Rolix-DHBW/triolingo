"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";

export default function Blog() {
  const { user } = useContext(UserContext);
  const [kurse, setKurse] = useState<Kurs[]>([]); // Zustand für Kurse initialisieren
  const [totalUsers, setTotalUsers] = useState<number>(0); // Zustand für Gesamtbenutzer initialisieren

  const fetchKursStatus = async () => {
    try {
      const response = await fetch("/api/Kurse/Status", {
        // Kursstatus von der API abrufen
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setKurse(data.kurseData);
        setTotalUsers(data.totalUsers); // Gesamtbenutzer im Zustand speichern
      } else {
        console.error("Failed to fetch kurse"); // Fehlermeldung ausgeben, wenn das Abrufen der Kurse fehlschlägt
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchKursStatus();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1%", fontSize: "2rem" }}>
        {kurse && kurse.length > 0 ? "Statistiken" : "Loading..."} //
        Überschrift abhängig von der Anzahl der Kurse anzeigen
      </h1>

      {user?.isAdmin ? ( // Wenn der Benutzer ein Administrator ist
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 className="m-3 font-bold">Benutzeranzahl: {totalUsers}</h2> //
            Anzahl der Benutzer anzeigen
            <TableContainer
              component={Paper}
              sx={{ width: "80%", maxWidth: 1200 }}
            >
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Kurs</TableCell>
                    <TableCell align="right">Abgeschlossene Nutzer</TableCell>
                    <TableCell align="right">In Prozent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kurse.map(
                    (
                      kurs, // Für jeden Kurs eine Zeile in der Tabelle erstellen
                    ) => (
                      <TableRow
                        key={kurs.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {kurs.name}
                        </TableCell>
                        {/* Anzahl der abgeschlossenen Nutzer anzeigen */}
                        <TableCell align="right">
                          {kurs.completedCount} / {totalUsers}
                        </TableCell>
                        {/* Prozentuale Abschlussrate anzeigen */}
                        <TableCell align="right">
                          {kurs.completedPercentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>Sei ein Admin um diese Statistik zu sehen</p> // Meldung anzeigen,
          wenn der Benutzer kein Administrator ist
        </Box>
      )}
    </>
  );
}
