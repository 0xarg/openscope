export interface UserIssueDb {
  id: number;

  userId: number;
  issueId: number;

  githubId: string;

  summary: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  skills: string[];
  cause: string | null;
  approach: string[];
  estimatedTime: string | null;
  matchScore: number;
  filestoExplore: string[];

  notes: string | null;
  status: "tracked" | "in_progress" | "completed";

  createdAt: string; // ISO string
}
