import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLine({ className }: SkeletonLoaderProps) {
  return <div className={cn("skeleton h-4 w-full", className)} />;
}

export function SkeletonCircle({ className }: SkeletonLoaderProps) {
  return <div className={cn("skeleton h-8 w-8 rounded-full", className)} />;
}

export function IssueRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-border/50 animate-pulse">
      <div className="w-6">
        <div className="skeleton h-4 w-4 rounded" />
      </div>
      <div className="w-28 lg:w-32">
        <div className="skeleton h-3 w-20 rounded" />
      </div>
      <div className="flex-1">
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      <div className="hidden md:flex gap-1 w-32">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-10 rounded-full" />
      </div>
      <div className="w-6">
        <div className="skeleton h-4 w-4 rounded" />
      </div>
    </div>
  );
}

export function RepoCardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-card border border-border animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="skeleton h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <div className="skeleton h-4 w-24 rounded mb-2" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded mb-2" />
      <div className="skeleton h-3 w-2/3 rounded mb-4" />
      <div className="flex gap-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text = "Loading" }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-3 w-3 border border-current border-t-transparent rounded-full animate-spin" />
      <span>{text}</span>
    </div>
  );
}
