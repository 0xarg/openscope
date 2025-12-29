export interface RepositoryDB {
  id: number;
  githubId: string;
  githubUrl: string;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  description: string | "null";
  language: string | "unknown";
  stars: number;
  forks: number;
  issueCount: number;
}
