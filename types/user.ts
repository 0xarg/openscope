import { Account, Session } from "@prisma/client";
import { Repository } from "./repo";

export interface User {
  id: number;
  name: string;
  email?: string | null;
  bio?: string | "No Bio"
  emailVerified?: Date | string | null;
  image?: string | null;
  skills?: string[]
  // keep relations optional on the client DTO
  repos?: Repository[];
  accounts?: Account[];
  sessions?: Session[];
}
