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
  const issue: IssueWithAI = data.issue;

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

    const issueDB = await prisma.issue.findUnique({
      where: {
        githubId: issue.githubId.toString(),
      },
    });

    const issueExistsDB = !!issueDB;

    if (issueExistsDB) {
      const userIssue = await prisma.userIssue.findUnique({
        where: {
          userId_issueId_githubId: {
            userId,
            issueId: issueDB.id,
            githubId: issueDB.githubId.toString(),
          },
        },
      });
      const userIssueExists = !!userIssue;
      console.log(userIssueExists);
      const userSummary = !!userIssue?.summary;
      if (userIssueExists && userSummary) {
        return NextResponse.json(
          {
            ai: {
              summary: userIssue.summary,
              difficulty: userIssue.difficulty,
              skills: userIssue.skills,
              cause: userIssue.cause,
              approach: userIssue.approach,
              estimatedTime: userIssue.estimatedTime,
              matchScore: userIssue.matchScore,
              filestoExplore: userIssue.filestoExplore,
              generatedAt: userIssue.createdAt,
              model: "gpt-4o-mini",
            },
          },
          { status: 202 }
        );
      }
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
You are a senior open-source engineer and mentor.

Your task is to analyze a GitHub ISSUE and help a developer decide:
- whether this issue is suitable for them
- how difficult it is
- what skills are required
- how they should approach solving it

You MUST base your analysis ONLY on the provided data.
If something cannot be inferred confidently, make a conservative estimate.
Do NOT hallucinate repository internals or files that are not reasonably implied.

Rules:
- Be realistic and practical.
- Difficulty must reflect actual effort and context.
- Skills must be concrete and technical.
- Match score reflects how suitable this issue is for THIS user.
- Return JSON ONLY. No prose, no markdown.

Produce JSON with EXACTLY these keys and formats:

summary: string  
  (1–2 concise sentences explaining what the issue is about)

difficulty: "easy" | "medium" | "hard"

skills: string[]  
  (Concrete skills needed to solve the issue)

cause: string  
  (What likely caused this issue or why it exists)

approach: string[]  
  (Step-by-step high-level approach to solving the issue)

estimatedTime: string  
  (Example: "1-2 hours", "1-2 days", "Several days")

matchScore: number  
  (0–100 score based on how well this issue matches the user's background)

filestoExplore: string[]  
  (ONLY include files if they can be reasonably inferred from issue context;
   otherwise return a single string ["Exact files are not known"])

-----------------------------------

USER_CONTEXT:

USER_BIO:
${user?.bio || "Not provided"}

USER_SKILLS:
${user?.skills?.join(", ") || "Not provided"}

-----------------------------------

ISSUE_DATA:

ISSUE_TITLE:
${issue.title}

ISSUE_BODY:
${issue.body || "No description provided"}

ISSUE_LABELS:
${issue.labels?.join(", ") || "None"}

ISSUE_CREATED_AT:
${issue.createdAt}

ISSUE_COMMENTS_COUNT:
${issue.commentsCount}

-----------------------------------

Return JSON only.
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
    const finaldata = safeParseAI(response.content ?? "");
    await prisma.userUsage.update({
      where: { userId },
      data: {
        aiRequestsToday: { increment: 1 },
        aiRequestsMonth: { increment: 1 },
      },
    });
    if (issueDB) {
      const userIssueDB = await prisma.userIssue.findUnique({
        where: {
          userId_issueId_githubId: {
            userId,
            issueId: issueDB.id,
            githubId: issueDB.githubId,
          },
        },
      });

      if (userIssueDB) {
        await prisma.userIssue.update({
          where: {
            userId_issueId_githubId: {
              userId,
              issueId: issueDB.id,
              githubId: issueDB.githubId,
            },
          },
          data: {
            summary: finaldata.summary,
            difficulty: finaldata.difficulty,
            skills: finaldata.skills,
            cause: finaldata.cause,
            approach: finaldata.approach,
            estimatedTime: finaldata.estimatedTime,
            matchScore: finaldata.matchScore.toString(),
            filestoExplore: finaldata.filestoExplore,
          },
        });
      }
    }

    // console.log(finaldata);
    return NextResponse.json(
      {
        ai: {
          summary: finaldata.summary,
          difficulty: finaldata.difficulty,
          skills: finaldata.skills,
          cause: finaldata.cause,
          approach: finaldata.approach,
          estimatedTime: finaldata.estimatedTime,
          matchScore: finaldata.matchScore,
          filestoExplore: finaldata.filestoExplore,
          generatedAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          model: "gpt-4o-mini",
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
