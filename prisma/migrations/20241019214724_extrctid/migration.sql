/*
  Warnings:

  - Added the required column `extractId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "extractId" TEXT NOT NULL;
