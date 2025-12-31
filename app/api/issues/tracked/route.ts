import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session?.user.id);
  try {
    const issues = await prisma.userIssue.findMany({
      where: {
        userId,
      },
      include: {
        issue: {
          include: {
            repo: true,
          },
        },
      },
    });
    if (!issues) {
      return NextResponse.json(
        {
          message: "No issues found",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      issues,
    });
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
