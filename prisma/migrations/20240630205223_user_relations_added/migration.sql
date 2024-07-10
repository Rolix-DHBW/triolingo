-- CreateTable
CREATE TABLE "_KurseAbgeschlossen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_KurseAbgeschlossen_A_fkey" FOREIGN KEY ("A") REFERENCES "Kurs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_KurseAbgeschlossen_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LektionenAbgeschlossen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LektionenAbgeschlossen_A_fkey" FOREIGN KEY ("A") REFERENCES "Lektion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LektionenAbgeschlossen_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserQuestionsAnsweredRight" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserQuestionsAnsweredRight_A_fkey" FOREIGN KEY ("A") REFERENCES "Frage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserQuestionsAnsweredRight_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_KurseAbgeschlossen_AB_unique" ON "_KurseAbgeschlossen"("A", "B");

-- CreateIndex
CREATE INDEX "_KurseAbgeschlossen_B_index" ON "_KurseAbgeschlossen"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LektionenAbgeschlossen_AB_unique" ON "_LektionenAbgeschlossen"("A", "B");

-- CreateIndex
CREATE INDEX "_LektionenAbgeschlossen_B_index" ON "_LektionenAbgeschlossen"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserQuestionsAnsweredRight_AB_unique" ON "_UserQuestionsAnsweredRight"("A", "B");

-- CreateIndex
CREATE INDEX "_UserQuestionsAnsweredRight_B_index" ON "_UserQuestionsAnsweredRight"("B");
