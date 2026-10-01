"use client";

import { useEffect, useState } from "react";

type ExamTimerProps = {
  examDateTime: string;
  durationMinutes: number;
  enabled: boolean;
};

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExamTimer({
  examDateTime,
  durationMinutes,
  enabled,
}: ExamTimerProps) {
  const endAt =
    new Date(examDateTime).getTime() + durationMinutes * 60 * 1000;

  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      setRemainingMs(Math.max(0, endAt - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [enabled, endAt]);

  if (!enabled) {
    return (
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Mode
        </p>
        <p className="text-sm font-semibold text-primary">Practice</p>
      </div>
    );
  }

  const timesUp = remainingMs !== null && remainingMs <= 0;

  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Time left
      </p>
      <p
        className={
          timesUp
            ? "text-sm font-semibold text-danger"
            : "font-mono text-lg font-semibold tabular-nums text-ink"
        }
      >
        {remainingMs === null
          ? "--:--"
          : timesUp
            ? "Time's up"
            : formatRemaining(remainingMs)}
      </p>
    </div>
  );
}
