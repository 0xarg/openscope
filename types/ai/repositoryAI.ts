import { GitHubIssue } from "../github/issues";
import { GitHubRepository } from "../github/repository";

export interface RepositoryAIStats {
  summary?: string;
  match?: string;
  contributorFriendliness?: string;
  codeQuality?: string;
  activityLevel?: string;
  communityScore?: string;
  bestFor?: string[];
  hotAreas?: string[];
  techStack?: string[];
  generatedAt?: string;
  model?: string;
}

export type RepositoryWithAI = GitHubRepository & {
  ai?: RepositoryAIStats;
  tracked?: boolean;
};
