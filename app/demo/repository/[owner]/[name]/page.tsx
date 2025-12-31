"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/devlens/app-sidebar-demo";
import {
  ArrowLeft,
  Star,
  GitFork,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  GitPullRequest,
  Bug,
  Lightbulb,
  Target,
  ArrowRight,
  Copy,
  Github,
  Code,
  FileCode,
  BookOpen,
  RefreshCw,
  Bookmark,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepoData {
  id: string;
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  openPRs: number;
  license: string;
  createdAt: string;
  lastUpdated: string;
  topics: string[];
  defaultBranch: string;
}

const mockRepoData: Record<string, RepoData> = {
  "1": {
    id: "1",
    name: "vite",
    owner: "vitejs",
    description: "Next Generation Frontend Tooling. It's fast!",
    language: "TypeScript",
    stars: 64500,
    forks: 5800,
    watchers: 680,
    openIssues: 156,
    openPRs: 42,
    license: "MIT",
    createdAt: "2020-04-21",
    lastUpdated: "2024-01-20",
    topics: ["build-tool", "frontend", "bundler", "esm", "typescript", "hmr"],
    defaultBranch: "main",
  },
  "2": {
    id: "2",
    name: "ui",
    owner: "shadcn",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS.",
    language: "TypeScript",
    stars: 52000,
    forks: 2900,
    watchers: 420,
    openIssues: 89,
    openPRs: 28,
    license: "MIT",
    createdAt: "2023-01-04",
    lastUpdated: "2024-01-19",
    topics: ["react", "components", "tailwindcss", "radix-ui", "accessibility"],
    defaultBranch: "main",
  },
  "3": {
    id: "3",
    name: "next.js",
    owner: "vercel",
    description: "The React Framework for the Web",
    language: "TypeScript",
    stars: 118000,
    forks: 25400,
    watchers: 1500,
    openIssues: 342,
    openPRs: 156,
    license: "MIT",
    createdAt: "2016-10-25",
    lastUpdated: "2024-01-20",
    topics: ["react", "nextjs", "framework", "ssr", "static-site-generator"],
    defaultBranch: "canary",
  },
  "4": {
    id: "4",
    name: "react",
    owner: "facebook",
    description: "The library for web and native user interfaces",
    language: "JavaScript",
    stars: 220000,
    forks: 45000,
    watchers: 6700,
    openIssues: 1205,
    openPRs: 312,
    license: "MIT",
    createdAt: "2013-05-24",
    lastUpdated: "2024-01-20",
    topics: ["react", "javascript", "library", "frontend", "ui"],
    defaultBranch: "main",
  },
};

const aiInsight = {
  summary:
    "A highly active project with strong community engagement and consistent maintenance.",
  contributorFriendliness: "high" as const,
  activityLevel: "very active" as const,
  codeQuality: 94,
  communityScore: 91,
  documentationQuality: "Excellent",
  bestFor: [
    "Learning modern development practices",
    "Building production applications",
    "Contributing to open source",
  ],
  gettingStarted: [
    "1. Fork the repository and clone locally",
    "2. Install dependencies with pnpm install",
    "3. Read CONTRIBUTING.md for guidelines",
    "4. Look for 'good first issue' labeled issues",
  ],
  hotAreas: [
    "Performance optimization",
    "Documentation improvements",
    "Bug fixes",
  ],
  techStack: ["TypeScript", "Node.js", "Rollup", "esbuild"],
};

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
};

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RepositoryDetail() {
  const { repoId } = useParams<{ repoId: string }>();
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTracked, setIsTracked] = useState(true);
  const { toast } = useToast();

  const repo = mockRepoData[repoId || "1"] || mockRepoData["1"];
  const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [repoId]);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing repository...",
      description: "Fetching latest data from GitHub",
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSyncing(false);
    toast({
      title: "Sync complete",
      description: "Repository data is now up to date",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(repoUrl);
    toast({
      title: "Link copied",
      description: "Repository URL copied to clipboard",
    });
  };

  const handleToggleTracking = () => {
    setIsTracked(!isTracked);
    toast({
      title: isTracked ? "Repository untracked" : "Repository tracked",
      description: isTracked
        ? "Removed from your tracked list"
        : "Added to your tracked list",
    });
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Back navigation */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 gap-1.5 text-sm group"
          asChild
        >
          <Link href="/demo/repositories">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Repositories
          </Link>
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="font-mono text-sm text-muted-foreground">
                {repo.owner}/{repo.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                isTracked
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={handleToggleTracking}
              disabled={isLoading}
              title={isTracked ? "Untrack repository" : "Track repository"}
            >
              <Bookmark
                className={`h-4 w-4 ${isTracked ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleSync}
              disabled={isSyncing || isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isSyncing ? "Syncing..." : "Sync"}
              </span>
            </Button>
          </div>
        </div>

        {/* Main grid layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left - Repository content (3 cols) */}
          <div className="lg:col-span-3 space-y-4 animate-slide-up">
            {/* Repo header card */}
            <div className="p-5 rounded-xl bg-card border border-border">
              {isLoading ? (
                <>
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-36 rounded-lg ml-auto" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                      <Code className="h-7 w-7 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl sm:text-2xl font-semibold leading-tight mb-1">
                        {repo.name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {repo.owner}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {repo.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          languageColors[repo.language] || "bg-gray-400"
                        }`}
                      />
                      <span className="font-medium text-foreground">
                        {repo.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-foreground">
                        {formatNumber(repo.stars)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GitFork className="h-4 w-4" />
                      <span>{formatNumber(repo.forks)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{formatNumber(repo.watchers)} watching</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Button className="gap-2" asChild>
                      <Link href={`/demo/issues/${repo.owner}/${repo.name}`}>
                        <Bug className="h-4 w-4" />
                        View Issues ({repo.openIssues})
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="gap-2 ml-auto" asChild>
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="hidden sm:inline">Open on GitHub</span>
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Repository Stats */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Repository Details</span>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Open Issues
                    </p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Bug className="h-4 w-4 text-amber-500" />
                      {repo.openIssues}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Open PRs
                    </p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-accent" />
                      {repo.openPRs}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      License
                    </p>
                    <p className="text-lg font-semibold">{repo.license}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Created
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(repo.createdAt)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(repo.lastUpdated)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Default Branch
                    </p>
                    <code className="text-sm font-mono text-accent">
                      {repo.defaultBranch}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Quick Links</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start h-10 text-sm"
                  asChild
                >
                  <a
                    href={`${repoUrl}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Lightbulb className="h-4 w-4 mr-2 text-accent" />
                    Good First Issues
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-10 text-sm"
                  asChild
                >
                  <a
                    href={`${repoUrl}/blob/${repo.defaultBranch}/CONTRIBUTING.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Contributing Guide
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-10 text-sm"
                  asChild
                >
                  <a
                    href={`${repoUrl}/pulls`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitPullRequest className="h-4 w-4 mr-2" />
                    Pull Requests
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-10 text-sm"
                  asChild
                >
                  <a
                    href={`${repoUrl}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Releases
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right - AI Insights (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Insights Card */}
            <div className="rounded-xl ai-surface overflow-hidden animate-slide-in-right">
              <div className="p-5">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-background/50"
                        >
                          <Skeleton className="h-3 w-24 mb-2" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <div className="flex flex-wrap gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-14 rounded-md" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-1" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-32 mb-2" />
                      <div className="flex flex-wrap gap-1.5">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-32 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl ai-gradient-border flex items-center justify-center animate-pulse-glow">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            AI Repository Analysis
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contributor insights
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Contributor Friendly
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            aiInsight.contributorFriendliness === "high"
                              ? "text-accent border-accent/40 bg-accent/10"
                              : "text-warning border-warning/40 bg-warning/10"
                          }`}
                        >
                          {aiInsight.contributorFriendliness}
                        </Badge>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Activity Level
                        </p>
                        <span className="font-semibold text-sm capitalize">
                          {aiInsight.activityLevel}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Code Quality
                        </p>
                        <span className="font-semibold text-sm">
                          {aiInsight.codeQuality}%
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Community Score
                        </p>
                        <span className="font-semibold text-sm">
                          {aiInsight.communityScore}%
                        </span>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Summary
                      </p>
                      <p className="text-sm">{aiInsight.summary}</p>
                    </div>

                    {/* Best For */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Best For
                      </p>
                      <ul className="space-y-1">
                        {aiInsight.bestFor.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-accent mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hot Areas */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Hot Contribution Areas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.hotAreas.map((area) => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="text-xs"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Getting Started - collapsible */}
              <div className="border-t border-accent/20">
                <button
                  onClick={() => setShowGettingStarted(!showGettingStarted)}
                  className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    Getting Started
                  </div>
                  {showGettingStarted ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {showGettingStarted && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <div className="space-y-2">
                      {aiInsight.gettingStarted.map((step, i) => (
                        <p
                          key={i}
                          className="text-sm text-muted-foreground pl-4 border-l-2 border-accent/30"
                        >
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div
              className="p-5 rounded-xl bg-card border border-border animate-slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-sm font-medium mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 text-sm group"
                  asChild
                >
                  <Link
                    href={`/demo/issues/${repo.owner}/${repo.name}/${repo.id}`}
                  >
                    Browse All Issues
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 text-sm group"
                  asChild
                >
                  <a
                    href={`${repoUrl}/fork`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fork Repository
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
