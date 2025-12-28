import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "./DifficultyBadge";
import { SkillTags } from "./SkillTag";
import { ExternalLink, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";

export interface Issue {
  id: string;
  title: string;
  repo: string;
  repoOwner: string;
  labels: string[];
  difficulty: "easy" | "medium" | "hard";
  skills: string[];
  isTracked?: boolean;
  aiSummary?: string;
}

interface IssueCardProps {
  issue: Issue;
  onTrack?: (id: string) => void;
  onView?: (id: string) => void;
}

export function IssueCard({ issue, onTrack, onView }: IssueCardProps) {
  return (
    <Card variant="interactive" className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1.5">
              {issue.repoOwner}/{issue.repo}
            </p>
            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {issue.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onTrack?.(issue.id);
            }}
          >
            {issue.isTracked ? (
              <BookmarkCheck className="h-4 w-4 text-accent" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Labels */}
        <div className="flex flex-wrap gap-1.5">
          {issue.labels.slice(0, 3).map((label) => (
            <Badge key={label} variant="label" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>

        {/* AI Insights */}
        <div className="flex items-center gap-2 flex-wrap">
          <DifficultyBadge level={issue.difficulty} />
          <SkillTags skills={issue.skills} max={2} />
        </div>

        {/* AI Summary Preview */}
        {issue.aiSummary && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {issue.aiSummary}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" className="text-xs h-8 gap-1" asChild>
            <a href={`https://github.com/${issue.repoOwner}/${issue.repo}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
              GitHub
            </a>
          </Button>
          <Button
            variant="subtle"
            size="sm"
            className="text-xs h-8 gap-1"
            onClick={() => onView?.(issue.id)}
          >
            View Issue
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
