import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// [GET] ruft eine Lektion basierend auf der ID ab und gibt auch die zugehörigen Fragen zurück.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lektionId = url.pathname.split("/").slice(-1)[0];

  if (!lektionId) {
    return NextResponse.json({ error: "Missing lektionId" }, { status: 400 });
  }

  try {
    const lektion = await prisma.lektion.findUnique({
      where: { id: Number(lektionId) },
      include: { fragen: true },
    });

    if (!lektion) {
      return NextResponse.json({ error: "Lektion not found" }, { status: 404 });
    }

    return NextResponse.json(lektion, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lektion" },
      { status: 500 },
    );
  }
}

// [POST] erstellt eine neue Frage für eine gegebene Lektion-ID.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const lektionId = url.pathname.split("/").slice(-1)[0];

  try {
    const { frage } = await req.json();

    if (!frage || !lektionId) {
      return NextResponse.json(
        { error: "Missing frage or lektionId" },
        { status: 400 },
      );
    }

    const lektion = await prisma.lektion.findUnique({
      where: { id: parseInt(lektionId) },
    });

    if (!lektion) {
      return NextResponse.json({ error: "Lektion not found" }, { status: 404 });
    }

    const newFrage = await prisma.frage.create({
      data: {
        frage,
        lektionId: parseInt(lektionId),
      },
    });

    return NextResponse.json(
      { message: "Created Frage", frage: newFrage },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating frage:", error);
    return NextResponse.json(
      { error: "Failed to create frage" },
      { status: 500 },
    );
  }
}

// [PATCH] aktualisiert den Namen einer Lektion oder den Inhalt einer Frage basierend auf der ID und den bereitgestellten neuen Daten.
export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const lektionId = url.pathname.split("/").slice(-1)[0];

  try {
    const { name, frageId, frage } = await req.json();

    if (!lektionId && !frageId) {
      return NextResponse.json(
        { error: "Missing lektionId or frageId" },
        { status: 400 },
      );
    }

    if (name) {
      const updatedLektion = await prisma.lektion.update({
        where: { id: parseInt(lektionId) },
        data: { name },
      });

      return NextResponse.json(
        { message: "Updated Lektion", lektion: updatedLektion },
        { status: 200 },
      );
    }

    if (frage && frageId) {
      const updatedFrage = await prisma.frage.update({
        where: { id: parseInt(frageId) },
        data: { frage },
      });

      return NextResponse.json(
        { message: "Updated Frage", frage: updatedFrage },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  } catch (error) {
    console.error("Error updating:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// [DELETE] löscht eine Lektion basierend auf der ID und entfernt auch alle zugehörigen Fragen.
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const lektionId = url.pathname.split("/").slice(-1)[0];

  try {
    if (!lektionId) {
      return NextResponse.json({ error: "Missing lektionId" }, { status: 400 });
    }

    const existingLektion = await prisma.lektion.findUnique({
      where: { id: parseInt(lektionId) },
      include: { fragen: true },
    });

    if (!existingLektion) {
      return NextResponse.json({ error: "Lektion not found" }, { status: 404 });
    }

    await prisma.frage.deleteMany({
      where: { lektionId: parseInt(lektionId) },
    });

    const deletedLektion = await prisma.lektion.delete({
      where: { id: parseInt(lektionId) },
    });

    return NextResponse.json(
      { message: "Deleted Lektion", lektion: deletedLektion },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting lektion:", error);
    return NextResponse.json(
      { error: "Failed to delete lektion" },
      { status: 500 },
    );
  }
}
