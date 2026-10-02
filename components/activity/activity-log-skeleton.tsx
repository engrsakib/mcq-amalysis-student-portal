import { cn } from "@/lib/utils";

export function ActivityLogSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-line/60 border-l-4 border-l-primary/30 bg-card p-4",
        className
      )}
    >
      <div className="flex justify-between gap-2">
        <div className="h-4 w-2/5 rounded bg-primary-soft/50" />
        <div className="h-5 w-20 rounded-lg bg-primary-soft/40" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-primary-soft/30" />
        <div className="h-3 w-4/5 rounded bg-primary-soft/30" />
      </div>
      <div className="mt-3 h-3 w-32 rounded bg-primary-soft/25" />
    </div>
  );
}
