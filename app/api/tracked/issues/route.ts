import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        repos: true,
        issues: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "No user found",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error fetching user",
      },
      { status: 500 }
    );
  }
}
