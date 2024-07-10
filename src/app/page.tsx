import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea, CardContent, CardMedia } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "2rem 1rem",
          backgroundColor: "#f0f4f8",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              // Die Schriftgrößen für verschiedene Displaygrößen anpassen
              xs: "25px",
              sm: "28px",
              md: "36px",
              lg: "48px",
              xl: "60px",
            },
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Willkommen zu{" "}
        </Typography>
        <Typography
          sx={{
            fontSize: {
              // Die Schriftgrößen für verschiedene Displaygrößen anpassen
              xs: "30px",
              sm: "35px",
              md: "40px",
              lg: "60px",
              xl: "100px",
            },
            fontWeight: "bold",
            background:
              "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)", // Rainbow-Colors als Farbe für den Text verwenden
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "2px black", // Eine dünne Umrandung um den Text für bessere Lesbarkeit
          }}
        >
          TRIOLINGO!
        </Typography>
        <Typography
          sx={{
            fontSize: {
              // Die Schriftgrößen für verschiedene Displaygrößen anpassen
              xs: "16px",
              sm: "18px",
              md: "20px",
            },
            color: "#555",
            marginTop: "1rem",
          }}
        >
          Starten Sie Ihr Lern-Abenteuer, indem Sie in der Nav Bar
          &quot;Kurse&quot; auswählen oder sich anmelden.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            // Je nach Bildschirmgröße verschiedene Layouts
            xs: "repeat(1, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: "2rem",
          maxWidth: "1300px",
          margin: "3rem auto",
          padding: "0 1rem",
        }}
      >
        {/* Karte für die Kurse */}
        <Link href="/Kurse" passHref>
          <Card sx={{ maxWidth: 345, mx: "auto" }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image="/Kurse.png"
                alt="Logo für Kurse"
                sx={{ height: 200, objectFit: "contain" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Kurse
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Navigieren Sie zu dieser Seite, um alle Kurse ansehen zu
                  können.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
        {/* Karte für die Statistiken */}
        <Link href="/Statistiken" passHref>
          <Card sx={{ maxWidth: 345, mx: "auto" }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image="/Statistiken.jpg"
                alt="Logo für Statistiken"
                sx={{ height: 200, objectFit: "contain" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Statistiken
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Navigieren Sie zu dieser Seite, um die Statistiken einsehen zu
                  können.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
        {/* Karte für den Blog */}
        <Link href="/Blog" passHref>
          <Card sx={{ maxWidth: 345, mx: "auto" }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image="/News.png"
                alt="Logo für Blog"
                sx={{ height: 200, objectFit: "contain" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Blog
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Navigieren Sie zu dieser Seite, um die neusten Blogposts zu
                  lesen.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Box>
    </>
  );
}
