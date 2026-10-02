import { Card, CardContent } from "@/components/ui/card";
import { BarSparkline } from "@/components/dashboard/charts/bar-sparkline";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { LineSparkline } from "@/components/dashboard/charts/line-sparkline";
import type { StatCardData } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

type StatCardProps = {
  data: StatCardData;
};

export function StatCard({ data }: StatCardProps) {
  return (
    <Card className="min-h-[7.5rem] rounded-2xl border-border/60 bg-card shadow-sm ring-0">
      <CardContent className="flex items-center justify-between gap-3 py-4 sm:py-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">
            {data.title}
          </p>
          <p className="mt-1 truncate text-xl font-semibold tabular-nums tracking-tight text-ink sm:text-2xl">
            {data.value}
          </p>
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              data.deltaPositive ? "text-primary" : "text-danger"
            )}
          >
            {data.delta}
          </p>
        </div>
        {data.variant === "donut" && data.donutPercent != null ? (
          <DonutChart percent={data.donutPercent} />
        ) : null}
        {data.variant === "bars" && data.barValues ? (
          <BarSparkline values={data.barValues} />
        ) : null}
        {data.variant === "line" && data.lineValues ? (
          <LineSparkline values={data.lineValues} />
        ) : null}
      </CardContent>
    </Card>
  );
}
