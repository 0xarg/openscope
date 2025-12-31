"use client";

import { useState, useEffect, useCallback } from "react";
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
import axiosInstance from "@/lib/axios";
import { GitHubRepository } from "@/types/github/repository";
import { formatDigits } from "@/lib/utils/formatDigits";
import { GitHubIssue } from "@/types/github/issues";
import { fetchGithubRepo } from "@/lib/utils/fetchGithubRepo";
import { IssueWithAI } from "@/types/ai/issueAI";
import { AppLayout } from "@/components/devlens/app-sidebar";

const languages = ["All", "TypeScript", "JavaScript", "Python", "Rust", "Go"];
const popularities = ["All", "Legendary", "Famous", "Popular", "Rising"];

export default function Issues({
  params,
}: {
  params: { name: string; owner: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [expandedAI, setExpandedAI] = useState<string>("");
  const [repoInfo, setRepoInfo] = useState<GitHubRepository>();
  const [allIssues, setAllIssues] = useState<IssueWithAI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(true);
  const { toast } = useToast();

  const trackedIssue = useCallback(async () => {
    const res = await axiosInstance.get("/api/issues/tracked/ids");
    if (res.data.trackedIds) {
      setTrackedIds(res.data.trackedIds);
    }
  }, []);

  const handleTrack = useCallback(
    async (issue: GitHubIssue) => {
      let alreadyTracked = false;
      const githubId = issue.githubId.toString();
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
          description: "Issue already tracked",
        });
        return;
      }
      try {
        toast({
          title: "Tracking issue",
          description: "Adding to track list may take few seconds",
        });
        const res = await axiosInstance.post("/api/issue/track", {
          issue: issue,
          owner: repoInfo?.owner.login,
          name: repoInfo?.name,
          status: "not-started",
        });
        toast({
          title: "Issue tracked",
          description: "Issue saved with AI insights",
        });
      } catch (error) {
        setTrackedIds((prev) => prev.filter((id) => id !== githubId));
        toast({
          title: "Error tracking issue",
          description: "Unable to track issue now",
        });
      }
    },
    [toast]
  );

  const fetchRepositoryIssues = useCallback(
    async (owner: string, name: string) => {
      try {
        const res = await axiosInstance.post(`/api/issues/`, {
          name: name,
          owner: owner,
        });
        setAllIssues(res.data.issues);
      } catch (error) {
        console.log("Error fetching issues, ", error);
        toast({ title: "Error fetching issues;" });
      }
    },
    []
  );

  const fetchGithubRepoInfo = useCallback(
    async (owner: string, name: string) => {
      try {
        const res = await axiosInstance.get(
          `/api/repository/info?owner=${owner}&name=${name}`
        );
        setRepoInfo(res.data.repo);
      } catch (error) {
        toast({
          title: "Error getting repository info",
          description: "Please try again after sometime",
        });
      }
    },
    []
  );
  const fetchAIData = useCallback(async (issue: IssueWithAI) => {
    toast({
      title: "Getting AI insights",
      description: "Please wait for few seconds to get insights",
    });
    setExpandedAI(issue.githubId.toString());
    setIsAILoading(true);

    try {
      const res = await axiosInstance.post("/api/issue/ai/basic", {
        issue,
      });
      const data = res.data;
      setAllIssues((prev) =>
        prev.map((i) =>
          i.githubId.toString() === issue.githubId.toString()
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

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    setExpandedAI("");
    try {
      const { owner, name } = await params;
      await Promise.all([
        fetchGithubRepoInfo(owner, name),
        trackedIssue(),
        fetchRepositoryIssues(owner, name),
      ]);
    } finally {
      setIsLoading(false);
      toast({ title: "Synced", description: "Everything is up to date" });
    }
  }, [params, fetchRepositoryIssues, fetchGithubRepoInfo, trackedIssue]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

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

  const [ageFilter, setAgeFilter] = useState("All");
  const [labelFilter, setLabelFilter] = useState("All");

  const issueAges = [
    "All",
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Older",
  ];

  const availableLabels = [
    "All",
    ...Array.from(
      new Set(allIssues.flatMap((issue) => issue.labels.map((l) => l.name)))
    ).sort(),
  ];

  const getDifficultyClass = (difficulty: string) => {
    const classes: Record<string, string> = {
      easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      hard: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    };
    return classes[difficulty] || "";
  };

  const handleSync = () => {
    toast({
      title: "Syncing issues...",
      description: "Fetching latest data from GitHub",
    });
    loadPageData();
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
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/0 flex items-center justify-center shrink-0">
                {repoInfo?.owner.avatarUrl ? (
                  <img
                    src={repoInfo.owner.avatarUrl}
                    className="rounded-full"
                    alt=""
                  />
                ) : (
                  <FolderGit2 className="h-7 w-7 text-accent" />
                )}
              </div>
              {isLoading ? (
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                    <div className="h-4 bg-muted rounded w-64 animate-pulse" />
                  </div>
                  <div className="h-4 bg-muted rounded w-64 animate-pulse" />

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="h-4 bg-muted rounded w-64 animate-pulse" />

                    <div className="h-4 bg-muted rounded w-64 animate-pulse" />

                    <div className="h-4 bg-muted rounded w-64 animate-pulse" />
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Open Issues</h2>
              <p className="text-sm text-muted-foreground">
                {filteredIssues.length} recent issues found
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
                const isExpanded = expandedAI.includes(
                  issue.githubId.toString()
                );
                const isTracked = trackedIds.includes(
                  issue.githubId.toString()
                );

                return (
                  <div key={issue.id} className="group">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-accent/5">
                      {/* Issue Title */}
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => {
                            handleTrack(issue);
                          }}
                          className="shrink-0 p-1 rounded-md transition-all hover:bg-accent/10 hover:scale-110"
                        >
                          <Bookmark
                            className={`h-4 w-4 transition-colors ${
                              trackedIds.includes(issue.githubId.toString())
                                ? "fill-accent text-accent"
                                : "text-muted-foreground hover:text-accent"
                            }`}
                          />
                        </button>
                        <div className="min-w-0">
                          <Link
                            href={`/issue/${repoInfo?.owner.login}/${repoInfo?.name}/${issue.number}`}
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
                          onClick={() => fetchAIData(issue)}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1 rounded-full"
                          asChild
                        >
                          <Link
                            href={`/issue/${repoInfo?.owner.login}/${repoInfo?.name}/${issue.number}`}
                          >
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

                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              <Badge
                                variant="outline"
                                className={`text-xs rounded-full capitalize ${getDifficultyClass(
                                  issue.ai?.difficulty ?? ""
                                )}`}
                              >
                                {issue.ai?.difficulty}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Est. Time:
                            </span>
                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              <span className="font-medium">
                                {issue.ai?.estimatedTime}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Skills:
                            </span>
                            <div className="flex gap-1.5">
                              {isAILoading ? (
                                <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                              ) : (
                                issue.ai?.skills?.map((skill) => (
                                  <span
                                    key={skill}
                                    className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/issue/${repoInfo?.owner.login}/${repoInfo?.name}/${issue.number}`}
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
              const isExpanded = expandedAI.includes(issue.githubId.toString());
              const isTracked = trackedIds.includes(issue.githubId.toString());

              return (
                <div
                  key={issue.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/issue/${repoInfo?.owner.login}/${repoInfo?.name}/${issue.number}`}
                        className="font-medium hover:text-accent transition-colors block truncate"
                      >
                        {issue.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        #{issue.number} • {issue.commentsCount} comments
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleTrack(issue);
                        setTrackedIds((prev) => [
                          ...prev,
                          issue.githubId.toString(),
                        ]);
                      }}
                      className="shrink-0 p-1.5 rounded-md hover:bg-accent/10"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          trackedIds.includes(issue.githubId.toString())
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
                      onClick={() => fetchAIData(issue)}
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
                          {isAILoading ? (
                            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                          ) : (
                            <span className="font-medium">
                              {issue.ai?.estimatedTime}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1.5">
                            Skills:
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {isAILoading ? (
                              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                            ) : (
                              issue.ai?.skills?.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3 gap-1.5 text-accent"
                        asChild
                      >
                        <Link
                          href={`/issue/${repoInfo?.owner.login}/${repoInfo?.name}/${issue.number}`}
                        >
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
}
