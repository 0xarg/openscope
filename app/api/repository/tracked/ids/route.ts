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
    const userRepos = await prisma.userRepository.findMany({
      where: {
        userId,
      },
      include: {
        repo: true,
      },
    });

    const trackedIds = userRepos.map(
      (ur: (typeof userRepos)[number]) => ur.repo.githubId
    );

    return NextResponse.json(
      {
        trackedIds,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
