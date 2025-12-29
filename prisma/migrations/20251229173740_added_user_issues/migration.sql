/*
  Warnings:

  - You are about to drop the column `recommendation` on the `UserIssue` table. All the data in the column will be lost.
  - The `approach` column on the `UserIssue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,issueId,githubId]` on the table `UserIssue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubId` to the `UserIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchScore` to the `UserIssue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserIssue_userId_issueId_key";

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "defaultBranch" TEXT,
ADD COLUMN     "githubId" TEXT,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "ownerAvatarUrl" TEXT,
ADD COLUMN     "prCount" INTEGER;

-- AlterTable
ALTER TABLE "UserIssue" DROP COLUMN "recommendation",
ADD COLUMN     "estimatedTime" TEXT,
ADD COLUMN     "filestoExplore" TEXT[],
ADD COLUMN     "githubId" TEXT NOT NULL,
ADD COLUMN     "matchScore" TEXT NOT NULL,
DROP COLUMN "approach",
ADD COLUMN     "approach" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "UserIssue_userId_issueId_githubId_key" ON "UserIssue"("userId", "issueId", "githubId");
