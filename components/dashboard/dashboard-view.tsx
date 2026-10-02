"use client";

import dynamic from "next/dynamic";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { PersonalGrowthCard } from "@/components/dashboard/personal-growth-card";
import { LiveExamsCard } from "@/components/dashboard/live-exams-card";
import { PreviousExamsCard } from "@/components/dashboard/previous-exams-card";
import { SubjectiveModelTestsCard } from "@/components/dashboard/subjective-model-tests-card";
import { ResultsTable } from "@/components/dashboard/results-table";
import { BooksSection } from "@/components/dashboard/books-section";
import { ExamRoutineSection } from "@/components/dashboard/exam-routine-section";
import { YoutubeSection } from "@/components/dashboard/youtube-section";
import { StudyPlanSection } from "@/components/dashboard/study-plan-section";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingExamsCard } from "@/components/dashboard/upcoming-exams-card";
import { ExamBriefingProvider } from "@/hooks/use-exam-briefing";
import { LiveExamsProvider } from "@/hooks/use-live-exams";
import { PersonalGrowthProvider } from "@/hooks/use-personal-growth";
import { PreviousExamsProvider } from "@/hooks/use-previous-exams";
import { SubjectiveModelTestsProvider } from "@/hooks/use-subjective-model-tests";
import type { DashboardMock } from "@/lib/dashboard/types";

const ExamBriefingModal = dynamic(
  () =>
    import("@/components/dashboard/exam-briefing-modal").then(
      (mod) => mod.ExamBriefingModal
    ),
  { ssr: false }
);

type DashboardViewProps = {
  data: DashboardMock;
  onMenuClick?: () => void;
};

function DashboardContent({ data }: DashboardViewProps) {
  return (
    <div className="w-full min-w-0 space-y-10 sm:space-y-12">
      <DashboardSection first>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.stats.map((stat) => (
            <StatCard key={stat.id} data={stat} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Exams & practice">
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <LiveExamsCard />
          <PreviousExamsCard />
          <UpcomingExamsCard />
          <SubjectiveModelTestsCard />
        </div>
      </DashboardSection>

      <DashboardSection title="Performance">
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <PersonalGrowthCard />
          <StudyPlanSection />
        </div>
        <ResultsTable rows={data.recentResults} />
      </DashboardSection>

      <DashboardSection title="Learning resources">
        <div className="space-y-4">
          <ExamRoutineSection />
          <BooksSection />
          <YoutubeSection />
        </div>
      </DashboardSection>
    </div>
  );
}

export function DashboardView(props: DashboardViewProps) {
  return (
    <PersonalGrowthProvider>
      <ExamBriefingProvider>
        <PreviousExamsProvider>
          <SubjectiveModelTestsProvider>
            <LiveExamsProvider>
              <DashboardContent {...props} />
              <ExamBriefingModal />
            </LiveExamsProvider>
          </SubjectiveModelTestsProvider>
        </PreviousExamsProvider>
      </ExamBriefingProvider>
    </PersonalGrowthProvider>
  );
}
