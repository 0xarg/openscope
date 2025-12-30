/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `UserIssue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserIssue_githubId_key" ON "UserIssue"("githubId");
