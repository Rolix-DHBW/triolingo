/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Course";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Question";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Kurs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Lektion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "kursId" INTEGER NOT NULL,
    CONSTRAINT "Lektion_kursId_fkey" FOREIGN KEY ("kursId") REFERENCES "Kurs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Frage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "frage" TEXT NOT NULL,
    "lektionId" INTEGER NOT NULL,
    CONSTRAINT "Frage_lektionId_fkey" FOREIGN KEY ("lektionId") REFERENCES "Lektion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Frage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("content", "id", "isCorrect", "questionId") SELECT "content", "id", "isCorrect", "questionId" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Answer" RENAME TO "Page";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__UserQuestionsAnswered" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserQuestionsAnswered_A_fkey" FOREIGN KEY ("A") REFERENCES "Frage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserQuestionsAnswered_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__UserQuestionsAnswered" ("A", "B") SELECT "A", "B" FROM "_UserQuestionsAnswered";
DROP TABLE "_UserQuestionsAnswered";
ALTER TABLE "new__UserQuestionsAnswered" RENAME TO "_UserQuestionsAnswered";
CREATE UNIQUE INDEX "_UserQuestionsAnswered_AB_unique" ON "_UserQuestionsAnswered"("A", "B");
CREATE INDEX "_UserQuestionsAnswered_B_index" ON "_UserQuestionsAnswered"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
