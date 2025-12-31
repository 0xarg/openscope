-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateTable
CREATE TABLE "UserUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackedIssuesCount" INTEGER NOT NULL DEFAULT 0,
    "trackedReposCount" INTEGER NOT NULL DEFAULT 0,
    "aiRequestsToday" INTEGER NOT NULL DEFAULT 0,
    "aiRequestsMonth" INTEGER NOT NULL DEFAULT 0,
    "aiTokensToday" INTEGER NOT NULL DEFAULT 0,
    "aiTokensMonth" INTEGER NOT NULL DEFAULT 0,
    "lastDailyReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMonthlyReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "plan" "PlanType" NOT NULL DEFAULT 'FREE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_userId_key" ON "UserPlan"("userId");

-- AddForeignKey
ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
