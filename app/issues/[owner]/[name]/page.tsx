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
  ArrowLeft,
  FolderGit2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { GitHubRepository } from "@/types/github/repository";
import { formatDigits } from "@/lib/utils/formatDigits";
import { GitHubIssue } from "@/types/github/issues";
import { fetchGithubRepo } from "@/lib/utils/fetchGithubRepo";

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

export default function Issues({
  params,
}: {
  params: { name: string; owner: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [popularityFilter, setPopularityFilter] = useState("All");
  const [trackedIds, setTrackedIds] = useState<string[]>(["1", "3"]);
  const [expandedAI, setExpandedAI] = useState<string[]>([]);
  const [repoInfo, setRepoInfo] = useState<GitHubRepository>();
  const [allRepos, setAllRepos] = useState<GitHubRepository[]>([]);
  const [allIssues, setAllIssues] = useState<GitHubIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepositoryIssues = useCallback(async () => {
    try {
      const paramsData = await params;
      const owner = paramsData.owner;
      const name = paramsData.name;

      const res = await axios.post(`/api/issues/`, {
        name: name,
        owner: owner,
      });
      setAllIssues(res.data.issues);
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching issues, ", error);
      toast({ title: "Error fetching issues;" });
    }
  }, []);

  const fetchTrendingRepos = useCallback(async () => {
    try {
      const res = await axios.get("/api/githubTrending");
      setAllRepos(res.data.repos);
      console.log(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed while fetching Trending repos",
      });
    }
  }, []);

  const fetchGithubRepoInfo = useCallback(async () => {
    const paramsData = await params;
    const owner = paramsData.owner;
    const name = paramsData.name;
    const repo = await fetchGithubRepo(owner, name);
    if (repo) {
      setRepoInfo(repo);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchGithubRepoInfo();
    fetchRepositoryIssues();
  }, []);

  // const handleSync = () => {
  //   setIsLoading(true);
  //   toast({
  //     title: "Syncing issues...",
  //     description: "Fetching latest data from GitHub",
  //   });
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     toast({ title: "Synced", description: "Issues are up to date" });
  //   }, 1500);
  // };

  const handleAddRepo = useCallback(async (url: string, id: string) => {
    const tracked = trackedIds.includes(id);

    try {
      axios
        .post("/api/repository", {
          githubUrl: url,
        })
        .then((res) => {
          if (res.status === 201) {
            toast({ title: tracked ? "Issue untracked" : "Issue tracked" });
            setTrackedIds((prev) =>
              tracked ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }
        });
    } catch (error) {}
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchTrendingRepos();
    // const timer = setTimeout(() => setIsLoading(false), 500);
    // return () => clearTimeout(timer);
  }, [fetchTrendingRepos]);

  // const toggleAI = (id: string) => {
  //   setExpandedAI((prev) =>
  //     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  //   );
  // };
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

  function getIssueDaysAgo(dateString: string): number {
    const issueDate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - issueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatRelativeDate(dateString: string): string {
    const daysAgo = getIssueDaysAgo(dateString);
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;
    return `${Math.floor(daysAgo / 365)} years ago`;
  }

  // const { repoId } = useParams<{ repoId: string }>();
  // const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [labelFilter, setLabelFilter] = useState("All");
  // const [trackedIds, setTrackedIds] = useState<string[]>(["101", "301"]);
  // const [expandedAI, setExpandedAI] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const { toast } = useToast();

  const issueAges = [
    "All",
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Older",
  ];

  // const normalize = (label: string) => label.replace(/[^a-z0-9]+/gi, "-");

  // Extract unique labels from issues
  const availableLabels = [
    "All",
    ...Array.from(
      new Set(allIssues.flatMap((issue) => issue.labels.map((l) => l.name)))
    ).sort(),
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const getDifficultyClass = (difficulty: string) => {
    const classes: Record<string, string> = {
      easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      hard: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    };
    return classes[difficulty] || "";
  };

  const handleSync = () => {
    setIsLoading(true);
    toast({
      title: "Syncing issues...",
      description: "Fetching latest data from GitHub",
    });
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Synced", description: "Issues are up to date" });
    }, 1500);
  };

  const handleTrack = (id: string) => {
    const tracked = trackedIds.includes(id);
    setTrackedIds((prev) =>
      tracked ? prev.filter((i) => i !== id) : [...prev, id]
    );
    toast({ title: tracked ? "Issue untracked" : "Issue tracked" });
  };

  const toggleAI = (id: string) => {
    setExpandedAI((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.labels.some((l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const daysAgo = getIssueDaysAgo(issue.createdAt);
    let matchesAge = true;
    if (ageFilter === "Last 7 days") matchesAge = daysAgo <= 7;
    else if (ageFilter === "Last 30 days") matchesAge = daysAgo <= 30;
    else if (ageFilter === "Last 90 days") matchesAge = daysAgo <= 90;
    else if (ageFilter === "Older") matchesAge = daysAgo > 90;

    const matchesLabel =
      labelFilter === "All" || issue.labels.some((l) => l.name === labelFilter);
    return matchesSearch && matchesAge && matchesLabel;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Back button and Repo Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2 -ml-2"
            asChild
          >
            <Link href="/repositories">
              <ArrowLeft className="h-4 w-4" />
              Back to Repositories
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                <FolderGit2 className="h-7 w-7 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {repoInfo?.owner.login}/{repoInfo?.name}
                  </h1>
                  <a
                    href={`https://github.com/${repoInfo?.owner.login}/${repoInfo?.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  {repoInfo?.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500" />
                    {formatDigits(repoInfo?.stars || 2)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GitFork className="h-4 w-4" />
                    {formatDigits(repoInfo?.forks || 3)}
                  </span>
                  <Badge variant="outline" className="text-xs rounded-full">
                    {repoInfo?.primaryLanguage}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Open Issues</h2>
              <p className="text-sm text-muted-foreground">
                {allIssues.length} recent issues found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-full"
                onClick={handleSync}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Sync</span>
              </Button>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-[130px] sm:w-[150px] h-9">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  {issueAges.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age === "All" ? "All Ages" : age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={labelFilter} onValueChange={setLabelFilter}>
                <SelectTrigger className="w-[130px] sm:w-[150px] h-9">
                  <SelectValue placeholder="Label" />
                </SelectTrigger>
                <SelectContent>
                  {availableLabels.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label === "All" ? "All Labels" : label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border h-10"
            />
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden hidden md:block shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
            <div className="col-span-5 flex items-center gap-2">
              <span className="w-6"></span>
              Issue
            </div>
            <div className="col-span-2">Labels</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-1 text-center">Comments</div>
            <div className="col-span-2"></div>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="divide-y divide-border/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                    <div className="h-4 bg-muted rounded w-64 animate-pulse" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="col-span-2" />
                </div>
              ))}
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filteredIssues.map((issue) => {
                const isExpanded = expandedAI.includes(issue.id.toString());
                const isTracked = trackedIds.includes(issue.id.toString());

                return (
                  <div key={issue.id} className="group">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-accent/5">
                      {/* Issue Title */}
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleTrack(issue.id.toString())}
                          className="shrink-0 p-1 rounded-md transition-all hover:bg-accent/10 hover:scale-110"
                        >
                          <Bookmark
                            className={`h-4 w-4 transition-colors ${
                              isTracked
                                ? "fill-accent text-accent"
                                : "text-muted-foreground hover:text-accent"
                            }`}
                          />
                        </button>
                        <div className="min-w-0">
                          <Link
                            href={`/issue/${issue.id}`}
                            className="hover:text-accent transition-colors font-medium text-sm block truncate"
                          >
                            {issue.title}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            #{issue.number} opened by {issue.author.login}
                          </span>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="col-span-2 flex gap-2 flex-wrap">
                        {issue.labels.slice(0, 2).map((label) => (
                          <Badge
                            key={label.id}
                            variant="secondary"
                            className="text-[10px] px-2.5 py-1 rounded-full font-normal truncate max-w-[100px]"
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Created Date */}
                      <div className="col-span-2">
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeDate(issue.createdAt)}
                        </span>
                      </div>

                      {/* Comments */}
                      <div className="col-span-1 text-center">
                        <span className="text-sm text-muted-foreground">
                          {issue.commentsCount}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-full transition-all ${
                            isExpanded
                              ? "bg-accent/10 text-accent"
                              : "hover:bg-accent/10 hover:text-accent"
                          }`}
                          onClick={() => toggleAI(issue.id.toString())}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1 rounded-full"
                          asChild
                        >
                          <Link href={`/issue/${issue.id}`}>
                            View
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* AI Expanded */}
                    {isExpanded && (
                      <div className="mx-6 my-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-accent">
                            AI Analysis
                          </span>
                        </div>
                        <div className="flex items-center gap-8 flex-wrap text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Difficulty:
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs rounded-full capitalize ${getDifficultyClass(
                                "easy"
                              )}`}
                            >
                              {"Unknown"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Est. Time:
                            </span>
                            <span className="font-medium">{"Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Skills:
                            </span>
                            <div className="flex gap-1.5">
                              {/* {issue.skills?.slice(0, 3).map(skill => (
                                <span key={skill} className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">{skill}</span>
                              ))} */}
                              "tba"
                            </div>
                          </div>
                          <Link
                            href={`/issue/${issue.id}`}
                            className="ml-auto text-accent hover:underline flex items-center gap-1.5 font-medium group/link"
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
            <div className="p-16 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="mb-3 text-lg">No issues found</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setSearchQuery("");
                  setAgeFilter("All");
                  setLabelFilter("All");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card border border-border animate-pulse shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-muted rounded w-48" />
                  <div className="h-5 w-5 bg-muted rounded" />
                </div>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-20 bg-muted rounded-full" />
                </div>
              </div>
            ))
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => {
              const isExpanded = expandedAI.includes(issue.id.toString());
              const isTracked = trackedIds.includes(issue.id.toString());

              return (
                <div
                  key={issue.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/issue/${issue.id}`}
                        className="font-medium hover:text-accent transition-colors block truncate"
                      >
                        {issue.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        #{issue.number} • {issue.commentsCount} comments
                      </span>
                    </div>
                    <button
                      onClick={() => handleTrack(issue.id.toString())}
                      className="shrink-0 p-1.5 rounded-md hover:bg-accent/10"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          isTracked
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Labels */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    {issue.labels.slice(0, 3).map((label) => (
                      <Badge
                        key={label.id}
                        variant="secondary"
                        className="text-[10px] rounded-full"
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Date & AI Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(issue.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 gap-1.5 rounded-full ${
                        isExpanded ? "bg-accent/10 text-accent" : ""
                      }`}
                      onClick={() => toggleAI(issue.id.toString())}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      AI
                    </Button>
                  </div>

                  {/* AI Expanded Mobile */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">
                          AI Analysis
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Est. Time:
                          </span>
                          <span className="font-medium">"Est Time TBA"</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1.5">
                            Skills:
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {/* {issue.skills?.map(skill => (
                              <span key={skill} className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">{skill}</span>
                            ))} */}
                            TBA
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3 gap-1.5 text-accent"
                        asChild
                      >
                        <Link href={`/issue/${issue.id}`}>
                          View full details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-muted-foreground rounded-2xl bg-card border border-border">
              <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="mb-3">No issues found</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setSearchQuery("");
                  setAgeFilter("All");
                  setLabelFilter("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
  //   <AppLayout>
  //     <div className="p-4 sm:p-6">
  //       {/* Header */}
  //       <div className="mb-6 flex flex-col gap-4">
  //         <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
  //           <div className="w-full sm:w-auto text-left">
  //             <h1 className="text-xl font-bold sm:text-2xl">Open Issues</h1>
  //             <p className="text-muted-foreground hidden text-sm sm:block">
  //               Discover and track issues
  //             </p>
  //           </div>
  //           <div className="flex w-full items-center gap-2 sm:w-auto">
  //             <Button
  //               variant="outline"
  //               size="sm"
  //               className="h-9 gap-2 rounded-full bg-transparent"
  //               onClick={handleSync}
  //               disabled={isLoading}
  //             >
  //               <RefreshCw
  //                 className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
  //               />
  //               <span className="hidden sm:inline">Sync</span>
  //             </Button>
  //             <Select value={languageFilter} onValueChange={setLanguageFilter}>
  //               <SelectTrigger className="h-9 w-[120px] sm:w-[140px]">
  //                 <SelectValue placeholder="Language" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {languages.map((lang) => (
  //                   <SelectItem key={lang} value={lang}>
  //                     {lang}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //             <Select
  //               value={popularityFilter}
  //               onValueChange={setPopularityFilter}
  //             >
  //               <SelectTrigger className="h-9 w-[120px] sm:w-[140px]">
  //                 <SelectValue placeholder="Popularity" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {popularities.map((pop) => (
  //                   <SelectItem key={pop} value={pop}>
  //                     {pop}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //         </div>

  //         {/* Search */}
  //         <div className="relative">
  //           <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
  //           <Input
  //             placeholder="Search repository..."
  //             value={searchQuery}
  //             onChange={(e) => setSearchQuery(e.target.value)}
  //             className="bg-card border-border h-10 pl-10"
  //           />
  //         </div>
  //       </div>

  //       {/* Table - Desktop */}
  //       <div className="border-border bg-card relative hidden overflow-hidden rounded-2xl border shadow-sm md:block">
  //         {/* Header */}
  //         <div className="border-border bg-muted/40 text-muted-foreground grid grid-cols-12 gap-4 border-b px-6 py-4 text-xs font-medium uppercase tracking-wider">
  //           <div className="col-span-4 flex items-center gap-2">
  //             <span className="w-6"></span>
  //             Repository
  //           </div>
  //           <div className="col-span-1">Language</div>
  //           <div className="col-span-1 text-center ">Issues</div>
  //           <div className="col-span-2 text-center ">Stars</div>
  //           <div className="col-span-2 text-center ">Forks</div>
  //           <div className="col-span-1 text-center ">Status</div>
  //         </div>

  //         {/* Rows */}
  //         {isLoading ? (
  //           <div className="divide-border/50 divide-y">
  //             {[1, 2, 3, 4, 5, 6].map((i) => (
  //               <div
  //                 key={i}
  //                 className="grid grid-cols-12 items-center gap-4 px-6 py-5"
  //               >
  //                 <div className="col-span-4 flex items-center gap-3">
  //                   <div className="bg-muted h-4 w-4 animate-pulse rounded" />
  //                   <div className="bg-muted h-4 w-32 animate-pulse rounded" />
  //                 </div>
  //                 <div className="col-span-2">
  //                   <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
  //                 </div>
  //                 <div className="col-span-2 flex gap-2">
  //                   <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
  //                   <div className="bg-muted h-5 w-12 animate-pulse rounded-full" />
  //                 </div>
  //                 <div className="col-span-1">
  //                   <div className="bg-muted ml-auto h-4 w-12 animate-pulse rounded" />
  //                 </div>
  //                 <div className="col-span-1">
  //                   <div className="bg-muted ml-auto h-4 w-10 animate-pulse rounded" />
  //                 </div>
  //                 <div className="col-span-1 flex justify-center">
  //                   <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         ) : filteredRepos.length > 0 ? (
  //           <div className="divide-border/50 divide-y">
  //             {filteredRepos.map((repo) => {
  //               const isExpanded = expandedAI.includes(repo.id.toString());
  //               const isTracked = trackedIds.includes(repo.id.toString());

  //               return (
  //                 <div key={repo.id} className="group">
  //                   <div className="hover:bg-accent/5 grid grid-cols-12 items-center gap-4 px-6 py-4 transition-all duration-200">
  //                     {/* Repo */}
  //                     <div className="col-span-4 flex min-w-0 items-center gap-3">
  //                       <button
  //                         onClick={() =>
  //                           handleAddRepo(repo.htmlUrl, repo.id.toString())
  //                         }
  //                         className="hover:bg-accent/10 shrink-0 rounded-md p-1 transition-all hover:scale-110"
  //                       >
  //                         <Bookmark
  //                           className={`h-4 w-4 transition-colors ${
  //                             isTracked
  //                               ? "text-accent fill-accent"
  //                               : "text-muted-foreground hover:text-accent"
  //                           }`}
  //                         />
  //                       </button>
  //                       <Link
  //                         href={`/issue/${repo.id}`}
  //                         className="hover:text-accent truncate text-sm font-medium transition-colors"
  //                       >
  //                         <span className="text-muted-foreground font-normal">
  //                           {repo.owner.login}/
  //                         </span>
  //                         {repo.name}
  //                       </Link>
  //                     </div>

  //                     {/* Language */}
  //                     <div className="col-span-1 ">
  //                       <Badge
  //                         variant="outline"
  //                         className={`rounded-full text-xs font-medium ${getLanguageClass(
  //                           repo.primaryLanguage
  //                         )}`}
  //                       >
  //                         {repo.primaryLanguage}
  //                       </Badge>
  //                     </div>

  //                     {/* Open Issues */}
  //                     <div className="col-span-1  text-center">
  //                       <span className="text-muted-foreground  justify-end gap-1.5 font-mono text-sm">
  //                         {repo.openIssues}
  //                       </span>
  //                     </div>

  //                     {/* Stars */}
  //                     <div className="col-span-2  flex justify-center ">
  //                       <span className="text-muted-foreground flex items-center justify-end gap-1.5 font-mono text-sm">
  //                         <Star className="h-3.5 w-3.5 text-amber-500" />
  //                         {formatDigits(repo.stars)}
  //                       </span>
  //                     </div>

  //                     {/* Forks */}
  //                     <div className="col-span-2 flex justify-center">
  //                       <span className="text-muted-foreground flex items-center justify-end gap-1.5 font-mono text-sm">
  //                         <GitFork className="h-3.5 w-3.5" />
  //                         {formatDigits(repo.forks)}
  //                       </span>
  //                     </div>

  //                     {/* Popularity */}
  //                     <div className="col-span-1 flex justify-center">
  //                       <Badge
  //                         variant="outline"
  //                         className={`rounded-full text-[10px] font-medium ${getPopularityClass(
  //                           repo.popularity
  //                         )}`}
  //                       >
  //                         {repo.popularity}
  //                       </Badge>
  //                     </div>

  //                     {/* AI Toggle */}
  //                     <div className="col-span-1 flex justify-end">
  //                       <Button
  //                         variant="ghost"
  //                         size="sm"
  //                         className={`h-8 w-8 p-0 rounded-full transition-all ${
  //                           isExpanded
  //                             ? "bg-accent/10 text-accent"
  //                             : "hover:bg-accent/10 hover:text-accent"
  //                         }`}
  //                         onClick={() => toggleAI(repo.id.toString())}
  //                       >
  //                         <Sparkles className="h-3.5 w-3.5" />
  //                       </Button>
  //                     </div>
  //                   </div>

  //                   {/* AI Expanded */}
  //                   {isExpanded && (
  //                     <div className="animate-fade-in border-accent/20 from-accent/5 to-accent/10 mx-6 my-4 rounded-xl border bg-gradient-to-r p-4">
  //                       <div className="mb-3 flex items-center gap-2">
  //                         <Sparkles className="text-accent h-4 w-4" />
  //                         <span className="text-accent text-sm font-medium">
  //                           AI Analysis
  //                         </span>
  //                       </div>
  //                       <div className="flex flex-wrap items-center gap-8 text-sm">
  //                         <div className="flex items-center gap-2">
  //                           <span className="text-muted-foreground">
  //                             Difficulty:
  //                           </span>
  //                           <Badge
  //                             variant="outline"
  //                             className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 rounded-full text-xs"
  //                           >
  //                             Easy
  //                           </Badge>
  //                         </div>
  //                         <div className="flex items-center gap-2">
  //                           <span className="text-muted-foreground">
  //                             Est. Time:
  //                           </span>
  //                           <span className="font-medium">2-4 hours</span>
  //                         </div>
  //                         <div className="flex items-center gap-2">
  //                           <span className="text-muted-foreground">
  //                             Skills:
  //                           </span>
  //                           <div className="flex gap-1.5">
  //                             <span className="text-accent bg-accent/10 rounded-full px-2 py-0.5 font-mono text-xs">
  //                               TypeScript
  //                             </span>
  //                             <span className="text-accent bg-accent/10 rounded-full px-2 py-0.5 font-mono text-xs">
  //                               React
  //                             </span>
  //                           </div>
  //                         </div>
  //                         <Link
  //                           href={`/issue/${repo.id}`}
  //                           className="text-accent group/link ml-auto flex items-center gap-1.5 font-medium hover:underline"
  //                         >
  //                           View details
  //                           <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
  //                         </Link>
  //                       </div>
  //                     </div>
  //                   )}
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         ) : (
  //           <div className="text-muted-foreground p-16 text-center">
  //             <Search className="text-muted-foreground/30 mx-auto mb-4 h-12 w-12" />
  //             <p className="mb-3 text-lg">No issues found</p>
  //             <Button
  //               variant="outline"
  //               size="sm"
  //               className="rounded-full bg-transparent"
  //               onClick={() => {
  //                 setSearchQuery("");
  //                 setLanguageFilter("All");
  //                 setPopularityFilter("All");
  //               }}
  //             >
  //               Clear all filters
  //             </Button>
  //           </div>
  //         )}
  //       </div>

  //       {/* Cards - Mobile */}
  //       <div className="space-y-4 md:hidden">
  //         {isLoading
  //           ? [1, 2, 3].map((i) => (
  //               <div
  //                 key={i}
  //                 className="bg-card border-border animate-pulse rounded-2xl border p-5 shadow-sm"
  //               >
  //                 <div className="mb-4 flex items-center justify-between">
  //                   <div className="bg-muted h-5 w-32 rounded" />
  //                   <div className="bg-muted h-5 w-5 rounded" />
  //                 </div>
  //                 <div className="bg-muted mb-2 h-4 w-full rounded" />
  //                 <div className="bg-muted mb-4 h-4 w-2/3 rounded" />
  //                 <div className="flex gap-2">
  //                   <div className="bg-muted h-6 w-20 rounded-full" />
  //                   <div className="bg-muted h-6 w-16 rounded-full" />
  //                 </div>
  //               </div>
  //             ))
  //           : filteredRepos.length > 0
  //           ? filteredRepos.map((repo) => {
  //               const isExpanded = expandedAI.includes(repo.id.toString());
  //               const isTracked = trackedIds.includes(repo.id.toString());

  //               return (
  //                 <div
  //                   key={repo.id}
  //                   className="bg-card border-border hover:border-accent/30 rounded-2xl border p-5 shadow-sm transition-all"
  //                 >
  //                   <div className="mb-3 flex items-start justify-between gap-3">
  //                     <Link
  //                       href={`/issue/${repo.id}`}
  //                       className="hover:text-accent font-medium transition-colors"
  //                     >
  //                       <span className="text-muted-foreground font-normal">
  //                         {repo.owner.login}/
  //                       </span>
  //                       {repo.name}
  //                     </Link>
  //                     <button
  //                       onClick={() =>
  //                         handleAddRepo(repo.htmlUrl, repo.id.toString())
  //                       }
  //                       className="hover:bg-accent/10 rounded-lg p-1.5 transition-colors"
  //                     >
  //                       <Bookmark
  //                         className={`h-4 w-4 transition-colors ${
  //                           isTracked
  //                             ? "text-accent fill-accent"
  //                             : "text-muted-foreground"
  //                         }`}
  //                       />
  //                     </button>
  //                   </div>

  //                   <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
  //                     {repo.name}
  //                   </p>

  //                   <div className="mb-4 flex flex-wrap items-center gap-2">
  //                     <Badge
  //                       variant="outline"
  //                       className={`rounded-full text-xs ${getLanguageClass(
  //                         repo.primaryLanguage
  //                       )}`}
  //                     >
  //                       {repo.primaryLanguage}
  //                     </Badge>
  //                     <Badge
  //                       variant="outline"
  //                       className={`rounded-full text-xs ${getPopularityClass(
  //                         repo.popularity
  //                       )}`}
  //                     >
  //                       {repo.popularity}
  //                     </Badge>
  //                   </div>

  //                   <div className="border-border/50 flex items-center justify-between border-t pt-3">
  //                     <div className="text-muted-foreground flex items-center gap-4 text-sm">
  //                       <span className="flex items-center gap-1.5">
  //                         <Star className="h-3.5 w-3.5 text-amber-500" />
  //                         {repo.stars}
  //                       </span>
  //                       <span className="flex items-center gap-1.5">
  //                         <GitFork className="h-3.5 w-3.5" />
  //                         {repo.forks}
  //                       </span>
  //                     </div>
  //                     <Button
  //                       variant="ghost"
  //                       size="sm"
  //                       className={`h-8 gap-1.5 rounded-full text-xs ${
  //                         isExpanded ? "bg-accent/10 text-accent" : ""
  //                       }`}
  //                       onClick={() => toggleAI(repo.id.toString())}
  //                     >
  //                       <Sparkles className="h-3.5 w-3.5" />
  //                       AI
  //                     </Button>
  //                   </div>

  //                   {isExpanded && (
  //                     <div className="animate-fade-in border-accent/20 from-accent/5 to-accent/10 mt-4 rounded-xl border bg-gradient-to-r p-4">
  //                       <div className="mb-3 flex items-center gap-2">
  //                         <Sparkles className="text-accent h-3.5 w-3.5" />
  //                         <span className="text-accent text-xs font-medium">
  //                           AI Analysis
  //                         </span>
  //                       </div>
  //                       <div className="space-y-3 text-xs">
  //                         <div className="flex items-center justify-between">
  //                           <span className="text-muted-foreground">
  //                             Difficulty:
  //                           </span>
  //                           <Badge
  //                             variant="outline"
  //                             className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 rounded-full text-[10px]"
  //                           >
  //                             Easy
  //                           </Badge>
  //                         </div>
  //                         <div className="flex items-center justify-between">
  //                           <span className="text-muted-foreground">
  //                             Est. Time:
  //                           </span>
  //                           <span className="font-medium">2-4 hours</span>
  //                         </div>
  //                         <div className="flex items-center justify-between">
  //                           <span className="text-muted-foreground">
  //                             Skills:
  //                           </span>
  //                           <div className="flex gap-1">
  //                             <span className="text-accent bg-accent/10 rounded-full px-2 py-0.5 font-mono text-[10px]">
  //                               TypeScript
  //                             </span>
  //                           </div>
  //                         </div>
  //                         <Link
  //                           href={`/issue/${repo.id}`}
  //                           className="text-accent flex items-center justify-center gap-1.5 pt-2 font-medium"
  //                         >
  //                           View details
  //                           <ArrowRight className="h-3 w-3" />
  //                         </Link>
  //                       </div>
  //                     </div>
  //                   )}
  //                 </div>
  //               );
  //             })
  //           : null}
  //       </div>
  //     </div>
  //   </AppLayout>
  // );
}
