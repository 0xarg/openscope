/*
  Warnings:

  - You are about to drop the `_UserRepos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserIssue" DROP CONSTRAINT "UserIssue_issueId_fkey";

-- DropForeignKey
ALTER TABLE "UserIssue" DROP CONSTRAINT "UserIssue_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserRepos" DROP CONSTRAINT "_UserRepos_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRepos" DROP CONSTRAINT "_UserRepos_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "githubUsername" DROP NOT NULL;

-- DropTable
DROP TABLE "_UserRepos";

-- CreateTable
CREATE TABLE "UserRepository" (
    "userId" INTEGER NOT NULL,
    "repoId" INTEGER NOT NULL,

    CONSTRAINT "UserRepository_pkey" PRIMARY KEY ("userId","repoId")
);

-- AddForeignKey
ALTER TABLE "UserIssue" ADD CONSTRAINT "UserIssue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIssue" ADD CONSTRAINT "UserIssue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRepository" ADD CONSTRAINT "UserRepository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRepository" ADD CONSTRAINT "UserRepository_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
