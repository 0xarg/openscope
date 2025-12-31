export interface RepositoryDB {
  id: number;
  githubId: string | null;
  githubUrl: string;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  description: string | "null";
  language: string | "unknown";
  stars: number | 0;
  forks: number | 0;
  issueCount: number | 0;
  prCount: number | 0;
  license: string;
  defaultBranch: string;
}
