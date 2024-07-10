import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// [PATCH] aktualisiert die Beantwortung einer Frage durch einen Benutzer, einschließlich der Korrektheit der Antwort.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string; frageId: string } },
) {
  const { userId, frageId } = params;
  const { isCorrect } = await req.json();

  if (!userId || !frageId) {
    return NextResponse.json(
      { error: "Missing userId or frageId" },
      { status: 400 },
    );
  }

  try {
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        questionsAnswered: {
          connect: { id: Number(frageId) },
        },
        ...(isCorrect && {
          questionsAnsweredRight: {
            connect: { id: Number(frageId) },
          },
        }),
      },
    });
    return NextResponse.json(
      { message: "Frage updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating Frage:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the Frage" },
      { status: 500 },
    );
  }
}
