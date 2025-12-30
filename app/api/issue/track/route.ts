import prisma from "@/db/prisma";
import { authOptions } from "@/lib/auth";
import { fetchGithubRepo } from "@/lib/utils/fetchGithubRepo";
import { mapGitHubRepo } from "@/lib/utils/mapGithubRepo";
import { IssueWithAI } from "@/types/ai/issueAI";
import { error } from "@/types/backendAPI/error";
import { GitHubRepository } from "@/types/github/repository";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const data = await req.json();
  const issue: IssueWithAI = data.issue;
  const owner: string = data.owner;
  const name: string = data.name;
  const status: string = data.status;

  try {
    let repo = await fetchGithubRepo(owner, name);

    if (!repo) {
      const res = await axios.get(issue.repositoryAPIUrl, {
        timeout: 10000,
      });
      repo = await mapGitHubRepo(res.data);
    }
    const repoDb = await prisma.repository.upsert({
      where: {
        name_owner: { name: name, owner: owner },
      },
      update: {},
      create: {
        githubUrl: repo.htmlUrl,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        forks: repo.forks,
        issueCount: repo.openIssues,
        prCount: repo.openPrs,
        language: repo.primaryLanguage,
        stars: repo.stars,
        githubId: repo.githubId.toString(),
        ownerAvatarUrl: repo.owner.avatarUrl,
        license: repo.license,
        defaultBranch: repo.defaultBranch,
      },
    });

    const issueDb = await prisma.issue.upsert({
      where: {
        githubId: issue.githubId.toString(),
      },
      update: {},
      create: {
        githubUrl: issue.htmlUrl,
        repoId: repoDb.id,
        body: issue.body,
        githubId: issue.githubId.toString(),
        title: issue.title,
        labels: issue.labels.map((label) => label.name),
        commentsCount: issue.commentsCount,
        githubApiUrl: issue.apiUrl,
        githubClosedAt: issue.closedAt,
        githubCreatedAt: issue.createdAt,
        githubNumber: issue.number,
        githubUpdatedAt: issue.updatedAt,
        isPullRequest: issue.isPullRequest,
        repositoryAPIUrl: issue.repositoryAPIUrl,
        state: issue.state,
      },
    });

    const userIssueDb = await prisma.userIssue.upsert({
      where: {
        userId_issueId_githubId: {
          userId,
          issueId: issueDb.id,
          githubId: issueDb.githubId.toString(),
        },
      },
      update: {},
      create: {
        userId,
        issueId: issueDb.id,
        githubId: issueDb.githubId.toString(),
        status: status,
        notes: issue.notes,
        summary: issue.ai?.summary,
        difficulty: issue.ai?.difficulty,
        skills: issue.ai?.skills,
        cause: issue.ai?.cause,
        approach: issue.ai?.approach,
        estimatedTime: issue.ai?.estimatedTime,
        matchScore: issue.ai?.matchScore?.toString(),
        filestoExplore: issue.ai?.filestoExplore,
      },
    });

    return NextResponse.json(
      {
        message: "Issue tracked",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(error);
    return NextResponse.json(
      {
        message: message,
      },
      { status: 500 }
    );
  }
}
