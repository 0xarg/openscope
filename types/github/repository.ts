export interface GitHubRepoOwner {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
  type: "User" | "Organization";
}

export interface GitHubRepository {
  githubId: string;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | "null";

  owner: GitHubRepoOwner;

  stars: number | 0;
  forks: number | 0;
  watchers: number | 0;
  openIssues: number | 0;
  openPrs?: number | 0;
  license: string | "unknown";
  defaultBranch: string;

  createdAt: string;
  updatedAt: string;
  pushedAt: string;

  primaryLanguage: string | "unkown";
  topics: string[];

  archived: boolean;
  allowForking: boolean;
  popularity: string;
}
