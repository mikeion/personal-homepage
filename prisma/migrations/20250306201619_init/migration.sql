-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "description" TEXT NOT NULL,
    "venue" TEXT,
    "year" INTEGER NOT NULL,
    "date" TEXT,
    "status" TEXT,
    "type" TEXT NOT NULL,
    "doi" TEXT,
    "pdfLink" TEXT,
    "projectLink" TEXT,
    "location" TEXT,
    "award" TEXT,
    "volume" TEXT,
    "pages" TEXT,
    "publisher" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PublicationToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_KeywordToPublication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_KeywordToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_name_key" ON "Keyword"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchArea_name_key" ON "ResearchArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PublicationToResearchArea_AB_unique" ON "_PublicationToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_PublicationToResearchArea_B_index" ON "_PublicationToResearchArea"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToPublication_AB_unique" ON "_KeywordToPublication"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToPublication_B_index" ON "_KeywordToPublication"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToResearchArea_AB_unique" ON "_KeywordToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToResearchArea_B_index" ON "_KeywordToResearchArea"("B");

-- AddForeignKey
ALTER TABLE "_PublicationToResearchArea" ADD CONSTRAINT "_PublicationToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToResearchArea" ADD CONSTRAINT "_PublicationToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToPublication" ADD CONSTRAINT "_KeywordToPublication_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToPublication" ADD CONSTRAINT "_KeywordToPublication_B_fkey" FOREIGN KEY ("B") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToResearchArea" ADD CONSTRAINT "_KeywordToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToResearchArea" ADD CONSTRAINT "_KeywordToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
