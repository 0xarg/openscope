/*
  Warnings:

  - Made the column `status` on table `UserIssue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserIssue" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'in-progress';
