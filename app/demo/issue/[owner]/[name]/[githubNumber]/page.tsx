"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/devlens/app-sidebar-demo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  Clock,
  MessageSquare,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle2,
  PlayCircle,
  Copy,
  Github,
  FileCode,
  Target,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
const issueData = {
  id: "1",
  title: "Add TypeScript support for configuration files",
  repo: "vite",
  repoOwner: "vitejs",
  number: 12847,
  state: "open",
  labels: ["enhancement", "good first issue", "help wanted", "typescript"],
  author: "developer123",
  createdAt: "2024-01-15",
  comments: 8,
  body: `## Description

Currently, Vite configuration files only support JavaScript. This issue proposes adding TypeScript support for \`vite.config.ts\` files.

## Motivation

Many developers prefer TypeScript for better type checking and IDE support. Having native TypeScript support for configuration would improve the developer experience significantly.

## Proposed Solution

1. Detect \`.ts\` extension for config files
2. Use \`esbuild\` or \`tsx\` to transpile on-the-fly
3. Provide type definitions for configuration options

## Additional Context

Related issues: #12345, #12346

Would be happy to work on this if the maintainers approve the approach.`,
};

const aiInsight = {
  summary:
    "Add TypeScript support for Vite configuration files with file extension detection and on-the-fly transpilation.",
  difficulty: "easy" as const,
  skills: ["TypeScript", "Node.js", "Build Tools", "esbuild"],
  cause:
    "Vite only supports JavaScript configuration files, limiting IDE support and type safety for developers.",
  approach: [
    "1. Examine config loading logic in packages/vite/src/node/config.ts",
    "2. Implement conditional transpilation based on file extension",
    "3. Use existing esbuild integration for TypeScript parsing",
    "4. Add proper type definitions export",
  ],
  estimatedTime: "2-4 hours",
  matchScore: 92,
  filestoExplore: [
    "packages/vite/src/node/config.ts",
    "packages/vite/src/node/plugins/esbuild.ts",
  ],
};

const statusOptions = [
  {
    value: "not-started",
    label: "Planned",
    icon: Circle,
    color: "text-muted-foreground",
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: PlayCircle,
    color: "text-warning",
  },
  {
    value: "completed",
    label: "Done",
    icon: CheckCircle2,
    color: "text-accent",
  },
];

export default function IssueDetail() {
  const [isTracked, setIsTracked] = useState(false);
  const [status, setStatus] = useState<
    "not-started" | "in-progress" | "completed"
  >("not-started");
  const [notes, setNotes] = useState("");
  const [showApproach, setShowApproach] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const issueUrl = `https://github.com/${issueData.repoOwner}/${issueData.repo}/issues/${issueData.number}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing issue...",
      description: "Fetching latest data from GitHub",
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSyncing(false);
    toast({
      title: "Sync complete",
      description: "Issue data is now up to date",
    });
  };

  const handleTrack = () => {
    setIsTracked(!isTracked);
    toast({
      title: isTracked ? "Issue untracked" : "Issue tracked",
      description: isTracked
        ? "Removed from your list"
        : "Added to your tracked issues",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(issueUrl);
    toast({
      title: "Link copied",
      description: "Issue URL copied to clipboard",
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
          <Link href="/demo/dashboard">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-16" />
              </>
            ) : (
              <>
                <span className="font-mono text-sm text-muted-foreground">
                  {issueData.repoOwner}/{issueData.repo}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="font-mono text-sm text-muted-foreground">
                  #{issueData.number}
                </span>
              </>
            )}
          </div>
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

        {/* Main grid layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left - GitHub content (3 cols) */}
          <div className="lg:col-span-3 space-y-4 animate-slide-up">
            {/* Issue header card */}
            <div className="p-5 rounded-xl bg-card border border-border">
              {isLoading ? (
                <>
                  <Skeleton className="h-7 w-full max-w-md mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Skeleton className="h-10 w-28 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-36 rounded-lg ml-auto" />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-semibold leading-tight mb-4">
                    {issueData.title}
                  </h1>

                  {/* Labels */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                      {issueData.state}
                    </Badge>
                    {issueData.labels.map((label) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="text-xs"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b border-border">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{issueData.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{issueData.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" />
                      <span>{issueData.comments} comments</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Button
                      variant={isTracked ? "default" : "outline"}
                      className={`gap-2 ${
                        isTracked ? "bg-accent hover:bg-accent/90" : ""
                      }`}
                      onClick={handleTrack}
                    >
                      {isTracked ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          Tracked
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Track Issue
                        </>
                      )}
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
                        href={issueUrl}
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

            {/* Issue body */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Description</span>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-transparent p-0 border-0">
                    {issueData.body}
                  </pre>
                </div>
              )}
            </div>

            {/* Notes section */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Your Notes</span>
              </div>
              <Textarea
                placeholder="Add your notes, ideas, or approach here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none text-sm"
              />
            </div>
          </div>

          {/* Right - AI & Status (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Status tracker (if tracked) */}
            {isTracked && (
              <div className="p-5 rounded-xl bg-card border border-border animate-slide-in-right">
                <p className="text-sm font-medium mb-3">Progress Status</p>
                <div className="flex gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={status === option.value ? "secondary" : "ghost"}
                      size="sm"
                      className={`flex-1 gap-1.5 text-xs h-9 ${
                        status === option.value ? option.color : ""
                      }`}
                      onClick={() => {
                        setStatus(option.value as typeof status);
                        toast({ title: `Status updated to ${option.label}` });
                      }}
                    >
                      <option.icon className="h-3.5 w-3.5" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights Card */}
            <div
              className="rounded-xl ai-surface overflow-hidden animate-slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="p-5">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-24 mb-2" />
                      <div className="flex flex-wrap gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mt-1" />
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
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
                          <p className="font-semibold">AI Analysis</p>
                          <p className="text-xs text-muted-foreground">
                            {aiInsight.matchScore}% skill match
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Difficulty
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            aiInsight.difficulty === "easy"
                              ? "text-accent border-accent/40 bg-accent/10"
                              : aiInsight.difficulty === "medium"
                              ? "text-warning border-warning/40 bg-warning/10"
                              : "text-destructive border-destructive/40 bg-destructive/10"
                          }`}
                        >
                          {aiInsight.difficulty}
                        </Badge>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Est. Time
                        </p>
                        <span className="font-semibold text-sm">
                          {aiInsight.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Required Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.skills.map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20"
                          >
                            {skill}
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

                    {/* Root Cause */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Root Cause
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {aiInsight.cause}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Approach - collapsible */}
              <div className="border-t border-accent/20">
                <button
                  onClick={() => setShowApproach(!showApproach)}
                  className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    Suggested Approach
                  </div>
                  {showApproach ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {showApproach && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <div className="space-y-2">
                      {aiInsight.approach.map((step, i) => (
                        <p
                          key={i}
                          className="text-sm text-muted-foreground pl-4 border-l-2 border-accent/30"
                        >
                          {step}
                        </p>
                      ))}
                    </div>

                    {/* Files to explore */}
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <p className="text-xs text-muted-foreground mb-2">
                        Files to explore
                      </p>
                      <div className="space-y-1">
                        {aiInsight.filestoExplore.map((file) => (
                          <code
                            key={file}
                            className="block text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded"
                          >
                            {file}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div
              className="p-5 rounded-xl bg-card border border-border animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-sm font-medium mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 text-sm group"
                  asChild
                >
                  <a
                    href={`https://github.com/${issueData.repoOwner}/${issueData.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 text-sm group"
                  asChild
                >
                  <a
                    href={`${issueUrl}#issuecomment-new`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Add Comment
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
