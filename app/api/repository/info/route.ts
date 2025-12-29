import { mapGitHubRepo } from "@/lib/utils/mapGithubRepo";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const name = searchParams.get("name");

  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${name}`
    );
    return NextResponse.json(
      {
        repo: mapGitHubRepo(res.data),
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
