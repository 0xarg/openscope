import { RepositoryDB } from "../github/repository";
import { UserIssues } from "../github/userIssues";

export interface User {
  id: number;

  // Basic profile
  name: string;
  email?: string | null;
  emailVerified?: Date | null;
  bio?: string | null;
  image?: string | null;

  // Skills
  skills: string[];

  // Relations
  repos: RepositoryDB[];
  issues: UserIssues[];
}
