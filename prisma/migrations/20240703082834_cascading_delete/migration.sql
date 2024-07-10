-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anwort" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Anwort_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Frage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Anwort" ("content", "id", "isCorrect", "questionId") SELECT "content", "id", "isCorrect", "questionId" FROM "Anwort";
DROP TABLE "Anwort";
ALTER TABLE "new_Anwort" RENAME TO "Anwort";
CREATE TABLE "new_Frage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "frage" TEXT NOT NULL,
    "lektionId" INTEGER NOT NULL,
    CONSTRAINT "Frage_lektionId_fkey" FOREIGN KEY ("lektionId") REFERENCES "Lektion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Frage" ("frage", "id", "lektionId") SELECT "frage", "id", "lektionId" FROM "Frage";
DROP TABLE "Frage";
ALTER TABLE "new_Frage" RENAME TO "Frage";
CREATE TABLE "new_Lektion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "kursId" INTEGER NOT NULL,
    CONSTRAINT "Lektion_kursId_fkey" FOREIGN KEY ("kursId") REFERENCES "Kurs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lektion" ("id", "kursId", "name") SELECT "id", "kursId", "name" FROM "Lektion";
DROP TABLE "Lektion";
ALTER TABLE "new_Lektion" RENAME TO "Lektion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
