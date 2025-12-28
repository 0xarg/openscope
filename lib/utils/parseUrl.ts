export function parseUrl(url: string) {
  try {
    console.log("URLlll", url);
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error("Invlaid Url");
    }
    const owner = pathParts[0];
    const repo = pathParts[1];
    return {
      owner: owner,
      repo: repo,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}
