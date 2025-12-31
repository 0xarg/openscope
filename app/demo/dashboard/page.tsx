"use client";
import { useState, useEffect } from "react";
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
  Loader2,
  Star,
  GitFork,
  RefreshCw,
} from "lucide-react";
import { AppLayout } from "@/components/devlens/app-sidebar-demo";
import Link from "next/link";

interface Issue {
  id: string;
  title: string;
  repo: string;
  owner: string;
  language: string;
  tags: string[];
  stars: string;
  forks: string;
  popularity: string;
}

const allIssues: Issue[] = [
  {
    id: "1",
    title: "Add TypeScript support for configuration files",
    repo: "vite",
    owner: "vitejs",
    language: "TypeScript",
    tags: ["enhancement", "good first issue"],
    stars: "64.5k",
    forks: "5.8k",
    popularity: "Famous",
  },
  {
    id: "2",
    title: "Improve error messages for invalid props",
    repo: "ui",
    owner: "shadcn",
    language: "TypeScript",
    tags: ["bug", "dx"],
    stars: "52k",
    forks: "2.9k",
    popularity: "Popular",
  },
  {
    id: "3",
    title: "Add dark mode toggle animation",
    repo: "next.js",
    owner: "vercel",
    language: "TypeScript",
    tags: ["feature"],
    stars: "118k",
    forks: "25.4k",
    popularity: "Legendary",
  },
  {
    id: "4",
    title: "Fix memory leak in useEffect cleanup",
    repo: "react",
    owner: "facebook",
    language: "JavaScript",
    tags: ["bug"],
    stars: "220k",
    forks: "45k",
    popularity: "Legendary",
  },
  {
    id: "5",
    title: "Add support for custom themes",
    repo: "tailwindcss",
    owner: "tailwindlabs",
    language: "TypeScript",
    tags: ["enhancement"],
    stars: "78k",
    forks: "4k",
    popularity: "Famous",
  },
  {
    id: "6",
    title: "Optimize bundle size for production",
    repo: "vite",
    owner: "vitejs",
    language: "TypeScript",
    tags: ["performance"],
    stars: "64.5k",
    forks: "5.8k",
    popularity: "Popular",
  },
  {
    id: "7",
    title: "Add internationalization support",
    repo: "next.js",
    owner: "vercel",
    language: "Python",
    tags: ["i18n"],
    stars: "118k",
    forks: "25.4k",
    popularity: "Rising",
  },
  {
    id: "8",
    title: "Improve accessibility for modal components",
    repo: "ui",
    owner: "shadcn",
    language: "Rust",
    tags: ["a11y"],
    stars: "52k",
    forks: "2.9k",
    popularity: "Popular",
  },
];

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
  const [trackedIds, setTrackedIds] = useState<string[]>(["1", "3"]);
  const [expandedAI, setExpandedAI] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.repo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      languageFilter === "All" || issue.language === languageFilter;
    const matchesPopularity =
      popularityFilter === "All" || issue.popularity === popularityFilter;
    return matchesSearch && matchesLanguage && matchesPopularity;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Trending Issues</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Discover and track open source issues
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
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-[120px] sm:w-[140px] h-9">
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
                <SelectTrigger className="w-[120px] sm:w-[140px] h-9">
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
            <div className="col-span-4 flex items-center gap-2">
              <span className="w-6"></span>
              Repository
            </div>
            <div className="col-span-2">Language</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-1 text-right">Stars</div>
            <div className="col-span-1 text-right">Forks</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="divide-y divide-border/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                    <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 w-10 bg-muted rounded animate-pulse ml-auto" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-1" />
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
                      {/* Repo */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
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
                        <Link
                          href={`/demo/issue/${issue.id}`}
                          className="hover:text-accent transition-colors truncate font-medium text-sm"
                        >
                          <span className="text-muted-foreground font-normal">
                            {issue.owner}/
                          </span>
                          {issue.repo}
                        </Link>
                      </div>

                      {/* Language */}
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium rounded-full ${getLanguageClass(
                            issue.language
                          )}`}
                        >
                          {issue.language}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="col-span-2 flex gap-2 flex-wrap">
                        {issue.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] px-2.5 py-1 rounded-full font-normal truncate max-w-[100px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stars */}
                      <div className="col-span-1 text-right">
                        <span className="font-mono text-sm text-muted-foreground flex items-center justify-end gap-1.5">
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                          {issue.stars}
                        </span>
                      </div>

                      {/* Forks */}
                      <div className="col-span-1 text-right">
                        <span className="font-mono text-sm text-muted-foreground flex items-center justify-end gap-1.5">
                          <GitFork className="h-3.5 w-3.5" />
                          {issue.forks}
                        </span>
                      </div>

                      {/* Popularity */}
                      <div className="col-span-1 flex justify-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium rounded-full ${getPopularityClass(
                            issue.popularity
                          )}`}
                        >
                          {issue.popularity}
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
                          onClick={() => toggleAI(issue.id)}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
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
                              className="text-xs rounded-full bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            >
                              Easy
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Est. Time:
                            </span>
                            <span className="font-medium">2-4 hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Skills:
                            </span>
                            <div className="flex gap-1.5">
                              <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                TypeScript
                              </span>
                              <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                React
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/demo/issue/${issue.id}`}
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
        <div className="md:hidden space-y-4">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card border border-border animate-pulse shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-muted rounded w-32" />
                  <div className="h-5 w-5 bg-muted rounded" />
                </div>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-muted rounded-full" />
                  <div className="h-6 w-16 bg-muted rounded-full" />
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
                    <Link
                      href={`/demo/issue/${issue.id}`}
                      className="font-medium hover:text-accent transition-colors"
                    >
                      <span className="text-muted-foreground font-normal">
                        {issue.owner}/
                      </span>
                      {issue.repo}
                    </Link>
                    <button
                      onClick={() => handleTrack(issue.id)}
                      className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <Bookmark
                        className={`h-4 w-4 transition-colors ${
                          isTracked
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {issue.title}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Badge
                      variant="outline"
                      className={`text-xs rounded-full ${getLanguageClass(
                        issue.language
                      )}`}
                    >
                      {issue.language}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs rounded-full ${getPopularityClass(
                        issue.popularity
                      )}`}
                    >
                      {issue.popularity}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        {issue.stars}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GitFork className="h-3.5 w-3.5" />
                        {issue.forks}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 gap-1.5 text-xs rounded-full ${
                        isExpanded ? "bg-accent/10 text-accent" : ""
                      }`}
                      onClick={() => toggleAI(issue.id)}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      AI
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-medium text-accent">
                          AI Analysis
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Difficulty
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs rounded-full bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          >
                            Easy
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Est. Time
                          </span>
                          <span className="font-medium">2-4 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Skills</span>
                          <div className="flex gap-1">
                            <span className="font-mono text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                              TypeScript
                            </span>
                            <span className="font-mono text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                              React
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/demo/issue/${issue.id}`}
                        className="mt-3 text-accent hover:underline flex items-center gap-1.5 text-sm font-medium"
                      >
                        View details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="mb-3">No issues found</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setSearchQuery("");
                  setLanguageFilter("All");
                  setPopularityFilter("All");
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
