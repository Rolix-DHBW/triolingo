import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// [GET] ruft eine Frage basierend auf der ID ab und gibt auch die zugehörigen Antworten zurück.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const frageId = url.pathname.split("/").pop();

  if (!frageId) {
    return NextResponse.json({ error: "Fehlende frageId" }, { status: 400 });
  }

  try {
    const frage = await prisma.frage.findUnique({
      where: { id: parseInt(frageId) },
      include: { antworten: true },
    });

    if (!frage) {
      return NextResponse.json(
        { error: "Frage nicht gefunden" },
        { status: 404 },
      );
    }

    return NextResponse.json(frage, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Frage" },
      { status: 500 },
    );
  }
}

// [POST] erstellt eine neue Antwort für eine gegebene Frage-ID.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const frageId = url.pathname.split("/").slice(-1)[0];

  try {
    const { antwort, isTrue } = await req.json();

    if (!antwort || !frageId || isTrue === undefined) {
      return NextResponse.json(
        { error: "Missing frage or frageId" },
        { status: 400 },
      );
    }

    const frage = await prisma.frage.findUnique({
      where: { id: parseInt(frageId) },
    });

    if (!frage) {
      return NextResponse.json({ error: "Frage not found" }, { status: 404 });
    }

    const newAnswer = await prisma.anwort.create({
      data: {
        content: antwort,
        questionId: parseInt(frageId),
        isCorrect: isTrue,
      },
    });

    return NextResponse.json(
      { message: "Created Answer", frage: newAnswer },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating antwort:", error);
    return NextResponse.json(
      { error: "Failed to create antwort" },
      { status: 500 },
    );
  }
}

// [DELETE] löscht eine Frage basierend auf der ID, die in der URL angegeben ist.
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const frageId = url.pathname.split("/").slice(-1)[0];

  if (!frageId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const frage = await prisma.frage.delete({
      where: { id: parseInt(frageId) },
    });
    if (!frage) {
      return NextResponse.json({ error: "Frage not found" }, { status: 404 });
    }
    return NextResponse.json(frage, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Frage" },
      { status: 500 },
    );
  }
}

// [PATCH] aktualisiert den Inhalt einer Frage basierend auf der ID und den bereitgestellten neuen Daten.
export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const frageId = url.pathname.split("/").slice(-1)[0];

  const { neueFrage } = await req.json();
  if (!frageId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const frage = await prisma.frage.update({
      where: { id: parseInt(frageId) },
      data: { frage: neueFrage },
    });
    if (!frage) {
      return NextResponse.json({ error: "Frage not found" }, { status: 404 });
    }
    return NextResponse.json(frage, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Frage" },
      { status: 500 },
    );
  }
}
