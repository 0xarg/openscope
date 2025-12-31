import { RepositoryDB } from "../github/repository";

export interface UserRepositoryWithRepo {
  userId: number;
  repoId: number;

  repo: RepositoryDB;
}
