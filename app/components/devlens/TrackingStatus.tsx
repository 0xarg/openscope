import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bookmark,
  BookmarkCheck,
  Circle,
  Clock,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TrackingStatusType = "not-started" | "in-progress" | "completed";

interface TrackingStatusProps {
  isTracked: boolean;
  status?: TrackingStatusType;
  onTrack: () => void;
  onStatusChange?: (status: TrackingStatusType) => void;
}

const statusConfig = {
  "not-started": { 
    icon: Circle, 
    label: "Planned", 
    color: "text-muted-foreground",
    bg: "bg-muted"
  },
  "in-progress": { 
    icon: Clock, 
    label: "In Progress", 
    color: "text-warning",
    bg: "bg-warning/10"
  },
  "completed": { 
    icon: CheckCircle2, 
    label: "Done", 
    color: "text-success",
    bg: "bg-success/10"
  },
};

export function TrackingStatus({ 
  isTracked, 
  status = "not-started", 
  onTrack, 
  onStatusChange 
}: TrackingStatusProps) {
  if (!isTracked) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onTrack}
      >
        <Bookmark className="h-4 w-4" />
        Track Issue
      </Button>
    );
  }

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BookmarkCheck className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">Tracked</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-full justify-between ${config.bg} border-0`}
          >
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
              <span className="text-sm">{config.label}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {(Object.entries(statusConfig) as [TrackingStatusType, typeof statusConfig["not-started"]][]).map(
            ([key, value]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onStatusChange?.(key)}
                className="gap-2"
              >
                <value.icon className={`h-3.5 w-3.5 ${value.color}`} />
                <span>{value.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs text-muted-foreground hover:text-destructive"
        onClick={onTrack}
      >
        Untrack
      </Button>
    </div>
  );
}
