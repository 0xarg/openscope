import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session?.user.id);

  try {
    const userIssues = await prisma.userIssue.findMany({
      where: {
        userId,
      },
      include: {
        issue: true,
      },
    });

    if (!userIssues) {
      throw new Error("No issues found");
    }
    // console.log("-----------");
    // console.log(userIssues);

    return NextResponse.json(
      {
        userIssues: userIssues,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong ~ UserIssues fetching",
      },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const issueId = parseInt(searchParams.get("id")!);
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session?.user.id);

  try {
    const userIssues = await prisma.userIssue.findFirst({
      where: {
        userId: userId,
        id: issueId,
      },
      include: {
        issue: true,
      },
    });

    if (!userIssues) {
      throw new Error("No issues found");
    }

    return NextResponse.json(
      {
        userIssues,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong ~ UserIssues fetching",
      },
      { status: 500 }
    );
  }
}
