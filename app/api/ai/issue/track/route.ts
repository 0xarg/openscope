import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { safeParseAI } from "@/lib/utils/parseAIRes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const issueId = parseInt(searchParams.get("id")!);
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);

  if (!issueId) {
    return NextResponse.json(
      {
        message: "Valid params are missing",
      },
      { status: 500 }
    );
  }

  try {
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!issue || !user) {
      console.log("No Issue/User found with id");
      throw new Error("Issue/User not found");
    }

    const userExists = !!(await prisma.userIssue.findFirst({
      where: {
        userId,
        issueId: issue.id,
      },
    }));

    // console.log(userExists);

    if (userExists) {
      return NextResponse.json(
        {
          message: "Issue already in Track List!",
        },
        { status: 202 }
      );
    }
    const prompt = `
        You are a concise assistant help a user understand and solve a issue. Read user bio carefully and based on that configure recommendations. If the user bio is empty then generale recommendations should be given and if issue require more knowledge then knowledge user has based on his bio, you can say the user to not solve this or recommend learning those skills first. Input is a GitHub issue. Produce JSON only with keys:
        

        approach  -> Explain the best approach to solve the issue based on user bio in detail and a easy way.
        recommendations -> recommend what a user should do based on the issue and user bio in a detailed manner as sentence format, 

        Return JSON only. No prose.

        USER_BIO:
        ${user.bio}

        ISSUE_TITLE:
        ${issue?.title}

        ISSUE_BODY:
        ${issue?.body}

        ISSUE_CreatedAt:
        ${issue?.createdAt}
        ISSUE_Labels:
        ${issue?.labels}

        ISSUE_Skills:
        ${issue?.skills}

        ISSUE_Difficulty:
        ${issue?.difficulty}

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
    console.log(completion.choices[0].message);
    const response = completion.choices[0].message;
    const finaldata = safeParseAI(response.content ?? "");

    await prisma.userIssue.create({
      data: {
        userId,
        issueId: issue.id,
        approach: finaldata.approach ?? "",
        recommendation: finaldata.recommendations ?? "",
      },
    });
    return NextResponse.json(
      {
        message: "Issue tracked!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error ~ Tracking a Issue",
      },
      { status: 500 }
    );
  }
}
