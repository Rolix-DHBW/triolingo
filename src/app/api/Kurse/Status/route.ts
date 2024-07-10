import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// [GET] ruft die Anzahl der Benutzer und den Status der Kurse ab, einschließlich der Anzahl der abgeschlossenen Kurse und des Prozentsatzes der abgeschlossenen Kurse.
export async function GET() {
  try {
    // Gesamte Benutzeranzahl abrufen
    const totalUsers = await prisma.user.count();

    const kurse = await prisma.kurs.findMany({
      include: {
        userAbgeschlossen: true,
      },
    });

    const kursStatus = kurse.map((kurs) => ({
      id: kurs.id,
      name: kurs.name,
      completedCount: kurs.userAbgeschlossen.length,
      completedPercentage: (kurs.userAbgeschlossen.length / totalUsers) * 100,
    }));

    const returnValue = {
      kurseData: kursStatus,
      totalUsers,
    };

    return NextResponse.json(returnValue, { status: 200 });
  } catch (error) {
    console.error("Error fetching kurs status:", error);
    return NextResponse.json(
      { error: "Failed to fetch kurs status" },
      { status: 500 },
    );
  }
}
