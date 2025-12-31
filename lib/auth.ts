import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db/prisma";
import Github from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Github({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          githubUsername: profile.login,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.id) return;

      const userId = Number(user.id);

      await prisma.$transaction([
        prisma.userPlan.create({
          data: {
            userId,
            plan: "FREE",
            isActive: true,
          },
        }),
        prisma.userUsage.create({
          data: {
            userId,
            trackedIssuesCount: 0,
            trackedReposCount: 0,
            aiRequestsToday: 0,
            aiRequestsMonth: 0,
            aiTokensToday: 0,
            aiTokensMonth: 0,
          },
        }),
      ]);
    },
  },

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = Number(user.id);
      }
      if (profile && "login" in profile) {
        token.githubUsername = String(profile.login);
      }
      const userExists = await prisma.user.findUnique({
        where: {
          id: token.id,
        },
        select: {
          id: true,
        },
      });
      if (!userExists) {
        delete token.id;
        delete token.githubUsername;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token?.id) {
        return session;
      }

      if (session.user && token.id) {
        session.user.id = token.id; // expose id in session
        session.user.githubUsername = token.githubUsername as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
