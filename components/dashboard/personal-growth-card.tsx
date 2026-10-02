"use client";

import {
  Award,
  ClipboardList,
  Percent,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { PersonalGrowthChart } from "@/components/dashboard/charts/personal-growth-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonalGrowth } from "@/hooks/use-personal-growth";
import {
  formatAvgScoreValue,
  formatCorrectRate,
} from "@/lib/dashboard/personal-growth";
import { cn } from "@/lib/utils";

function KpiTile({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: LucideIcon;
  /** Screen reader only */
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-2.5 rounded-xl border border-line/70 bg-card px-2.5 py-2.5 shadow-sm sm:px-3"
      aria-label={`${label}: ${value}`}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset sm:size-9",
          highlight
            ? "bg-primary text-primary-foreground ring-primary/30"
            : "bg-primary-soft/90 text-primary ring-primary/10"
        )}
      >
        <Icon className="size-4 sm:size-[17px]" strokeWidth={2} aria-hidden />
      </div>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-left text-sm font-semibold tabular-nums leading-none tracking-tight sm:text-lg",
          highlight ? "text-primary" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function PersonalGrowthCard() {
  const {
    lastThreeDays,
    lastDaysSummary,
    professionalGrade,
    loading,
    error,
  } = usePersonalGrowth();

  const hasData = lastThreeDays.length > 0;

  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-line/80 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft ring-1 ring-primary/10">
            <TrendingUp className="size-5 text-primary" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-ink">
              Personal growth
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your recent exam performance
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-lg border border-primary/20 bg-primary-soft/60 px-2.5 py-1 text-xs font-medium text-primary">
          Last 3 days
        </span>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-primary-soft/35"
                />
              ))}
            </div>
            <div className="h-[220px] animate-pulse rounded-xl bg-primary-soft/25" />
          </div>
        ) : null}

        {!loading && error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {!loading && !error && !hasData ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No activity in the last few days. Take an exam to see your progress
            here.
          </p>
        ) : null}

        {!loading && !error && hasData ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <KpiTile
                icon={ClipboardList}
                label="Total attempts"
                value={String(lastDaysSummary.totalAttempts)}
              />
              <KpiTile
                icon={Target}
                label="Average score"
                value={formatAvgScoreValue(lastDaysSummary.averageTotalScore)}
                highlight
              />
              <KpiTile
                icon={Percent}
                label="Correct rate"
                value={formatCorrectRate(lastDaysSummary.averageCorrectRate)}
              />
              <KpiTile
                icon={Award}
                label="Professional grade"
                value={String(professionalGrade)}
              />
            </div>

            <div className="rounded-xl border border-line/80 bg-card p-3 ring-1 ring-primary/5 sm:p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-ink">Daily activity</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-[3px] bg-primary/25 ring-1 ring-primary/30" />
                    Attempts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-4 items-center">
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary" />
                      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card" />
                    </span>
                    Avg score
                  </span>
                </div>
              </div>
              <PersonalGrowthChart data={lastThreeDays} />
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
