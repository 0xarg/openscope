import { GitHubRepository } from "@/types/github/repository";

export function mapGitHubRepo(apiRepo: any): GitHubRepository {
  let popularity;
  if (apiRepo.stargazers_count > 150000) {
    popularity = "Legendary";
  } else if (apiRepo.stargazers_count > 125000) {
    popularity = "Famous";
  } else if (apiRepo.stargazers_count > 90000) {
    popularity = "Popular";
  } else if (apiRepo.stargazers_count > 45000) {
    popularity = "Rising";
  } else {
    popularity = "New";
  }
  return {
    githubId: apiRepo.id,
    name: apiRepo.name,
    fullName: apiRepo.full_name,
    htmlUrl: apiRepo.html_url,
    description: apiRepo.description,

    owner: {
      login: apiRepo.owner.login,
      id: apiRepo.owner.id,
      avatarUrl: apiRepo.owner.avatar_url,
      htmlUrl: apiRepo.owner.html_url,
      type: apiRepo.owner.type,
    },

    stars: apiRepo.stargazers_count,
    forks: apiRepo.forks_count,
    watchers: apiRepo.watchers_count,
    openIssues: apiRepo.open_issues_count,

    createdAt: apiRepo.created_at,
    updatedAt: apiRepo.updated_at,
    pushedAt: apiRepo.pushed_at,

    primaryLanguage: apiRepo.language || "unknown",
    topics: apiRepo.topics ?? [],
    popularity: popularity,

    allowForking: apiRepo.allow_forking,
    archived: apiRepo.archived,
  };
}
