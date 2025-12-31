"use client";

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/app-layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Bookmark,
  Sparkles,
  ArrowRight,
  Star,
  GitFork,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { GitHubRepository } from "@/types/github/repository";
import { formatDigits } from "@/lib/utils/formatDigits";
import { RepositoryWithAI } from "@/types/ai/repositoryAI";
import axiosInstance from "@/lib/axios";
import axios from "axios";

const languages = ["All", "TypeScript", "JavaScript", "Python", "Rust", "Go"];
const popularities = ["All", "Legendary", "Famous", "Popular", "Rising"];

const getLanguageClass = (lang: string) => {
  const classes: Record<string, string> = {
    TypeScript: "lang-typescript",
    JavaScript: "lang-javascript",
    Python: "lang-python",
    Rust: "lang-rust",
    Go: "lang-go",
  };
  return classes[lang] || "bg-muted text-muted-foreground";
};

const getPopularityClass = (pop: string) => {
  const classes: Record<string, string> = {
    Popular: "badge-popular",
    Famous: "badge-famous",
    Rising: "badge-rising",
    Legendary: "badge-legendary",
  };
  return classes[pop] || "";
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [popularityFilter, setPopularityFilter] = useState("All");
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [expandedAI, setExpandedAI] = useState<string>("");
  const [allRepos, setAllRepos] = useState<RepositoryWithAI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(true);
  const { toast } = useToast();

  const fetchTrendingRepos = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/githubTrending");
      setAllRepos(res.data.repos);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed while fetching Trending repos",
      });
    }
  }, []);
  const fetchAIData = useCallback(async (repo: RepositoryWithAI) => {
    toast({
      title: "Getting AI insights",
      description: "Please wait for few seconds to get insights",
    });
    setExpandedAI(repo.githubId.toString());
    setIsAILoading(true);

    try {
      const res = await axiosInstance.post("/api/repository/ai/basic", {
        repo,
      });
      const data = res.data;
      setAllRepos((prev) =>
        prev.map((i) =>
          i.githubId.toString() === repo.githubId.toString()
            ? {
                ...i,
                ai: {
                  ...i.ai,
                  ...data.ai,
                },
              }
            : i
        )
      );
    } catch (error) {
      toast({
        title: "Please try again after sometime",
        description: "There was a error fetching AI insights",
      });
    } finally {
      setIsAILoading(false);
    }
  }, []);

  const fetchTrackedReposIds = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/repository/tracked/ids");
      setTrackedIds(res.data.trackedIds);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSync = () => {
    toast({
      title: "Syncing issues...",
      description: "Fetching latest data from GitHub",
    });
    loadPageData();
  };

  const handleTrackRepo = useCallback(
    async (githubUrl: string, githubId: string) => {
      let alreadyTracked = false;
      setTrackedIds((prev) => {
        if (prev.includes(githubId)) {
          alreadyTracked = true;
          return prev;
        }
        return [...prev, githubId];
      });
      if (alreadyTracked) {
        toast({
          title: "Already tracking",
          description: "Repository already tracked",
        });
        return;
      }
      try {
        toast({
          title: "Adding repository to tracking list",
          description: "Adding may to take few seconds",
        });
        const res = await axiosInstance.post("/api/repository", {
          githubUrl,
        });

        toast({
          title: "Respository added",
          description: "Sucessfully added repository to traking list",
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          switch (status) {
            case 500:
              setTrackedIds((prev) => prev.filter((id) => id !== githubId));
              toast({
                title: "Something went wrong",
                description: "Repository not added, please try again later.",
              });
              break;
            case 501:
              setTrackedIds((prev) => prev.filter((id) => id !== githubId));
              toast({
                title: "Invalid Github Repository url",
                description: "Repository URL not valid, please try again.",
              });
              break;
            case 502:
              toast({
                title: "Repository already added",
                description: "Repository exists in database.",
              });
              break;
            default:
              break;
          }
        }
        toast({
          title: "Error tracking repository",
          description: "Unable to track repository now",
        });
      }
    },
    [toast]
  );

  const userGithubSync = useCallback(async () => {
    try {
      await axiosInstance.get("/api/user/github/sync");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    setExpandedAI("");
    try {
      await Promise.all([
        fetchTrendingRepos(),
        fetchTrackedReposIds(),
        userGithubSync(),
      ]);
    } finally {
      toast({ title: "Synced", description: "Everything is up to date" });
      setIsLoading(false);
    }
  }, [fetchTrackedReposIds, fetchTrendingRepos, userGithubSync, toast]);

  const getMatchClass = (difficulty: string) => {
    console.log(difficulty);
    const classes: Record<string, string> = {
      high: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      low: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    };
    return classes[difficulty] || "";
  };

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const filteredRepos = allRepos.filter((repo) => {
    const matchesSearch =
      repo.owner.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      languageFilter === "All" || repo.primaryLanguage === languageFilter;
    const matchesPopularity =
      popularityFilter === "All" || repo.popularity === popularityFilter;
    return matchesSearch && matchesLanguage && matchesPopularity;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="w-full sm:w-auto text-left">
              <h1 className="text-xl font-bold sm:text-2xl">
                Trending Repositories
              </h1>
              <p className="text-muted-foreground hidden text-sm sm:block">
                Discover and track open source repositories
              </p>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-full bg-transparent"
                onClick={handleSync}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Sync</span>
              </Button>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="h-9 w-[120px] sm:w-[140px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={popularityFilter}
                onValueChange={setPopularityFilter}
              >
                <SelectTrigger className="h-9 w-[120px] sm:w-[140px]">
                  <SelectValue placeholder="Popularity" />
                </SelectTrigger>
                <SelectContent>
                  {popularities.map((pop) => (
                    <SelectItem key={pop} value={pop}>
                      {pop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border h-10 pl-10"
            />
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="border-border bg-card relative hidden overflow-hidden rounded-2xl border shadow-sm md:block">
          {/* Header */}
          <div className="border-border bg-muted/40 text-muted-foreground grid grid-cols-12 gap-4 border-b px-6 py-4 text-xs font-medium uppercase tracking-wider">
            <div className="col-span-4 flex items-center gap-2">
              <span className="w-6"></span>
              Repository
            </div>
            <div className="col-span-1">Language</div>
            <div className="col-span-1 text-center ">Issues/Prs</div>
            <div className="col-span-2 text-center ">Stars</div>
            <div className="col-span-2 text-center ">Forks</div>
            <div className="col-span-1 text-center ">Status</div>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="divide-border/50 divide-y">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center gap-4 px-6 py-5"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="bg-muted h-4 w-4 animate-pulse rounded" />
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  </div>
                  <div className="col-span-2">
                    <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                    <div className="bg-muted h-5 w-12 animate-pulse rounded-full" />
                  </div>
                  <div className="col-span-1">
                    <div className="bg-muted ml-auto h-4 w-12 animate-pulse rounded" />
                  </div>
                  <div className="col-span-1">
                    <div className="bg-muted ml-auto h-4 w-10 animate-pulse rounded" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRepos.length > 0 ? (
            <div className="divide-border/50 divide-y">
              {filteredRepos.map((repo) => {
                const isExpanded = expandedAI.includes(
                  repo.githubId.toString()
                );
                let matchLevel = "";
                if (repo.ai?.match) {
                  const score = parseInt(repo.ai.match);
                  if (score >= 80) {
                    matchLevel = "high";
                  } else if (score >= 40) {
                    matchLevel = "medium";
                  } else {
                    matchLevel = "low";
                  }
                  console.log(matchLevel);
                }
                const isTracked = trackedIds.includes(repo.githubId.toString());
                return (
                  <div key={repo.githubId} className="group">
                    <div className="hover:bg-accent/5 grid grid-cols-12 items-center gap-4 px-6 py-4 transition-all duration-200">
                      {/* Repo */}
                      <div className="col-span-4 flex min-w-0 items-center gap-3">
                        <button
                          onClick={() =>
                            handleTrackRepo(
                              repo.htmlUrl,
                              repo.githubId.toString()
                            )
                          }
                          className="hover:bg-accent/10 shrink-0 rounded-md p-1 transition-all hover:scale-110"
                        >
                          <Bookmark
                            className={`h-4 w-4 transition-colors ${
                              trackedIds.includes(repo.githubId.toString())
                                ? "text-accent fill-accent"
                                : "text-muted-foreground hover:text-accent"
                            }`}
                          />
                        </button>
                        <Link
                          href={`/issues/${repo.owner.login}/${repo.name}`}
                          className="hover:text-accent truncate text-sm font-medium transition-colors"
                        >
                          <span className="text-muted-foreground font-normal">
                            {repo.owner.login}/
                          </span>
                          {repo.name}
                        </Link>
                      </div>

                      {/* Language */}
                      <div className="col-span-1 ">
                        <Badge
                          variant="outline"
                          className={`rounded-full text-xs font-medium ${getLanguageClass(
                            repo.primaryLanguage
                          )}`}
                        >
                          {repo.primaryLanguage}
                        </Badge>
                      </div>

                      {/* Open Issues */}
                      <div className="col-span-1  text-center">
                        <span className="text-muted-foreground  justify-end gap-1.5 font-mono text-sm">
                          {repo.openIssues}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="col-span-2  flex justify-center ">
                        <span className="text-muted-foreground flex items-center justify-end gap-1.5 font-mono text-sm">
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                          {formatDigits(repo.stars)}
                        </span>
                      </div>

                      {/* Forks */}
                      <div className="col-span-2 flex justify-center">
                        <span className="text-muted-foreground flex items-center justify-end gap-1.5 font-mono text-sm">
                          <GitFork className="h-3.5 w-3.5" />
                          {formatDigits(repo.forks)}
                        </span>
                      </div>

                      {/* Popularity */}
                      <div className="col-span-1 flex justify-center">
                        <Badge
                          variant="outline"
                          className={`rounded-full text-[10px] font-medium ${getPopularityClass(
                            repo.popularity
                          )}`}
                        >
                          {repo.popularity}
                        </Badge>
                      </div>

                      {/* AI Toggle */}
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-full transition-all ${
                            isExpanded
                              ? "bg-accent/10 text-accent"
                              : "hover:bg-accent/10 hover:text-accent"
                          }`}
                          onClick={() => fetchAIData(repo)}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* AI Expanded */}
                    {isExpanded && (
                      <div className="animate-fade-in border-accent/20 from-accent/5 to-accent/10 mx-6 my-4 rounded-xl border bg-gradient-to-r p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Sparkles className="text-accent h-4 w-4" />
                          <span className="text-accent text-sm font-medium">
                            AI Analysis
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-8 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Match:
                            </span>
                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              <Badge
                                variant="outline"
                                className={` rounded-full text-xs ${getMatchClass(
                                  matchLevel
                                )}`}
                              >
                                {repo.ai?.match}%
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Activity Level:
                            </span>
                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              <span className="font-medium">
                                {repo.ai?.activityLevel}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/repository/${repo.owner.login}/${repo.name}`}
                            className="text-accent group/link ml-auto flex items-center gap-1.5 font-medium hover:underline"
                          >
                            View details
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground p-16 text-center">
              <Search className="text-muted-foreground/30 mx-auto mb-4 h-12 w-12" />
              <p className="mb-3 text-lg">No issues found</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent"
                onClick={() => {
                  setSearchQuery("");
                  setLanguageFilter("All");
                  setPopularityFilter("All");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Cards - Mobile */}
        <div className="space-y-4 md:hidden">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card border-border animate-pulse rounded-2xl border p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="bg-muted h-5 w-32 rounded" />
                    <div className="bg-muted h-5 w-5 rounded" />
                  </div>
                  <div className="bg-muted mb-2 h-4 w-full rounded" />
                  <div className="bg-muted mb-4 h-4 w-2/3 rounded" />
                  <div className="flex gap-2">
                    <div className="bg-muted h-6 w-20 rounded-full" />
                    <div className="bg-muted h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))
            : filteredRepos.length > 0
            ? filteredRepos.map((repo) => {
                const isExpanded = expandedAI.includes(repo.githubId);
                const isTracked = trackedIds.includes(repo.githubId);
                let matchLevel = "unknown";
                if (repo.ai?.match) {
                  const score = parseInt(repo.ai.match);
                  if (score >= 80) {
                    matchLevel = "high";
                  } else if (score >= 40) {
                    matchLevel = "medium";
                  } else {
                    matchLevel = "low";
                  }
                }

                return (
                  <div
                    key={repo.githubId}
                    className="bg-card border-border hover:border-accent/30 rounded-2xl border p-5 shadow-sm transition-all"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <Link
                        href={`/issue/${repo.githubId}`}
                        className="hover:text-accent font-medium transition-colors"
                      >
                        <span className="text-muted-foreground font-normal">
                          {repo.owner.login}/
                        </span>
                        {repo.name}
                      </Link>
                      <button
                        onClick={() =>
                          handleTrackRepo(
                            repo.htmlUrl,
                            repo.githubId.toString()
                          )
                        }
                        className="hover:bg-accent/10 rounded-lg p-1.5 transition-colors"
                      >
                        <Bookmark
                          className={`h-4 w-4 transition-colors ${
                            trackedIds.includes(repo.githubId.toString())
                              ? "text-accent fill-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                      {repo.name}
                    </p>

                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-xs ${getLanguageClass(
                          repo.primaryLanguage
                        )}`}
                      >
                        {repo.primaryLanguage}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`rounded-full text-xs ${getPopularityClass(
                          repo.popularity
                        )}`}
                      >
                        {repo.popularity}
                      </Badge>
                    </div>

                    <div className="border-border/50 flex items-center justify-between border-t pt-3">
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GitFork className="h-3.5 w-3.5" />
                          {repo.forks}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 gap-1.5 rounded-full text-xs ${
                          isExpanded ? "bg-accent/10 text-accent" : ""
                        }`}
                        onClick={() => fetchAIData(repo)}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="animate-fade-in border-accent/20 from-accent/5 to-accent/10 mt-4 rounded-xl border bg-gradient-to-r p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Sparkles className="text-accent h-3.5 w-3.5" />
                          <span className="text-accent text-xs font-medium">
                            AI Analysis
                          </span>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Match:
                            </span>
                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              <Badge
                                variant="outline"
                                className={` rounded-full text-[10px] ${getMatchClass(
                                  matchLevel
                                )}`}
                              >
                                {repo.ai?.match}%
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Activity Level
                            </span>
                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              <span className="font-medium">
                                {repo.ai?.activityLevel}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/issue/${repo.githubId}`}
                            className="text-accent flex items-center justify-center gap-1.5 pt-2 font-medium"
                          >
                            View details
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </AppLayout>
  );
}
