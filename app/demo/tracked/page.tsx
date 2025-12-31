"use client";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/devlens/app-sidebar-demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Bookmark,
  Circle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

interface TrackedIssue {
  id: string;
  title: string;
  repo: string;
  repoOwner: string;
  labels: string[];
  difficulty: "easy" | "medium" | "hard";
  skills: string[];
  status: "not-started" | "in-progress" | "completed";
  lastUpdated: string;
}

const trackedIssues: TrackedIssue[] = [
  {
    id: "1",
    title: "Add TypeScript support for configuration files",
    repo: "vite",
    repoOwner: "vitejs",
    labels: ["enhancement", "good first issue"],
    difficulty: "easy",
    skills: ["TypeScript", "Node.js"],
    status: "in-progress",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    title: "Improve error messages for invalid props",
    repo: "ui",
    repoOwner: "shadcn",
    labels: ["bug", "dx"],
    difficulty: "medium",
    skills: ["React", "TypeScript"],
    status: "not-started",
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    title: "Add dark mode toggle animation",
    repo: "next.js",
    repoOwner: "vercel",
    labels: ["feature request", "help wanted"],
    difficulty: "easy",
    skills: ["CSS", "React"],
    status: "completed",
    lastUpdated: "3 days ago",
  },
];

const statusTabs = [
  { key: "all", label: "All", icon: Bookmark },
  { key: "not-started", label: "Planned", icon: Circle },
  { key: "in-progress", label: "In Progress", icon: Clock },
  { key: "completed", label: "Done", icon: CheckCircle2 },
];

export default function TrackedIssues() {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedAI, setExpandedAI] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = () => {
    setIsLoading(true);
    toast({
      title: "Syncing tracked issues...",
      description: "Fetching latest status",
    });
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Synced", description: "Tracked issues are up to date" });
    }, 1500);
  };

  const toggleAI = (id: string) => {
    setExpandedAI((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredIssues = trackedIssues.filter((issue) => {
    if (activeTab === "all") return true;
    return issue.status === activeTab;
  });

  const counts = {
    all: trackedIssues.length,
    "not-started": trackedIssues.filter((i) => i.status === "not-started")
      .length,
    "in-progress": trackedIssues.filter((i) => i.status === "in-progress")
      .length,
    completed: trackedIssues.filter((i) => i.status === "completed").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 rounded-full text-amber-500 border-amber-500/30 bg-amber-500/10 font-medium"
          >
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 rounded-full text-emerald-500 border-emerald-500/30 bg-emerald-500/10 font-medium"
          >
            Done
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 rounded-full font-medium"
          >
            Planned
          </Badge>
        );
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Tracked Issues</h1>
            <p className="text-sm text-muted-foreground">
              Your saved issues and their progress
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
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
            <Badge variant="secondary" className="text-sm">
              {trackedIssues.length} tracked
            </Badge>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-xl mb-6 overflow-x-auto">
          {statusTabs.map((tab) => {
            const count = counts[tab.key as keyof typeof counts];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-background text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <tab.icon
                  className={`h-4 w-4 ${isActive ? "text-accent" : ""}`}
                />
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-accent/15 text-accent font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Issues table - Desktop */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden hidden sm:block shadow-sm">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40 font-medium">
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Repository</div>
            <div className="col-span-4">Issue</div>
            <div className="col-span-2">Labels</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {isLoading ? (
            <div className="divide-y divide-border/50">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center"
                >
                  <div className="col-span-2">
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="col-span-4">
                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-10 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-1" />
                </div>
              ))}
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filteredIssues.map((issue) => {
                const isAIExpanded = expandedAI.includes(issue.id);
                return (
                  <div key={issue.id} className="group">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-accent/5">
                      {/* Status */}
                      <div className="col-span-2">
                        {getStatusBadge(issue.status)}
                      </div>

                      {/* Repo */}
                      <Link
                        href={`/demo/repository/${issue.repoOwner}/${issue.repo}`}
                        className="col-span-3"
                      >
                        <span className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors truncate block">
                          {issue.repoOwner}/{issue.repo}
                        </span>
                      </Link>

                      {/* Title */}
                      <Link
                        href={`/demo/issue/${issue.repoOwner}/${issue.repo}/${issue.id}`}
                        className="col-span-4"
                      >
                        <span className="text-sm font-medium truncate block hover:text-accent transition-colors">
                          {issue.title}
                        </span>
                      </Link>

                      {/* Labels */}
                      <div className="col-span-2 flex items-center gap-1.5">
                        {issue.labels.slice(0, 2).map((label) => (
                          <Badge
                            key={label}
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 rounded-full font-normal truncate max-w-[80px]"
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-full transition-all ${
                            isAIExpanded
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
                          className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-accent/10 hover:text-accent"
                          asChild
                        >
                          <Link
                            href={`/demo/issue/${issue.repoOwner}/${issue.repo}/${issue.id}`}
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* AI Expanded */}
                    {isAIExpanded && (
                      <div className="mx-6 mb-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-accent">
                            AI Analysis
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Difficulty:
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs rounded-full ${
                                issue.difficulty === "easy"
                                  ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                                  : issue.difficulty === "medium"
                                  ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
                                  : "text-rose-500 border-rose-500/30 bg-rose-500/10"
                              }`}
                            >
                              {issue.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Skills:
                            </span>
                            <div className="flex gap-1.5">
                              {issue.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Updated:
                            </span>
                            <span className="text-foreground font-medium">
                              {issue.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="mb-3 text-lg">No issues in this category</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link href="/demo/dashboard">Browse issues</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Cards - Mobile */}
        <div className="sm:hidden space-y-3 mt-4">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-card border border-border animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => {
              const isAIExpanded = expandedAI.includes(issue.id);
              return (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {getStatusBadge(issue.status)}
                    <span className="font-mono text-xs text-muted-foreground">
                      {issue.repoOwner}/{issue.repo}
                    </span>
                  </div>

                  <Link
                    href={`/demo/issue/${issue.repoOwner}/${issue.repo}${issue.id}`}
                    className="font-medium text-sm hover:text-accent transition-colors block mb-3"
                  >
                    {issue.title}
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {issue.labels.slice(0, 2).map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => toggleAI(issue.id)}
                    >
                      <Sparkles className="h-3 w-3" />
                      {isAIExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  {isAIExpanded && (
                    <div className="mt-3 pt-3 border-t border-border text-xs animate-fade-in">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Difficulty:
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              issue.difficulty === "easy"
                                ? "text-accent border-accent/40"
                                : issue.difficulty === "medium"
                                ? "text-warning border-warning/40"
                                : "text-destructive border-destructive/40"
                            }`}
                          >
                            {issue.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-muted-foreground">Skills:</span>
                          {issue.skills.map((skill) => (
                            <span
                              key={skill}
                              className="font-mono text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          Updated: {issue.lastUpdated}
                        </p>
                      </div>
                      <Link
                        href={`/demo/issue/${issue.repoOwner}/${issue.repo}/${issue.id}`}
                        className="mt-2 text-accent hover:underline flex items-center gap-1"
                      >
                        View details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bookmark className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="mb-2">No issues in this category.</p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demo/dashboard">Browse issues</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
