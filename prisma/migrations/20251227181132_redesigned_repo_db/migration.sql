/*
  Warnings:

  - You are about to drop the column `type` on the `Repository` table. All the data in the column will be lost.
  - Added the required column `description` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forks` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueCount` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "type",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "forks" INTEGER NOT NULL,
ADD COLUMN     "issueCount" INTEGER NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "stars" INTEGER NOT NULL;
