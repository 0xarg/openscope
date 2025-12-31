import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { PLAN_LIMITS } from "@/lib/billings/planLimits";
import {
  shouldResetDaily,
  shouldResetMonthly,
} from "@/lib/billings/resetUsage";
import { getOpenAI } from "@/lib/openai";
import { safeParseAI } from "@/lib/utils/parseAIRes";
import { IssueWithAI } from "@/types/ai/issueAI";
import { RepositoryWithAI } from "@/types/ai/repositoryAI";
import { PlanType } from "@/types/database/user/UserPlan";
import { GitHubIssue } from "@/types/github/issues";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session?.user.id);
  const data = await req.json();
  const repo: RepositoryWithAI = data.repo;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        usage: true,
        plan: true,
      },
    });
    if (!user || !user.plan || !user.usage) {
      return NextResponse.json(
        { message: "User billing info missing" },
        { status: 403 }
      );
    }

    const planType = user.plan.plan as PlanType;
    const usage = user.usage;
    const limits = PLAN_LIMITS[planType];

    if (shouldResetDaily(usage.lastDailyReset)) {
      await prisma.userUsage.update({
        where: { userId },
        data: {
          aiRequestsToday: 0,
          aiTokensToday: 0,
          lastDailyReset: new Date(),
        },
      });
      usage.aiRequestsToday = 0;
    }
    if (shouldResetMonthly(usage.lastMonthlyReset)) {
      await prisma.userUsage.update({
        where: { userId },
        data: {
          aiRequestsMonth: 0,
          aiTokensMonth: 0,
          lastMonthlyReset: new Date(),
        },
      });
      usage.aiRequestsMonth = 0;
    }
    if (
      usage.aiRequestsToday >= limits.aiRequestsPerDay ||
      usage.aiRequestsMonth >= limits.aiRequestsPerMonth
    ) {
      return NextResponse.json(
        {
          code: "AI_LIMIT_EXCEEDED",
          message: "AI usage limit reached. Upgrade your plan.",
        },
        { status: 429 }
      );
    }
    const prompt = `
You are an expert open-source mentor helping a developer decide whether he/she should try to contribute to this repository or not .

Read the USER_BIO and USER_SKILLS carefully and tailor your advice strictly to the user's background.

Rules:
- If the user lacks required skills, clearly say so.
- Be practical and honest.
- Do NOT hallucinate repo-specific details.
- Return JSON only.

Produce JSON with exactly these keys:
        match -> score out of 100 based on user's detail, higher score means he should contribute
        activityLevel -> activity level of the repository, make it one word.

        USER_BIO:
        ${user?.bio}

        USER_SKILLS:
        ${user?.skills}


        REPO_FUll_NAME:
        ${repo.fullName}

        REPO_DESCRIPTION:
        ${repo.description}

        REPO_CreatedAt:
        ${repo.createdAt}

        REPO_TOPICS:
        ${repo.topics}

        REPO_WATCHERS:
        ${repo.watchers}

        REPO_STARS:
        ${repo.stars}

        REPO_FORKS:
        ${repo.forks}

        REPO_ISSUES_COUNT:
        ${repo.openIssues}
        `;
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const response = completion.choices[0].message;
    // console.log(completion);
    const finaldata = safeParseAI(response.content ?? "");
    await prisma.userUsage.update({
      where: { userId },
      data: {
        aiRequestsToday: { increment: 1 },
        aiRequestsMonth: { increment: 1 },
      },
    });
    return NextResponse.json(
      {
        ai: {
          match: finaldata.match,
          activityLevel: finaldata.activityLevel,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
