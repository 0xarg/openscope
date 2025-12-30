export function parseGithubRepoApiUrl(url: string): {
  owner: string;
  name: string;
} | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);

    // Expected: /repos/{owner}/{repo}
    if (parts.length >= 3 && parts[0] === "repos") {
      return {
        owner: parts[1],
        name: parts[2],
      };
    }

    return null;
  } catch {
    return null;
  }
}
