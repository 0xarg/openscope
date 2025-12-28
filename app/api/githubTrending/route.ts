import { mapGitHubRepo } from "@/lib/utils/mapGithubRepo";
import { GitHubRepository } from "@/types/github/repository";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const sinceDate = new Date(Date.now()).toISOString().split("T")[0];

  try {
    const res = await axios.get(
      `https://api.github.com/search/repositories?q=stars:>1000&pushed:>${sinceDate}&sort=stars&order=desc&open_issues>50&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    if (res.status !== 200) {
      throw new Error("Error fetching trending repos");
    }
    const repos = res.data.items.map(mapGitHubRepo);

    return NextResponse.json(
      {
        repos,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
}
