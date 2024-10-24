/*
  Warnings:

  - You are about to drop the column `currentStream` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Space` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('Public', 'Private');

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_userId_fkey";

-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_streamId_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_userId_fkey";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "currentStream",
DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "type" "SpaceType" NOT NULL DEFAULT 'Public';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "spaceId";

-- CreateTable
CREATE TABLE "_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_request" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_AB_unique" ON "_users"("A", "B");

-- CreateIndex
CREATE INDEX "_users_B_index" ON "_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_request_AB_unique" ON "_request"("A", "B");

-- CreateIndex
CREATE INDEX "_request_B_index" ON "_request"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Space_name_key" ON "Space"("name");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_request" ADD CONSTRAINT "_request_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_request" ADD CONSTRAINT "_request_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
