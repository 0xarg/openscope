import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { AddRepoSchema } from "@/lib/types";
import { fetchGithubRepo } from "@/lib/utils/fetchGithubRepo";
import { parseUrl } from "@/lib/utils/parseUrl";
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
    return NextResponse.json(
      {
        repos: user?.repos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);
  const data = await req.json();
  const parsedData = AddRepoSchema.safeParse(data);
  const githubUrl = parsedData.data?.githubUrl ?? "";
  const urlParsed = parseUrl(githubUrl);

  if (!urlParsed.owner || !urlParsed.repo) {
    return NextResponse.json(
      {
        message: "Invalid Github Url",
      },
      { status: 501 }
    );
  }
  const name = urlParsed.repo;
  const owner = urlParsed.owner ?? "";

  if (!parsedData.success) {
    return NextResponse.json(
      {
        message: parsedData.error.issues[0].message,
      },
      { status: 401 }
    );
  }

  try {
    const repo = await fetchGithubRepo(owner, name);
    if (!repo) {
      return NextResponse.json(
        {
          message: "Unable to fetch Repository information",
        },
        { status: 500 }
      );
    }

    const repoExist = await prisma.repository.findFirst({
      where: {
        owner,
        name,
        user: {
          some: {
            id: userId,
          },
        },
      },
    });
    const alreadyAdded = !!repoExist;

    if (alreadyAdded) {
      return NextResponse.json(
        {
          message: "Repository already added",
        },
        { status: 502 }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        repos: {
          connectOrCreate: {
            where: {
              name_owner: { name, owner },
            },
            create: {
              name: repo.name,
              owner: repo.owner.login,
              githubUrl: repo.htmlUrl,
              description: repo.description,
              language: repo.primaryLanguage,
              stars: repo.stars,
              forks: repo.forks,
              issueCount: repo.openIssues,
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Repository Added",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error fron route",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user.id);
  const searchParams = await req.nextUrl.searchParams;
  const repoId = parseInt(searchParams.get("id")!);

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        repos: {
          disconnect: {
            id: repoId,
          },
        },
      },
    });

    return NextResponse.json({
      message: "repo deleted",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error in deletion of repo",
    });
  }
}
