import { GitHubIssue } from "@/types/github/issues";
import { GitHubRepository } from "@/types/github/repository";
import { RepositoryDB } from "./repository";
import { IssueDB } from "./issue";

export interface UserIssues {
  id: number;

  userId: number;
  issueId: number;

  summary: string | null;
  difficulty: string | null;
  skills: string[];
  cause: string | null;

  approach: string | null;
  recommendation: string | null;
  status: string;
  notes: string | null;

  createdAt: string;

  issue: IssueDB & {
    repo: RepositoryDB;
  };
}
