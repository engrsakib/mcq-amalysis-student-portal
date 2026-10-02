"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ExamsCatalogSection } from "@/components/exam/exams-catalog-section";
import { ExamsLiveSection } from "@/components/exam/exams-live-section";
import { ExamBriefingProvider } from "@/hooks/use-exam-briefing";
import { LiveExamsProvider } from "@/hooks/use-live-exams";

const ExamBriefingModal = dynamic(
  () =>
    import("@/components/dashboard/exam-briefing-modal").then(
      (mod) => mod.ExamBriefingModal
    ),
  { ssr: false }
);

function CatalogFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="min-h-[220px] animate-pulse rounded-xl bg-primary-soft/40"
          aria-hidden
        />
      ))}
    </div>
  );
}

export function ExamsView() {
  return (
    <ExamBriefingProvider>
      <LiveExamsProvider>
        <div className="w-full min-w-0 space-y-8">
          <ExamsLiveSection />
          <Suspense fallback={<CatalogFallback />}>
            <ExamsCatalogSection />
          </Suspense>
        </div>
        <ExamBriefingModal />
      </LiveExamsProvider>
    </ExamBriefingProvider>
  );
}
