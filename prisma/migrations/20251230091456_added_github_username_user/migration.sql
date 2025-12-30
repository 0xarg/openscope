/*
  Warnings:

  - A unique constraint covering the columns `[githubUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubUsername` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubUsername" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUsername_key" ON "User"("githubUsername");
