export interface IssueDB {
  id: number;
  githubId: string;
  githubNumber: number;
  githubUrl: string;
  githubApiUrl: string;
  repositoryAPIUrl: string;

  title: string;
  body: string | null;

  state: "open" | "closed";
  isPullRequest: boolean;
  commentsCount: number;
  labels: string[];
  ailabels: string[];
  repoId: number;
  githubCreatedAt: string;
  githubUpdatedAt: string;
  githubClosedAt: string | null;

  createdAt: string;
}
