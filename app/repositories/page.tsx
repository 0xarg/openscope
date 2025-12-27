"use client";
import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/devlens/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Star,
  GitFork,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FolderGit2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { RepositoryDB } from "@/types/database/github/repository";

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

export default function Repositories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [repos, setRepos] = useState<RepositoryDB[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepositories = useCallback(async () => {
    try {
      const res = await axios.get("api/repository");
      if (res.status !== 200) {
        throw new Error("Error fetching repositories");
      }
      setRepos(res.data.repos);
      console.log(res.data);
      setIsPageLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong, Try again later",
        description:
          "There is a issue while fetching repositories, so try again later",
      });
    }
  }, []);

  useEffect(() => {
    // const timer = setTimeout(() => setIsPageLoading(false), 600);
    // return () => clearTimeout(timer);
    setIsPageLoading(true);
    fetchRepositories();
  }, []);

  const handleSync = () => {
    setIsPageLoading(true);
    toast({
      title: "Syncing repositories...",
      description: "Fetching latest data from GitHub",
    });
    setTimeout(() => {
      setIsPageLoading(false);
      toast({ title: "Synced", description: "Repositories are up to date" });
    }, 1500);
  };

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRepo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAddDialogOpen(false);
      setRepoUrl("");
      toast({
        title: "Repository added",
        description: "The repository has been added to your list.",
      });
    }, 1500);
  };

  const popularRepos = ["facebook/react", "vercel/next.js", "microsoft/vscode"];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Repositories</h1>
            <p className="text-sm text-muted-foreground">
              Your tracked repositories
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-full"
              onClick={handleSync}
              disabled={isPageLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isPageLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Sync</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Repo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-accent" />
                    Add Repository
                  </DialogTitle>
                  <DialogDescription>
                    Enter a GitHub repository URL to start tracking.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/owner/repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      Quick add
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {popularRepos.map((repo) => (
                        <Button
                          key={repo}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() =>
                            setRepoUrl(`https://github.com/${repo}`)
                          }
                        >
                          {repo}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddRepo}
                    disabled={!repoUrl || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-card"
          />
        </div>

        {/* Repository Grid */}
        {isPageLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-24 animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-full animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse mb-4" />
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="group p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
                      <FolderGit2 className="h-6 w-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold group-hover:text-accent transition-colors truncate">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {repo.owner}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://github.com/${repo.owner}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5 line-clamp-2 min-h-[40px]">
                  {repo.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-5 mb-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        languageColors[repo.language] || "bg-gray-400"
                      }`}
                    />
                    <span>{repo.language}</span>
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
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1.5 rounded-full px-3 py-1"
                  >
                    <Sparkles className="h-3 w-3 text-accent" />
                    {repo.issueCount} issues
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1.5 rounded-full group/btn hover:bg-accent/10 hover:text-accent"
                    asChild
                  >
                    <Link href="/dashboard">
                      View
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : repos.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="mb-3 text-lg">No repositories yet</p>
            <Button
              className="rounded-full"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add your first repo
            </Button>
          </div>
        ) : (
          <div className="p-16 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="mb-3 text-lg">No repositories found</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
