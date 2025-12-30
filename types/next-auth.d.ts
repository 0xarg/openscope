import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number; // <— we add this
      githubUsername?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number; // <— Prisma user has id, so tell TS
    githubUsername?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number; // <— we attach it to the JWT token
    githubUsername?: string;
  }
}
