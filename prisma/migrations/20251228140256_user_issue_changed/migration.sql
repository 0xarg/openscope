/*
  Warnings:

  - You are about to drop the column `cause` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "cause",
DROP COLUMN "difficulty",
DROP COLUMN "skills",
DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "UserIssue" ADD COLUMN     "cause" TEXT,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "summary" TEXT;
