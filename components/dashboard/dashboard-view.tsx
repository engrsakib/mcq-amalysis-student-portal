"use client";

import { ExamsTakenChart } from "@/components/dashboard/charts/exams-taken-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { PreviousExamsCard } from "@/components/dashboard/previous-exams-card";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { ResultsTable } from "@/components/dashboard/results-table";
import { StackedResultBars } from "@/components/dashboard/stacked-result-bars";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingExamsCard } from "@/components/dashboard/upcoming-exams-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreviousExamsProvider } from "@/hooks/use-previous-exams";
import {
  UpcomingExamsProvider,
  useUpcomingExams,
} from "@/hooks/use-upcoming-exams";
import type { DashboardMock } from "@/lib/dashboard/types";

type DashboardViewProps = {
  data: DashboardMock;
  onMenuClick?: () => void;
};

function DashboardContent({ data, onMenuClick }: DashboardViewProps) {
  const { name, initials, loading: profileLoading } = useProfileDisplay();
  const { nearestExamDateLabel, loading: examsLoading } = useUpcomingExams();

  const examDate =
    nearestExamDateLabel ?? (examsLoading ? "…" : data.examDate);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
      <PageHeader
        studentName={profileLoading ? "Student" : name}
        examDate={examDate}
        initials={profileLoading ? "…" : initials}
        onMenuClick={onMenuClick}
        showMenuButton={false}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} data={stat} />
        ))}
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="min-w-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm ring-0">
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
          <UpcomingExamsCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <StackedResultBars rows={data.subjectResults} />
          <PreviousExamsCard />
        </div>
      </div>

      <ResultsTable rows={data.recentResults} />
    </div>
  );
}

export function DashboardView(props: DashboardViewProps) {
  return (
    <UpcomingExamsProvider>
      <PreviousExamsProvider>
        <DashboardContent {...props} />
      </PreviousExamsProvider>
    </UpcomingExamsProvider>
  );
}
