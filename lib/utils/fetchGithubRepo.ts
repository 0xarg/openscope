import { RepositoryDB } from "@/types/database/github/repository";
import axios from "axios";
import { mapGitHubRepo } from "./mapGithubRepo";

export async function fetchGithubRepo(owner: string, name: string) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${name}`
    );
    if (res.status !== 200) {
      return null;
    }
    const repo = mapGitHubRepo(res.data);
    return repo;
  } catch (error) {
    return;
  }
}
