import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { UserIssueDb } from "@/types/database/user/UserIssue";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
        issue: {
          select: {
            githubId: true,
          },
        },
      },
    });

    const trackedIds = userIssues.map((ui) => ui.githubId.toString());
    return NextResponse.json(
      {
        trackedIds,
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
