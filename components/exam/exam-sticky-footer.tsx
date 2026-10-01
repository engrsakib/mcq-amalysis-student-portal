"use client";

import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/exam/exam-timer";

type ExamStickyFooterProps = {
  examDateTime: string;
  durationMinutes: number;
  timerEnabled: boolean;
  onSubmit: () => void;
};

export function ExamStickyFooter({
  examDateTime,
  durationMinutes,
  timerEnabled,
  onSubmit,
}: ExamStickyFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-line/60 bg-card/95 px-4 py-3 backdrop-blur-sm lg:left-[240px] sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <ExamTimer
          examDateTime={examDateTime}
          durationMinutes={durationMinutes}
          enabled={timerEnabled}
        />
        <Button
          type="button"
          className="h-11 min-h-11 shrink-0 rounded-[10px] bg-primary px-6 hover:bg-primary-hover"
          onClick={onSubmit}
        >
          Submit exam
        </Button>
      </div>
    </footer>
  );
}
