import { Badge } from "@/components/ui/badge";

interface SkillTagProps {
  skill: string;
}

export function SkillTag({ skill }: SkillTagProps) {
  return (
    <Badge variant="skill" className="text-xs">
      {skill}
    </Badge>
  );
}

interface SkillTagsProps {
  skills: string[];
  max?: number;
}

export function SkillTags({ skills, max = 3 }: SkillTagsProps) {
  const displayedSkills = skills.slice(0, max);
  const remainingCount = skills.length - max;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayedSkills.map((skill) => (
        <SkillTag key={skill} skill={skill} />
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
