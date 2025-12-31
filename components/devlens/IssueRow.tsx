import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "./DifficultyBadge";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Circle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export interface Issue {
  id: string;
  title: string;
  repo: string;
  repoOwner: string;
  labels: string[];
  difficulty: "easy" | "medium" | "hard";
  skills: string[];
  isTracked?: boolean;
  status?: "not-started" | "in-progress" | "completed";
  aiSummary?: string;
}

interface IssueRowProps {
  issue: Issue;
  onTrack?: (id: string) => void;
  showStatus?: boolean;
}

const statusConfig = {
  "not-started": {
    icon: Circle,
    color: "text-muted-foreground",
    label: "Planned",
  },
  "in-progress": { icon: Clock, color: "text-warning", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-success", label: "Done" },
};

export function IssueRow({ issue, onTrack, showStatus }: IssueRowProps) {
  const StatusIcon = issue.status ? statusConfig[issue.status].icon : null;
  const statusColor = issue.status ? statusConfig[issue.status].color : "";

  return (
    <Link
      href={`/issue/${issue.id}`}
      className="group flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 border-b border-border/50 last:border-b-0 transition-colors cursor-pointer"
    >
      {/* Track button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTrack?.(issue.id);
        }}
        className="shrink-0 p-1 hover:bg-muted rounded transition-colors"
      >
        {issue.isTracked ? (
          <BookmarkCheck className="h-4 w-4 text-accent" />
        ) : (
          <Bookmark className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        )}
      </button>

      {/* Status (if tracked) */}
      {showStatus && StatusIcon && (
        <div className={`shrink-0 ${statusColor}`}>
          <StatusIcon className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Repo */}
      <span className="shrink-0 text-xs text-muted-foreground w-28 truncate">
        {issue.repoOwner}/{issue.repo}
      </span>

      {/* Title */}
      <span className="flex-1 text-sm font-medium truncate group-hover:text-accent transition-colors">
        {issue.title}
      </span>

      {/* Labels */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {issue.labels.slice(0, 2).map((label) => (
          <Badge
            key={label}
            variant="label"
            className="text-[10px] px-1.5 py-0"
          >
            {label}
          </Badge>
        ))}
      </div>

      {/* Difficulty */}
      <div className="shrink-0">
        <DifficultyBadge level={issue.difficulty} size="sm" />
      </div>

      {/* Skills */}
      <div className="hidden lg:flex items-center gap-1 shrink-0 w-32">
        {issue.skills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* GitHub link */}
      <a
        href={`https://github.com/${issue.repoOwner}/${issue.repo}/issues`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all"
      >
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </a>
    </Link>
  );
}
