"use client";

import { Radio } from "lucide-react";

export function LiveExamsEmptyState() {
  return (
    <div
      className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-b from-primary-soft/70 via-primary-soft/25 to-card px-5 py-8 text-center shadow-sm"
      role="status"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/[0.06]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full bg-primary/[0.05]"
        aria-hidden
      />

      <div className="relative mb-4 flex size-[3.25rem] items-center justify-center rounded-2xl border border-line/80 bg-card shadow-sm">
        <span
          className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/10"
          aria-hidden
        />
        <Radio className="size-7 text-primary/80" strokeWidth={1.75} aria-hidden />
      </div>

      <p className="relative text-base font-semibold tracking-tight text-ink">
        Nothing live right now
      </p>
      <p className="relative mt-2 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
        When a live exam starts, it will appear here. Check Upcoming for scheduled
        sessions in the meantime.
      </p>
    </div>
  );
}
