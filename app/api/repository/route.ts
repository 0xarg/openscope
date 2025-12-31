import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { AddRepoSchema } from "@/lib/types";
import { fetchGithubRepo } from "@/lib/utils/fetchGithubRepo";
import { parseUrl } from "@/lib/utils/parseUrl";
import { UserRepositoryWithRepo } from "@/types/database/user/UserRepos";
import { GitHubRepository } from "@/types/github/repository";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session?.user.id);
  try {
    const repos = await prisma.userRepository.findMany({
      where: {
        userId,
      },
      include: {
        repo: true,
      },
    });
    return NextResponse.json(
      {
        repos: repos.map((r: (typeof repos)[number]) => r.repo),
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
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
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
    const repoData = await fetchGithubRepo(owner, name);
    if (!repoData) {
      return NextResponse.json(
        {
          message: "Unable to fetch Repository information",
        },
        { status: 500 }
      );
    }

    const repository = await prisma.repository.upsert({
      where: {
        name_owner: {
          name,
          owner,
        },
      },
      update: {},
      create: {
        name: repoData.name,
        owner: repoData.owner.login,
        githubUrl: repoData.htmlUrl,
        githubId: repoData.githubId.toString(),
        ownerAvatarUrl: repoData.owner.avatarUrl,
        description: repoData.description,
        language: repoData.primaryLanguage,
        stars: repoData.stars,
        forks: repoData.forks,
        issueCount: repoData.openIssues,
        prCount: repoData.openPrs,
        license: repoData.license,
        defaultBranch: repoData.defaultBranch,
      },
    });

    await prisma.userRepository.create({
      data: {
        userId,
        repoId: repository.id,
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
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session?.user.id);
  const searchParams = await req.nextUrl.searchParams;

  const repoId = Number(searchParams.get("id"));

  if (!repoId) {
    return NextResponse.json(
      { message: "Repository id missing" },
      { status: 400 }
    );
  }

  try {
    await prisma.userRepository.delete({
      where: {
        userId_repoId: { userId, repoId },
      },
    });

    return NextResponse.json({
      message: "Repository removed for user",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error in deletion of repo",
    });
  }
}
