import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// [GET] ruft alle Benutzer ab.
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// [POST] erstellt einen neuen Benutzer basierend auf den bereitgestellten Daten.
export async function POST(req: Request) {
  const { name, email, password, isAdmin } = await req.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    const newUser = await prisma.user.create({
      data: { name, email, password, isAdmin },
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
