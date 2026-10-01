"use client";

import { ExamsTakenChart } from "@/components/dashboard/charts/exams-taken-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { ResultsTable } from "@/components/dashboard/results-table";
import { StackedResultBars } from "@/components/dashboard/stacked-result-bars";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMock } from "@/lib/dashboard/types";

type DashboardViewProps = {
  data: DashboardMock;
  onMenuClick?: () => void;
};

export function DashboardView({ data, onMenuClick }: DashboardViewProps) {
  const { name, initials, loading } = useProfileDisplay();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        studentName={loading ? "Student" : name}
        examDate={data.examDate}
        initials={loading ? "…" : initials}
        onMenuClick={onMenuClick}
        showMenuButton={false}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} data={stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm ring-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-ink">
              Exams taken
            </CardTitle>
            <span className="rounded-lg border border-line px-2 py-1 text-xs text-muted-foreground">
              Monthly
            </span>
          </CardHeader>
          <CardContent>
            <ExamsTakenChart data={data.examsTakenSeries} />
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-primary/25" />
                Active exams
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                Exam attempts
              </span>
            </div>
          </CardContent>
        </Card>
        <StackedResultBars rows={data.subjectResults} />
      </div>

      <ResultsTable rows={data.recentResults} />
    </div>
  );
}
