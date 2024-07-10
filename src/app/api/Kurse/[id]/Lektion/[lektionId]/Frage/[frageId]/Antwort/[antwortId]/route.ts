import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// [DELETE] löscht eine Antwort basierend auf der ID, die in der URL angegeben ist.
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const antwortId = url.pathname.split("/").pop();

  if (!antwortId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const antwort = await prisma.anwort.delete({
      where: { id: parseInt(antwortId) },
    });

    if (!antwort) {
      return NextResponse.json({ error: "Antwort not found" }, { status: 404 });
    }

    return NextResponse.json(antwort, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Antwort" },
      { status: 500 },
    );
  }
}

// [PATCH] aktualisiert den Inhalt und den isCorrect-Status einer Antwort basierend auf der ID und den bereitgestellten Daten.
export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const antwortId = url.pathname.split("/").pop();
  if (!antwortId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { content, isCorrect } = await req.json();

    if (content === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: "Missing content or isCorrect" },
        { status: 400 },
      );
    }

    const antwort = await prisma.anwort.update({
      where: { id: parseInt(antwortId) },
      data: { content, isCorrect },
    });

    if (!antwort) {
      return NextResponse.json({ error: "Antwort not found" }, { status: 404 });
    }

    return NextResponse.json(antwort, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Antwort" },
      { status: 500 },
    );
  }
}
