// import prisma from "@/db/prisma";
// import { authOptions } from "@/lib/auth";
// import { openai } from "@/lib/openai";
// import { fetchGithubRepo } from "@/lib/utils/fetchGithubRepo";
// import { mapGitHubRepo } from "@/lib/utils/mapGithubRepo";
// import { safeParseAI } from "@/lib/utils/parseAIRes";
// import { GitHubIssue } from "@/types/github/issues";
// import { GitHubRepository } from "@/types/github/repository";
// import axios from "axios";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const userId = parseInt(session?.user.id);
//   const data = await req.json();
//   const issue: GitHubIssue = data.issue;
//   const name: string = data.name;
//   const owner: string = data.owner;

//   try {
//     const res = await axios.get(issue.repositoryAPIUrl, {
//       timeout: 10000,
//     });
//     const repo: GitHubRepository = mapGitHubRepo(res.data);
//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });
//     const prompt = `
// You are an expert open-source mentor helping a developer decide whether and how to solve a GitHub issue.

// Read the USER_BIO and USER_SKILLS carefully and tailor your advice strictly to the user's background.

// Rules:
// - If the user lacks required skills, clearly say so.
// - If the issue is too advanced, recommend learning steps first.
// - Be practical and honest.
// - Do NOT hallucinate repo-specific details.
// - Return JSON only.

// Produce JSON with exactly these keys:
//         summary  -> explain it in a very detailed way
//         difficulty -> easy | medium | hard
//         labels -> array of up to 4 simple labels (one or two words)
//         casue -> what could be the cause of this according to you,
//         approach  -> Explain the best approach to solve the issue based on user bio in detail and a easy way.
//         recommendations -> recommend what a user should do based on the issue and user bio in a detailed manner as sentence format,
//         skills -> Skills needed to solve this issue -> array of skill, like [skill1, skill2] etc.

//         USER_BIO:
//         ${user?.bio}

//         USER_SKILLS:
//         ${user?.skills}

//         ISSUE_REPO:
//         ${repo.name}

//         ISSUE_REPO_OWNER:
//         ${repo.owner.login}

//         ISSUE_TITLE:
//         ${issue?.title}

//         ISSUE_BODY:
//         ${issue?.body}

//         ISSUE_CreatedAt:
//         ${issue?.createdAt}

//         ISSUE_Labels:
//         ${issue?.labels}

//         TOTAL_ISSUE_COMMENTS:
//         ${issue.commentsCount}
//         `;

//     let issueDb = await prisma.issue.findUnique({
//       where: {
//         githubId: issue.githubId.toString(),
//       },
//     });
//     const issueExists = !!issueDb;

//     const repoDb = await prisma.repository.upsert({
//       where: {
//         name_owner: { name: repo.name, owner: repo.owner.login },
//       },
//       update: {},
//       create: {
//         name: repo.name,
//         owner: repo.owner.login,
//         githubUrl: repo.htmlUrl,
//         description: repo.description,
//         language: repo.primaryLanguage,
//         stars: repo.stars,
//         forks: repo.forks,
//         issueCount: repo.openIssues,
//       },
//     });
//     if (!issueExists) {
//       issueDb = await prisma.issue.create({
//         data: {
//           githubId: issue.githubId.toString(),
//           githubNumber: issue.number,
//           githubUrl: issue.htmlUrl,
//           githubApiUrl: issue.apiUrl,
//           repositoryAPIUrl: issue.repositoryAPIUrl,
//           title: issue.title,
//           body: issue.body,
//           state: issue.state,
//           isPullRequest: issue.isPullRequest,
//           commentsCount: issue.commentsCount,
//           labels: issue.labels.map((l) => l.name),
//           githubCreatedAt: new Date(issue.createdAt),
//           githubUpdatedAt: new Date(issue.updatedAt),
//           repoId: repoDb.id,
//         },
//       });
//     }
//     const userIssue = !!(await prisma.userIssue.findUnique({
//       where: {
//         userId_issueId: {
//           userId,
//           issueId: issueDb?.id!,
//         },
//       },
//     }));
//     if (userIssue) {
//       return NextResponse.json({
//         message: "Issue already tracked",
//       });
//     }
//     const completion = await openai.chat.completions.create({
//       model: "openai/gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });
//     const response = completion.choices[0].message;
//     const finaldata = safeParseAI(response.content ?? "");

//     await prisma.userIssue.create({
//       data: {
//         userId,
//         issueId: issueDb?.id!,
//         approach: finaldata.approach,
//         recommendation: finaldata.recommendations,
//         difficulty: finaldata.difficulty,
//         skills: finaldata.skills,
//         summary: finaldata.summary,
//         cause: finaldata.cause,
//         status: "in-progress",
//       },
//     });
//     return NextResponse.json(
//       {
//         message: "Issue tracked",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         message: "Something went wrong",
//       },
//       { status: 500 }
//     );
//   }
// }
