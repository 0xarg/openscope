import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);

  try {
    const userRepos = await prisma.repository.findMany({
      where: {
        user: {
          some: {
            id: userId,
          },
        },
      },
    });

    const trackedIds = userRepos.map((ur) => ur.githubId);

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
