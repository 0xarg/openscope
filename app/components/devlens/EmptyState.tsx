import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type EmptyStateType = "no-repos" | "no-issues" | "no-tracked" | "not-found" | "no-results";

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
}

const emptyStateConfig = {
  "no-repos": {
    title: "No repositories added yet",
    action: "Add your first repository →",
    suggestion: "Paste a GitHub URL like github.com/vitejs/vite to get started.",
  },
  "no-issues": {
    title: "No issues in this repository",
    action: "Try another repository →",
    suggestion: "This repo might not have open issues, or they're all claimed.",
  },
  "no-tracked": {
    title: "No tracked issues yet",
    action: "Find beginner-friendly issues →",
    suggestion: "Start by exploring repositories with 'good first issue' labels.",
  },
  "no-results": {
    title: "No issues match your filters",
    action: "Clear filters →",
    suggestion: "Try removing some filters to see more results.",
  },
  "not-found": {
    title: "Page not found",
    action: "Go to dashboard →",
    suggestion: "The page you're looking for doesn't exist.",
  },
};

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = emptyStateConfig[type];

  return (
    <div className="py-12 px-4 text-center max-w-md mx-auto">
      <h3 className="text-sm font-medium mb-1">{config.title}</h3>
      <p className="text-xs text-muted-foreground mb-4">
        {config.suggestion}
      </p>
      {onAction && (
        <Button variant="ghost" size="sm" onClick={onAction} className="text-xs gap-1 text-accent">
          {config.action}
        </Button>
      )}
    </div>
  );
}
