import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
  difficulty: string | null;
  skills: string[];
  labels: string[];
  trackedOnly: boolean;
  onDifficultyChange: (value: string | null) => void;
  onSkillToggle: (skill: string) => void;
  onLabelToggle: (label: string) => void;
  onTrackedOnlyChange: (value: boolean) => void;
  onClearAll: () => void;
  availableSkills?: string[];
  availableLabels?: string[];
}

const difficulties = ["easy", "medium", "hard"];
const defaultSkills = ["TypeScript", "React", "Node.js", "Python", "CSS", "Go", "Rust"];
const defaultLabels = ["good first issue", "help wanted", "bug", "enhancement", "documentation"];

export function FilterBar({
  difficulty,
  skills,
  labels,
  trackedOnly,
  onDifficultyChange,
  onSkillToggle,
  onLabelToggle,
  onTrackedOnlyChange,
  onClearAll,
  availableSkills = defaultSkills,
  availableLabels = defaultLabels,
}: FilterBarProps) {
  const hasFilters = difficulty || skills.length > 0 || labels.length > 0 || trackedOnly;

  return (
    <div className="border-b border-border bg-card/50 sticky top-0 z-10">
      <div className="px-4 py-3 space-y-3">
        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-16 shrink-0">Difficulty</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(difficulty === d ? null : d)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                  difficulty === d
                    ? d === "easy"
                      ? "bg-difficulty-easy/10 border-difficulty-easy text-difficulty-easy"
                      : d === "medium"
                      ? "bg-difficulty-medium/10 border-difficulty-medium text-difficulty-medium"
                      : "bg-difficulty-hard/10 border-difficulty-hard text-difficulty-hard"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-16 shrink-0">Skills</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => onSkillToggle(skill)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                  skills.includes(skill)
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-16 shrink-0">Labels</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableLabels.map((label) => (
              <button
                key={label}
                onClick={() => onLabelToggle(label)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                  labels.includes(label)
                    ? "bg-secondary border-foreground/20 text-foreground"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracked only + Clear */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onTrackedOnlyChange(!trackedOnly)}
            className={`text-xs px-2 py-1 rounded-md border transition-colors ${
              trackedOnly
                ? "bg-accent/10 border-accent text-accent"
                : "border-border hover:bg-muted text-muted-foreground"
            }`}
          >
            Tracked only
          </button>
          
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 text-xs gap-1">
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
