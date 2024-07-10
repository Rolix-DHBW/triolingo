import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// [GET] ruft alle Kurse ab.
export async function GET() {
  try {
    const kurse = await prisma.kurs.findMany();
    return NextResponse.json(kurse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch kurse" },
      { status: 500 },
    );
  }
}

// [POST] erstellt einen neuen Kurs basierend auf dem bereitgestellten Namen.
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    await prisma.kurs.create({
      data: { name },
    });

    return NextResponse.json({ message: "Created Kurse" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create kurs" },
      { status: 500 },
    );
  }
}
