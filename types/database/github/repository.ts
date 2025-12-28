export interface RepositoryDB {
  id: number;
  githubUrl: string;
  name: string;
  owner: string;
  description: string | "null";
  language: string | "unknown";
  stars: number;
  forks: number;
  issueCount: number;
}
