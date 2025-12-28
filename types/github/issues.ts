export interface GitHubUser {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface GitHubIssue {
  id?: number;
  githubId: string;
  number: number;

  title: string;
  body: string | null;

  state: "open" | "closed";
  isPullRequest: boolean;

  commentsCount: number;

  createdAt: string;
  updatedAt: string;
  closedAt: string | null;

  htmlUrl: string;
  apiUrl: string;
  repositoryAPIUrl: string;

  author: GitHubUser;
  labels: GitHubLabel[];
}

export interface GitHubIssueAPI {
  id: string;
  number: number;
  title: string;
  body: string | null;

  state: "open" | "closed";

  html_url: string;
  url: string;
  repository_url: string;

  comments: number;

  created_at: string;
  updated_at: string;
  closed_at: string | null;

  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };

  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string | null;
  }>;

  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    merged_at: string | null;
  };
}
