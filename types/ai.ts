export interface AIStatsIssue {
  id?: number;
  githubId?: number;
  summary?: string;
  difficulty?: string;
  labels?: string[];
  recommended?: string;
  cause?: string;
  skills: string[];
}
