"use client";

import { ExamBriefingModal } from "@/components/dashboard/exam-briefing-modal";
import { LiveExamsCard } from "@/components/dashboard/live-exams-card";
import { PreviousExamsCard } from "@/components/dashboard/previous-exams-card";
import { SubjectiveModelTestsCard } from "@/components/dashboard/subjective-model-tests-card";
import { UpcomingExamsCard } from "@/components/dashboard/upcoming-exams-card";
import { ExamBriefingProvider } from "@/hooks/use-exam-briefing";
import { LiveExamsProvider } from "@/hooks/use-live-exams";
import { PreviousExamsProvider } from "@/hooks/use-previous-exams";
import { SubjectiveModelTestsProvider } from "@/hooks/use-subjective-model-tests";
export function ExamsView() {
  return (
    <ExamBriefingProvider>
      <PreviousExamsProvider>
        <SubjectiveModelTestsProvider>
          <LiveExamsProvider>
            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
              <LiveExamsCard />
              <PreviousExamsCard />
              <UpcomingExamsCard />
              <SubjectiveModelTestsCard />
            </div>
            <ExamBriefingModal />
          </LiveExamsProvider>
        </SubjectiveModelTestsProvider>
      </PreviousExamsProvider>
    </ExamBriefingProvider>
  );
}
