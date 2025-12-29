import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { safeParseAI } from "@/lib/utils/parseAIRes";
import { IssueWithAI } from "@/types/ai/issueAI";
import { GitHubIssue } from "@/types/github/issues";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);
  const data = await req.json();
  const issue: IssueWithAI = data.issue;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const prompt = `
You are an expert open-source mentor helping a developer decide whether and how to solve a GitHub issue.

Read the USER_BIO and USER_SKILLS carefully and tailor your advice strictly to the user's background.

Rules:
- If the user lacks required skills, clearly say so.
- If the issue is too advanced, recommend learning steps first.
- Be practical and honest.
- Do NOT hallucinate repo-specific details.
- Return JSON only.

Produce JSON with exactly these keys:
        difficulty -> easy | medium | hard
        skills -> Skills needed to solve this issue -> array of skill, like [skill1, skill2] etc.
        estimatedTime -> Estimated time required to solve this, this should be string like "2-4 hours".

        USER_BIO:
        ${user?.bio}

        USER_SKILLS:
        ${user?.skills}


        ISSUE_TITLE:
        ${issue?.title}

        ISSUE_BODY:
        ${issue?.body}

        ISSUE_CreatedAt:
        ${issue?.createdAt}

        ISSUE_Labels:
        ${issue?.labels}

        TOTAL_ISSUE_COMMENTS:
        ${issue.commentsCount}
        `;
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
    return NextResponse.json(
      {
        ai: {
          difficulty: finaldata.difficulty,
          skills: finaldata.skills,
          estimatedTime: finaldata.estimatedTime,
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
