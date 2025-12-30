import { RepositoryDB } from "../github/repository";
import { UserIssues } from "../github/userIssues";

export interface UserDb {
  id: number;

  // Basic profile
  name: string;
  email?: string | null;
  emailVerified?: Date | null;
  bio?: string | null;
  image?: string | null;
  githubUsername: string;
  experienceLevel?: string | "Not selcted";
  githubJoined?: Date;
  location?: string | "unknown";
  // Skills
  skills: string[];

  // Relations
  repos: RepositoryDB[];
  issues: UserIssues[];
}
