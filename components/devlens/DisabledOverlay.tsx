import { Lock } from "lucide-react";

interface DisabledOverlayProps {
  reason?: string;
  children: React.ReactNode;
}

export const DisabledOverlay = ({
  reason = "Under Development",
  children,
}: DisabledOverlayProps) => {
  return (
    <div className="relative">
      <div className="blur-[2px] pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/80 rounded-full border border-border/50">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {reason}
          </span>
        </div>
      </div>
    </div>
  );
};
