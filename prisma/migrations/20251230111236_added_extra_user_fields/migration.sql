/*
  Warnings:

  - Added the required column `githubJoined` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubJoined" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "location" TEXT;
