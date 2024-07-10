"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function LogoutPage() {
  const { logout } = useContext(UserContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, textAlign: "center", maxWidth: 500 }}
      >
        <Typography variant="h4" gutterBottom>
          Willst du dich wirklich ausloggen?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => logout()} // Funktion logout aufrufen, wenn der Button geklickt wird
            sx={{ marginRight: 2 }}
            href="/" // Link zur Startseite
          >
            Logout
          </Button>
          {/* Button zum Abbrechen des Logout-Vorgangs */}
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            href="/"
          >
            Abbrechen
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
