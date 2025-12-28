import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, ExternalLink, ArrowRight } from "lucide-react";

export interface Repository {
  id: string;
  name: string;
  owner: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  issueCount?: number;
}

interface RepoCardProps {
  repo: Repository;
  onViewIssues?: (id: string) => void;
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  Ruby: "bg-red-600",
  PHP: "bg-indigo-500",
  C: "bg-gray-500",
  "C++": "bg-pink-500",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-500",
};

export function RepoCard({ repo, onViewIssues }: RepoCardProps) {
  return (
    <Card variant="interactive" className="group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">
              {repo.owner}
            </p>
            <h3 className="font-semibold text-base group-hover:text-accent transition-colors">
              {repo.name}
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" asChild>
            <a href={`https://github.com/${repo.owner}/${repo.name}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {repo.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {repo.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                <span>{repo.language}</span>
              </div>
            )}
            {repo.stars !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                <span>{repo.stars.toLocaleString()}</span>
              </div>
            )}
            {repo.forks !== undefined && (
              <div className="flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                <span>{repo.forks.toLocaleString()}</span>
              </div>
            )}
          </div>

          {repo.issueCount !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {repo.issueCount} issues
            </Badge>
          )}
        </div>

        <Button
          variant="subtle"
          size="sm"
          className="w-full mt-4 gap-1"
          onClick={() => onViewIssues?.(repo.id)}
        >
          View Issues
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
