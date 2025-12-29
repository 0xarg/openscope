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

  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;

  createdAt: string;
  updatedAt: string;
  pushedAt: string;

  primaryLanguage: string | "unkown";
  topics: string[];

  archived: boolean;
  allowForking: boolean;
  popularity: string;
}
