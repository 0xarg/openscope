"use client";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/devlens/app-sidebar-demo";
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
  ArrowLeft,
  Star,
  GitFork,
  RefreshCw,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Issue {
  id: string;
  number: number;
  title: string;
  state: "open" | "closed";
  labels: string[];
  createdAt: string;
  author: string;
  comments: number;
  difficulty?: "easy" | "medium" | "hard";
  estimatedTime?: string;
  skills?: string[];
}

interface RepoInfo {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

// Mock data for repository
const mockRepoInfo: Record<string, RepoInfo> = {
  "1": {
    name: "vite",
    owner: "vitejs",
    description: "Next Generation Frontend Tooling",
    stars: 64500,
    forks: 5800,
    language: "TypeScript",
  },
  "2": {
    name: "ui",
    owner: "shadcn",
    description: "Beautifully designed components",
    stars: 52000,
    forks: 2900,
    language: "TypeScript",
  },
  "3": {
    name: "next.js",
    owner: "vercel",
    description: "The React Framework for the Web",
    stars: 118000,
    forks: 25400,
    language: "TypeScript",
  },
  "4": {
    name: "react",
    owner: "facebook",
    description: "The library for web and native user interfaces",
    stars: 220000,
    forks: 45000,
    language: "JavaScript",
  },
};

// Mock issues for each repository
const mockIssues: Record<string, Issue[]> = {
  "1": [
    {
      id: "101",
      number: 15234,
      title: "Add TypeScript support for configuration files",
      state: "open",
      labels: ["enhancement", "good first issue"],
      createdAt: "2024-01-15",
      author: "user1",
      comments: 12,
      difficulty: "easy",
      estimatedTime: "2-4 hours",
      skills: ["TypeScript", "Config"],
    },
    {
      id: "102",
      number: 15198,
      title: "Optimize HMR performance for large projects",
      state: "open",
      labels: ["performance", "hmr"],
      createdAt: "2024-01-12",
      author: "user2",
      comments: 8,
      difficulty: "hard",
      estimatedTime: "8-12 hours",
      skills: ["Vite", "HMR", "Performance"],
    },
    {
      id: "103",
      number: 15156,
      title: "Fix CSS modules not working with SSR",
      state: "open",
      labels: ["bug", "ssr"],
      createdAt: "2024-01-10",
      author: "user3",
      comments: 5,
      difficulty: "medium",
      estimatedTime: "4-6 hours",
      skills: ["CSS", "SSR"],
    },
    {
      id: "104",
      number: 15089,
      title: "Add support for custom middleware",
      state: "open",
      labels: ["feature request"],
      createdAt: "2024-01-08",
      author: "user4",
      comments: 15,
      difficulty: "medium",
      estimatedTime: "6-8 hours",
      skills: ["Middleware", "Server"],
    },
    {
      id: "105",
      number: 15045,
      title: "Documentation: Update plugin API examples",
      state: "open",
      labels: ["documentation", "good first issue"],
      createdAt: "2024-01-05",
      author: "user5",
      comments: 3,
      difficulty: "easy",
      estimatedTime: "1-2 hours",
      skills: ["Documentation"],
    },
  ],
  "2": [
    {
      id: "201",
      number: 4521,
      title: "Improve error messages for invalid props",
      state: "open",
      labels: ["bug", "dx"],
      createdAt: "2024-01-14",
      author: "dev1",
      comments: 6,
      difficulty: "easy",
      estimatedTime: "2-3 hours",
      skills: ["TypeScript", "React"],
    },
    {
      id: "202",
      number: 4498,
      title: "Add dark mode toggle animation",
      state: "open",
      labels: ["enhancement"],
      createdAt: "2024-01-11",
      author: "dev2",
      comments: 10,
      difficulty: "easy",
      estimatedTime: "1-2 hours",
      skills: ["CSS", "Animation"],
    },
    {
      id: "203",
      number: 4456,
      title: "Calendar component accessibility improvements",
      state: "open",
      labels: ["a11y", "component"],
      createdAt: "2024-01-09",
      author: "dev3",
      comments: 4,
      difficulty: "medium",
      estimatedTime: "4-5 hours",
      skills: ["Accessibility", "React"],
    },
  ],
  "3": [
    {
      id: "301",
      number: 58934,
      title: "Fix memory leak in useEffect cleanup",
      state: "open",
      labels: ["bug", "memory"],
      createdAt: "2024-01-16",
      author: "contributor1",
      comments: 22,
      difficulty: "hard",
      estimatedTime: "10-15 hours",
      skills: ["React", "Memory", "Debugging"],
    },
    {
      id: "302",
      number: 58890,
      title: "Add internationalization support",
      state: "open",
      labels: ["i18n", "feature"],
      createdAt: "2024-01-13",
      author: "contributor2",
      comments: 18,
      difficulty: "medium",
      estimatedTime: "6-8 hours",
      skills: ["i18n", "Next.js"],
    },
    {
      id: "303",
      number: 58845,
      title: "Improve build performance for monorepos",
      state: "open",
      labels: ["performance"],
      createdAt: "2024-01-10",
      author: "contributor3",
      comments: 9,
      difficulty: "hard",
      estimatedTime: "12-16 hours",
      skills: ["Build", "Monorepo"],
    },
    {
      id: "304",
      number: 58801,
      title: "Update Turbopack integration docs",
      state: "open",
      labels: ["documentation"],
      createdAt: "2024-01-07",
      author: "contributor4",
      comments: 2,
      difficulty: "easy",
      estimatedTime: "1-2 hours",
      skills: ["Documentation"],
    },
  ],
  "4": [
    {
      id: "401",
      number: 28456,
      title: "Concurrent rendering improvements",
      state: "open",
      labels: ["react-core", "performance"],
      createdAt: "2024-01-15",
      author: "fb-dev1",
      comments: 45,
      difficulty: "hard",
      estimatedTime: "20+ hours",
      skills: ["React Core", "Fiber"],
    },
    {
      id: "402",
      number: 28412,
      title: "Add support for custom schedulers",
      state: "open",
      labels: ["feature", "scheduler"],
      createdAt: "2024-01-12",
      author: "fb-dev2",
      comments: 28,
      difficulty: "hard",
      estimatedTime: "15-20 hours",
      skills: ["Scheduler", "React"],
    },
  ],
};

const issueAges = [
  "All",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Older",
];

const getDifficultyClass = (difficulty: string) => {
  const classes: Record<string, string> = {
    easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    hard: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  };
  return classes[difficulty] || "";
};

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

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export default function RepositoryIssues() {
  const { repoId } = useParams<{ repoId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [labelFilter, setLabelFilter] = useState("All");
  const [trackedIds, setTrackedIds] = useState<string[]>(["101", "301"]);
  const [expandedAI, setExpandedAI] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const repoInfo = mockRepoInfo[repoId || "1"] || mockRepoInfo["1"];
  const issues = mockIssues[repoId || "1"] || [];

  // Extract unique labels from issues
  const availableLabels = [
    "All",
    ...Array.from(new Set(issues.flatMap((issue) => issue.labels))).sort(),
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.labels.some((l) =>
        l.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const daysAgo = getIssueDaysAgo(issue.createdAt);
    let matchesAge = true;
    if (ageFilter === "Last 7 days") matchesAge = daysAgo <= 7;
    else if (ageFilter === "Last 30 days") matchesAge = daysAgo <= 30;
    else if (ageFilter === "Last 90 days") matchesAge = daysAgo <= 90;
    else if (ageFilter === "Older") matchesAge = daysAgo > 90;

    const matchesLabel =
      labelFilter === "All" || issue.labels.includes(labelFilter);
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
            <Link href="/demo/repositories">
              <ArrowLeft className="h-4 w-4" />
              Back to Repositories
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl bg-card border border-border">
            {isLoading ? (
              <div className="flex items-center gap-4 w-full">
                <div className="h-14 w-14 rounded-xl bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-72 bg-muted rounded animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                  <FolderGit2 className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold">
                      {repoInfo.owner}/{repoInfo.name}
                    </h1>
                    <a
                      href={`https://github.com/${repoInfo.owner}/${repoInfo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {repoInfo.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      {formatNumber(repoInfo.stars)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GitFork className="h-4 w-4" />
                      {formatNumber(repoInfo.forks)}
                    </span>
                    <Badge variant="outline" className="text-xs rounded-full">
                      {repoInfo.language}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Open Issues</h2>
              <p className="text-sm text-muted-foreground">
                {issues.length} issues found
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
                const isExpanded = expandedAI.includes(issue.id);
                const isTracked = trackedIds.includes(issue.id);

                return (
                  <div key={issue.id} className="group">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-accent/5">
                      {/* Issue Title */}
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleTrack(issue.id)}
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
                            href={`/demo/issue/${repoInfo.owner}/${repoInfo.name}/${issue.id}`}
                            className="hover:text-accent transition-colors font-medium text-sm block truncate"
                          >
                            {issue.title}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            #{issue.number} opened by {issue.author}
                          </span>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="col-span-2 flex gap-2 flex-wrap">
                        {issue.labels.slice(0, 2).map((label) => (
                          <Badge
                            key={label}
                            variant="secondary"
                            className="text-[10px] px-2.5 py-1 rounded-full font-normal truncate max-w-[100px]"
                          >
                            {label}
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
                          {issue.comments}
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
                          onClick={() => toggleAI(issue.id)}
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
                            href={`/demo/issue/${repoInfo.owner}/${repoInfo.name}/${issue.id}`}
                          >
                            View
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* AI Expanded */}
                    {isExpanded && (
                      <div className="mx-6 mb-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 animate-fade-in">
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
                                issue.difficulty || "easy"
                              )}`}
                            >
                              {issue.difficulty || "Unknown"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Est. Time:
                            </span>
                            <span className="font-medium">
                              {issue.estimatedTime || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Skills:
                            </span>
                            <div className="flex gap-1.5">
                              {issue.skills?.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Link
                            href={`/demo/issue/${issue.id}/${repoInfo.owner}/${repoInfo.name}`}
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
              const isExpanded = expandedAI.includes(issue.id);
              const isTracked = trackedIds.includes(issue.id);

              return (
                <div
                  key={issue.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/demo/issue/${issue.id}/${repoInfo.owner}/${repoInfo.name}`}
                        className="font-medium hover:text-accent transition-colors block truncate"
                      >
                        {issue.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        #{issue.number} • {issue.comments} comments
                      </span>
                    </div>
                    <button
                      onClick={() => handleTrack(issue.id)}
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
                        key={label}
                        variant="secondary"
                        className="text-[10px] rounded-full"
                      >
                        {label}
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
                      onClick={() => toggleAI(issue.id)}
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
                          <span className="font-medium">
                            {issue.estimatedTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1.5">
                            Skills:
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {issue.skills?.map((skill) => (
                              <span
                                key={skill}
                                className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
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
                          href={`/demo/issue/${issue.id}/${repoInfo.owner}/${repoInfo.name}`}
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
