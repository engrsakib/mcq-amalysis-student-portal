"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { PersonalGrowthCard } from "@/components/dashboard/personal-growth-card";
import { ExamBriefingModal } from "@/components/dashboard/exam-briefing-modal";
import { LiveExamsCard } from "@/components/dashboard/live-exams-card";
import { PreviousExamsCard } from "@/components/dashboard/previous-exams-card";
import { SubjectiveModelTestsCard } from "@/components/dashboard/subjective-model-tests-card";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { ResultsTable } from "@/components/dashboard/results-table";
import { StackedResultBars } from "@/components/dashboard/stacked-result-bars";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingExamsCard } from "@/components/dashboard/upcoming-exams-card";
import { ExamBriefingProvider } from "@/hooks/use-exam-briefing";
import { LiveExamsProvider } from "@/hooks/use-live-exams";
import { PersonalGrowthProvider } from "@/hooks/use-personal-growth";
import { PreviousExamsProvider } from "@/hooks/use-previous-exams";
import { SubjectiveModelTestsProvider } from "@/hooks/use-subjective-model-tests";
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
    <div className="w-full min-w-0 space-y-6">
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
        <PersonalGrowthCard />
        <StackedResultBars rows={data.subjectResults} />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <LiveExamsCard />
        <PreviousExamsCard />
        <UpcomingExamsCard />
        <SubjectiveModelTestsCard />
      </div>

      <ResultsTable rows={data.recentResults} />
    </div>
  );
}

export function DashboardView(props: DashboardViewProps) {
  return (
    <PersonalGrowthProvider>
      <ExamBriefingProvider>
        <UpcomingExamsProvider>
          <PreviousExamsProvider>
            <SubjectiveModelTestsProvider>
              <LiveExamsProvider>
                <DashboardContent {...props} />
                <ExamBriefingModal />
              </LiveExamsProvider>
            </SubjectiveModelTestsProvider>
          </PreviousExamsProvider>
        </UpcomingExamsProvider>
      </ExamBriefingProvider>
    </PersonalGrowthProvider>
  );
}
