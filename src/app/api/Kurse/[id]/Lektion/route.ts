import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// [GET] ruft alle Lektionen eines Kurses basierend auf der kursId ab.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const kursId = url.pathname.split("/").slice(-2)[0];

  if (!kursId) {
    return NextResponse.json({ error: "Missing kursId" }, { status: 400 });
  }

  try {
    const lektionen = await prisma.lektion.findMany({
      where: { kursId: parseInt(kursId) },
    });

    if (lektionen.length === 0) {
      return NextResponse.json(
        { error: "No Lektionen found for this Kurs" },
        { status: 404 },
      );
    }

    return NextResponse.json(lektionen, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lektionen" },
      { status: 500 },
    );
  }
}

// [POST] erstellt eine neue Lektion für einen gegebenen Kurs basierend auf der kursId.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const kursId = url.pathname.split("/").slice(-2)[0];

  try {
    const { name } = await req.json();

    if (!kursId || !name) {
      return NextResponse.json(
        { error: "Missing kursId or name" },
        { status: 400 },
      );
    }

    const kurs = await prisma.kurs.findUnique({
      where: { id: parseInt(kursId) },
    });

    if (!kurs) {
      return NextResponse.json({ error: "Kurs not found" }, { status: 404 });
    }

    const newLektion = await prisma.lektion.create({
      data: {
        name,
        kursId: parseInt(kursId),
      },
    });

    return NextResponse.json(
      { message: "Created Lektion", lektion: newLektion },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create lektion" },
      { status: 500 },
    );
  }
}
