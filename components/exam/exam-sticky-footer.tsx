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
    <footer className="z-10 shrink-0 border-t border-line/60 bg-card/95 px-4 py-3 backdrop-blur-sm sm:px-0">
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
