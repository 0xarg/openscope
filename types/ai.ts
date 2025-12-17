export interface AIStatsIssue {
  id?: number;
  issueNumber?: number;
  summary?: string;
  difficulty?: string;
  labels?: string[];
  recommended?: string;
  cause?: string;
  skills?: string[];
}
