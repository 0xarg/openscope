import { mapGitHubRepo } from "@/lib/utils/mapGithubRepo";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const name = searchParams.get("name");

  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${name}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    return NextResponse.json(
      {
        repo: await mapGitHubRepo(res.data),
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error fetching repository details",
      },
      { status: 500 }
    );
  }
}
