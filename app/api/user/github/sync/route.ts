import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const githubUsername = session?.user.githubUsername;
  const userId = parseInt(session?.user.id);

  try {
    const res = await axios.get(
      `https://api.github.com/users/${githubUsername}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    const ghUser = res.data;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        location: ghUser.location,
        githubJoined: new Date(ghUser.created_at),
      },
    });
    return NextResponse.json(
      {
        message: "User details synced with github",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal sevrer error",
      },
      { status: 500 }
    );
  }
}
