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
You are a senior open-source engineer and community reviewer.

Your task is to analyze a GitHub repository and produce **advanced, high-signal insights**
to help a developer decide whether this repository is worth contributing to.

You MUST base your analysis ONLY on the information provided.
If something cannot be inferred confidently, make a reasonable, conservative estimate.
Do NOT hallucinate internal repo details.

Rules:
- Be realistic and practical (no marketing language).
- Consider repo popularity, activity, and signals of maintenance.
- Scores must be integers between 0–100.
- Use concise but meaningful explanations.
- Return JSON ONLY. No prose, no markdown.

Produce JSON with EXACTLY these keys and formats:

summary: string (1–2 sentences max)

contributorFriendliness: "high" | "medium" | "low"

activityLevel: "very active" | "active" | "moderate" | "low"

codeQuality: number (0–100)
communityScore: number (0–100)

documentationQuality: 
  "Excellent" | "Good" | "Fair" | "Poor"

bestFor: string[]  
  (Examples: 
   "Learning modern development practices",
   "First-time open source contributors",
   "Production-grade contributions",
   "Advanced system design")

hotAreas: string[]  
  (Examples:
   "Bug fixes",
   "Performance optimization",
   "Documentation improvements",
   "Refactoring",
   "Test coverage")

techStack: string[]  
  (Infer from repo topics, description, and ecosystem clues only)

-----------------------------------

USER_CONTEXT:

USER_BIO:
${user?.bio}

USER_SKILLS:
${user?.skills}

-----------------------------------

REPOSITORY_DATA:

REPO_FULL_NAME:
${repo.fullName ? repo.fullName : `${repo.owner.login}/${repo.name}`}

REPO_DESCRIPTION:
${repo.description}

REPO_CREATED_AT:
${repo.createdAt}

REPO_TOPICS:
${repo.topics}

REPO_STARS:
${repo.stars}

REPO_FORKS:
${repo.forks}

REPO_WATCHERS:
${repo.watchers}

REPO_OPEN_ISSUES:
${repo.openIssues}

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
    // console.log(finaldata);
    return NextResponse.json(
      {
        ai: {
          summary: finaldata.summary,
          contributorFriendliness: finaldata.contributorFriendliness,
          codeQuality: finaldata.codeQuality,
          activityLevel: finaldata.activityLevel,
          communityScore: finaldata.communityScore,
          bestFor: finaldata.bestFor,
          hotAreas: finaldata.hotAreas,
          techStack: finaldata.techStack,
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
