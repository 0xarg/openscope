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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);
  const data = await req.json();
  console.log(data.skills);

  try {
    if (data.bio) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bio: data.bio,
        },
      });
      return NextResponse.json(
        {
          message: "Bio Updated",
        },
        { status: 201 }
      );
    } else if (data.skills) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          skills: data.skills,
        },
      });
      return NextResponse.json(
        {
          message: "Skills Updated",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Nothing Updated",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error updating user",
      },
      { status: 500 }
    );
  }
}
