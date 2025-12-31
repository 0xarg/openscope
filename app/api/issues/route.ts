import prisma from "@/db/prisma";
import { mapGitHubIssue } from "@/lib/utils/mapGithubIssue";
import { RepositoryDB } from "@/types/database/github/repository";
import { GitHubIssue, GitHubIssueAPI } from "@/types/github/issues";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const repos = await prisma.repository.findMany();
    type Repo = (typeof repos)[number];

    const issueRequests = repos.map(async (repo: Repo) => {
      try {
        const res = await axios.get(
          `https://api.github.com/repos/${repo.owner}/${repo.name}/issues`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          }
        );

        return {
          repoId: repo.id,
          name: repo.name,
          owner: repo.owner,
          issues: res.data,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    const results = await Promise.all(issueRequests);

    const validResults = results.filter(Boolean);

    const filteredIssues = validResults.flatMap(
      (repo: (typeof validResults)[number]) =>
        repo?.issues
          .filter((issue: GitHubIssueAPI) => !issue.pull_request)
          .map((issue: GitHubIssueAPI) => ({
            id: issue.number,
            body: issue.body,
            title: issue.title,
            state: issue.state,
            labels: issue.labels.map((l: { name: string }) => l.name),
            comments: issue.comments,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            url: issue.html_url,
            owner: repo.owner,
            name: repo.name,
          }))
    );

    return NextResponse.json({
      data: filteredIssues,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const owner = data.owner;
  const name = data.name;

  try {
    const res = await axios.get<GitHubIssueAPI[]>(
      `https://api.github.com/repos/${owner}/${name}/issues?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    const issues: GitHubIssue[] = res.data
      .filter((issue: any) => !issue.pull_request)
      .map(mapGitHubIssue);

    return NextResponse.json(
      {
        issues,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error 3.0",
      },
      { status: 500 }
    );
  }
}
