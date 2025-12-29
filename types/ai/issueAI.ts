import { GitHubIssue } from "../github/issues";

export interface IssueAIStats {
  summary?: string;
  difficulty?: string;
  skills?: string[];
  cause?: string;
  approach?: string[];
  estimatedTime?: string;
  filestoExplore?: string[];
  matchScore?: string;

  generatedAt?: string;
  model?: string;
}

export type IssueWithAI = GitHubIssue & {
  ai?: IssueAIStats;
  tracked?: boolean;
};
