import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import { UserProvider } from "@/context/UserContext";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Triolingo - Deutschlands  Nummer 1 Lernplattform", // Der Titel für die Website
  description: "Die beste Lernplattform weltweit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <UserProvider>
          <ResponsiveAppBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
