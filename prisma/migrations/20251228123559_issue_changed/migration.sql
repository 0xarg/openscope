/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Issue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubId]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[repoId,githubNumber]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubApiUrl` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubCreatedAt` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubNumber` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubUpdatedAt` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Made the column `githubId` on table `Issue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "updatedAt",
ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "githubApiUrl" TEXT NOT NULL,
ADD COLUMN     "githubClosedAt" TIMESTAMP(3),
ADD COLUMN     "githubCreatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "githubNumber" INTEGER NOT NULL,
ADD COLUMN     "githubUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isPullRequest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "githubId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Issue_githubId_key" ON "Issue"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_repoId_githubNumber_key" ON "Issue"("repoId", "githubNumber");
