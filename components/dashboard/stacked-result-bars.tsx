import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubjectResultRow, SubjectStackSegment } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

const segmentColors: Record<SubjectStackSegment["key"], string> = {
  easy: "bg-primary",
  medium: "bg-chart-2",
  hard: "bg-chart-3",
  missed: "bg-chart-5/80",
};

type StackedResultBarsProps = {
  rows: SubjectResultRow[];
};

export function StackedResultBars({ rows }: StackedResultBarsProps) {
  const legend = rows[0]?.segments ?? [];

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-sm ring-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-ink">
          Average results by subject
        </CardTitle>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {legend.map((seg) => (
            <span
              key={seg.key}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className={cn("size-2 rounded-sm", segmentColors[seg.key])}
              />
              {seg.label}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div key={row.subject} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-ink">{row.subject}</span>
              <span className="text-muted-foreground">Pass mark</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-primary-soft/60">
              {row.segments.map((seg) => (
                <div
                  key={seg.key}
                  className={cn(segmentColors[seg.key], "h-full")}
                  style={{ width: `${seg.value}%` }}
                  title={`${seg.label}: ${seg.value}%`}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
