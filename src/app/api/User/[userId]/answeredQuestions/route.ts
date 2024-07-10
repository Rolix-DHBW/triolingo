import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// [GET] ruft die Daten eines Benutzers und den Status der Lektionen und Kurse ab, die er abgeschlossen hat.
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  const kursId = req.nextUrl.searchParams.get("kursId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const parsedUserId = Number(userId);
  if (isNaN(parsedUserId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parsedUserId },
      include: {
        questionsAnswered: true,
        questionsAnsweredRight: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lektionen = await prisma.lektion.findMany({
      where: kursId ? { kursId: Number(kursId) } : undefined,
      include: { fragen: true },
    });

    const lektionenStatus = lektionen.map((lektion) => {
      const alleFragenIds = lektion.fragen.map((f) => f.id);
      const alleRichtigBeantwortet = alleFragenIds.every((fId) =>
        user.questionsAnsweredRight.some((q) => q.id === fId),
      );
      return {
        lektionId: lektion.id,
        alleRichtigBeantwortet,
      };
    });

    const kurse = await prisma.kurs.findMany({
      include: {
        lektionen: true,
      },
    });

    const kurseStatus = await Promise.all(
      kurse.map(async (kurs) => {
        const alleLektionenIds = kurs.lektionen.map((l) => l.id);
        const alleLektionenRichtigBeantwortet = alleLektionenIds.every(
          (lId) =>
            lektionenStatus.find((l) => l.lektionId === lId)
              ?.alleRichtigBeantwortet,
        );

        if (alleLektionenRichtigBeantwortet) {
          await prisma.$transaction([
            prisma.user.update({
              where: { id: parsedUserId },
              data: {
                kurseAbgeschlossen: {
                  connect: { id: kurs.id },
                },
              },
            }),
            prisma.kurs.update({
              where: { id: kurs.id },
              data: {
                userAbgeschlossen: {
                  connect: { id: parsedUserId },
                },
              },
            }),
          ]);
        }

        return {
          kursId: kurs.id,
          alleLektionenRichtigBeantwortet,
        };
      }),
    );

    return NextResponse.json(
      {
        questionsAnswered: user.questionsAnswered.map((q) => q.id),
        questionsAnsweredRight: user.questionsAnsweredRight.map((q) => q.id),
        lektionenStatus,
        kurseStatus,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the user data" },
      { status: 500 },
    );
  }
}
