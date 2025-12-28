import { GitHubRepository } from "@/types/github/repository";
import axios from "axios";

export async function filterTrendingRepo() {
  try {
    const res = await axios.get("/api/githubTrending");
    const repos: GitHubRepository[] = res.data.repos;
    const randomRepos = repos.sort(() => 0.5 - Math.random()).slice(0, 3);
    const trendingRepoNames = randomRepos.map((repo) => repo.fullName);
    return {
      trendingRepoNames,
    };
  } catch (error) {
    console.error(error);
    return;
  }
}
