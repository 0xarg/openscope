import { Badge } from "@/components/ui/badge";

type DifficultyLevel = "easy" | "medium" | "hard";

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  size?: "sm" | "default";
}

export function DifficultyBadge({ level, size = "default" }: DifficultyBadgeProps) {
  const sizeClasses = size === "sm" 
    ? "text-[10px] px-1.5 py-0" 
    : "text-xs px-2 py-0.5";
    
  return (
    <Badge variant={level} className={sizeClasses}>
      {level}
    </Badge>
  );
}
