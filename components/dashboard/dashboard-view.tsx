"use client";

import { PersonalGrowthCard } from "@/components/dashboard/personal-growth-card";
import { ExamBriefingModal } from "@/components/dashboard/exam-briefing-modal";
import { LiveExamsCard } from "@/components/dashboard/live-exams-card";
import { PreviousExamsCard } from "@/components/dashboard/previous-exams-card";
import { SubjectiveModelTestsCard } from "@/components/dashboard/subjective-model-tests-card";
import { ResultsTable } from "@/components/dashboard/results-table";
import { BooksSection } from "@/components/dashboard/books-section";
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

type DashboardViewProps = {
  data: DashboardMock;
  onMenuClick?: () => void;
};

function DashboardContent({ data }: DashboardViewProps) {
  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} data={stat} />
        ))}
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="order-2 min-w-0 lg:order-none">
          <PersonalGrowthCard />
        </div>
        <div className="order-3 min-w-0 lg:order-none">
          <StudyPlanSection />
        </div>
        <div className="order-1 min-w-0 lg:order-none">
          <LiveExamsCard />
        </div>
        <div className="order-4 min-w-0 lg:order-none">
          <PreviousExamsCard />
        </div>
        <div className="order-5 min-w-0 lg:order-none">
          <UpcomingExamsCard />
        </div>
        <div className="order-6 min-w-0 lg:order-none">
          <SubjectiveModelTestsCard />
        </div>
      </div>

      <ResultsTable rows={data.recentResults} />

      <BooksSection />

      <YoutubeSection />
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
