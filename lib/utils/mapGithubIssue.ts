import { GitHubIssue, GitHubIssueAPI } from "@/types/github/issues";

export function mapGitHubIssue(issue: GitHubIssueAPI): GitHubIssue {
  return {
    githubId: issue.id,
    number: issue.number,
    title: issue.title,
    body: issue.body,

    state: issue.state,
    isPullRequest: Boolean(issue.pull_request),

    commentsCount: issue.comments,

    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,

    htmlUrl: issue.html_url,
    apiUrl: issue.url,
    repositoryAPIUrl: issue.repository_url,

    author: {
      login: issue.user.login,
      avatarUrl: issue.user.avatar_url,
      htmlUrl: issue.user.html_url,
    },

    labels: issue.labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      description: label.description,
    })),
  };
}
