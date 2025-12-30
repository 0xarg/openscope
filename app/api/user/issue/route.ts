import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { UserIssueDb } from "@/types/database/user/UserIssue";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const searchParams = await req.nextUrl.searchParams;
  const githubId = String(searchParams.get("githubId"));

  if (!githubId) {
    return NextResponse.json(
      {
        message: "Please provide githubId in URL",
      },
      { status: 400 }
    );
  }
  try {
    const userIssue = await prisma.userIssue.findUnique({
      where: {
        githubId,
        userId,
      },
    });

    return NextResponse.json(
      {
        userIssue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Unable fetch user issue",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const data = await req.json();
  const issue: UserIssueDb = data.payload;
  if (!issue) {
    return NextResponse.json(
      {
        message: "Please include issue in request body",
      },
      { status: 400 }
    );
  }

  try {
    const updatedUserIssue = await prisma.userIssue.update({
      where: {
        userId_issueId_githubId: {
          userId,
          issueId: issue.issueId,
          githubId: issue.githubId.toString(),
        },
      },
      data: {
        status: issue.status,
        notes: issue.notes,
      },
    });
    return NextResponse.json(
      {
        updatedUserIssue,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Unable to edit issue details",
      },
      { status: 500 }
    );
  }
}
