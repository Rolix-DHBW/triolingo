import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// [GET] ruft einen Kurs basierend auf der ID ab.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const kurs = await prisma.kurs.findUnique({
      where: { id: parseInt(id) },
    });
    if (!kurs) {
      return NextResponse.json({ error: "Kurs not found" }, { status: 404 });
    }
    return NextResponse.json(kurs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch kurs" },
      { status: 500 },
    );
  }
}

// [PATCH] aktualisiert den Namen eines Kurses basierend auf der ID und den bereitgestellten neuen Daten.
export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  const { name } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const kurs = await prisma.kurs.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
    if (!kurs) {
      return NextResponse.json({ error: "Kurs not found" }, { status: 404 });
    }
    return NextResponse.json(kurs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update kurs" },
      { status: 500 },
    );
  }
}

// [DELETE] löscht einen Kurs basierend auf der ID.
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const kurs = await prisma.kurs.delete({
      where: { id: parseInt(id) },
    });
    if (!kurs) {
      return NextResponse.json({ error: "Kurs not found" }, { status: 404 });
    }
    return NextResponse.json(kurs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete kurs" },
      { status: 500 },
    );
  }
}
