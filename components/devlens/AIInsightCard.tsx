import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "./DifficultyBadge";
import { SkillTags } from "./SkillTag";
import { Sparkles, Lightbulb, Target, Wrench } from "lucide-react";

interface AIInsight {
  summary: string;
  difficulty: "easy" | "medium" | "hard";
  skills: string[];
  cause?: string;
  approach?: string;
}

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <Card variant="ai" className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-ai-start to-ai-end flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-base">AI Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">
              Powered by OpenScope AI
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            Summary
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.summary}
          </p>
        </div>

        {/* Difficulty & Skills */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-xs text-muted-foreground block mb-1.5">
              Difficulty
            </span>
            <DifficultyBadge level={insight.difficulty} />
          </div>
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block mb-1.5">
              Skills Required
            </span>
            <SkillTags skills={insight.skills} max={5} />
          </div>
        </div>

        {/* Cause */}
        {insight.cause && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Root Cause
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.cause}
            </p>
          </div>
        )}

        {/* Approach */}
        {insight.approach && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-accent" />
              Recommended Approach
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.approach}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
