import { useState } from "react";
import { DifficultyBadge } from "./DifficultyBadge";
import { TrackingStatus } from "./TrackingStatus";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AIInsight {
  summary: string;
  difficulty: "easy" | "medium" | "hard";
  skills: string[];
  cause?: string;
  approach?: string;
}

interface AIMetadataPanelProps {
  insight: AIInsight;
  issueUrl: string;
  isTracked: boolean;
  status?: "not-started" | "in-progress" | "completed";
  onTrack: () => void;
  onStatusChange?: (status: "not-started" | "in-progress" | "completed") => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function AIMetadataPanel({
  insight,
  issueUrl,
  isTracked,
  status,
  onTrack,
  onStatusChange,
  notes,
  onNotesChange,
}: AIMetadataPanelProps) {
  const [isApproachOpen, setIsApproachOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Tracking */}
      <div className="pb-4 border-b border-border">
        <TrackingStatus
          isTracked={isTracked}
          status={status}
          onTrack={onTrack}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* AI Metadata - Inline, not conversational */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>AI Analysis</span>
        </div>

        {/* Difficulty */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Difficulty</span>
          <DifficultyBadge level={insight.difficulty} />
        </div>

        {/* Skills */}
        <div>
          <span className="text-xs text-muted-foreground block mb-1.5">Skills</span>
          <div className="flex flex-wrap gap-1">
            {insight.skills.map((skill) => (
              <span 
                key={skill} 
                className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Summary - muted, 2-3 lines max */}
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Summary</span>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {insight.summary}
          </p>
        </div>

        {/* Approach - collapsible */}
        {insight.approach && (
          <Collapsible open={isApproachOpen} onOpenChange={setIsApproachOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
              <span>Recommended approach</span>
              {isApproachOpen ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {insight.approach}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* User notes */}
      {isTracked && (
        <div className="pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground block mb-1.5">Your notes</span>
          <Textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="text-xs min-h-[60px] resize-none"
          />
        </div>
      )}

      {/* GitHub link */}
      <div className="pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs" asChild>
          <a href={issueUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
            Open on GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
