"use client";

import {
  CalendarDays,
  CircleHelp,
  Clock,
  Layers,
  Star,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useExamBriefing } from "@/hooks/use-exam-briefing";
import {
  getBriefingPrimaryLabel,
  getExamModeLabel,
  getQuestionCount,
} from "@/lib/exam/briefing-mode";
import { EXAM_BRIEFING_RULES } from "@/lib/exam/exam-rules";
import { formatExamNumber } from "@/lib/exam/format-exam-number";
import { formatExamDateShort } from "@/lib/datetime/format-exam";
import { cn } from "@/lib/utils";

const CLOSE_MS = 280;

function BriefingMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5 shrink-0 text-primary/80" aria-hidden />
        <span className="truncate">{label}</span>
      </div>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export function ExamBriefingModal() {
  const { briefing, closeBriefing } = useExamBriefing();
  const rulesId = useId();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const open = briefing != null;

  useEffect(() => {
    if (open) {
      setRulesAccepted(false);
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [open, briefing?.exam._id]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeBriefing();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mounted, closeBriefing]);

  if (!mounted || !briefing) return null;

  const { exam, source } = briefing;
  const primaryLabel = getBriefingPrimaryLabel(source);
  const scheduled = formatExamDateShort(exam.exam_date_time);

  function handleStart() {
    closeBriefing();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal
      aria-labelledby="exam-briefing-title"
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0"
        )}
        aria-label="Close exam briefing"
        onClick={closeBriefing}
      />
      <div
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl",
          "transition-all duration-300 ease-out motion-reduce:transition-none sm:max-w-md sm:rounded-2xl",
          visible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-6 opacity-0 sm:translate-y-0 sm:scale-[0.98]"
        )}
      >
        <div className="overflow-y-auto overscroll-contain px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              Exam briefing
            </span>
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary-soft hover:text-ink"
              aria-label="Close"
              onClick={closeBriefing}
            >
              <X className="size-5" />
            </button>
          </div>

          <h2
            id="exam-briefing-title"
            className="mt-4 text-lg font-semibold leading-snug text-ink sm:text-xl"
          >
            {exam.exam_name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatExamNumber(exam.exam_number)} · {exam.subject}
          </p>

          <div className="mt-5 rounded-xl bg-primary-soft/60 p-4">
            <div className="grid grid-cols-3 gap-4">
              <BriefingMetric
                icon={Star}
                label="Total marks"
                value={String(exam.total_marks)}
              />
              <BriefingMetric
                icon={CircleHelp}
                label="Questions"
                value={String(getQuestionCount(exam))}
              />
              <BriefingMetric
                icon={Clock}
                label="Duration"
                value={`${exam.duration_minutes} min`}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line/60 pt-4">
              <BriefingMetric
                icon={Layers}
                label="Exam mode"
                value={getExamModeLabel(exam, source)}
              />
              <BriefingMetric
                icon={CalendarDays}
                label="Scheduled"
                value={scheduled}
              />
            </div>
          </div>

          <h3 className="mt-6 text-base font-semibold text-ink">Exam Rules</h3>
          <ul className="mt-3 space-y-2.5" id={rulesId}>
            {EXAM_BRIEFING_RULES.map((rule) => (
              <li
                key={rule}
                className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-2.5">
            <Checkbox
              id="exam-rules-accept"
              checked={rulesAccepted}
              onCheckedChange={(v) => setRulesAccepted(v === true)}
              aria-describedby={rulesId}
            />
            <Label
              htmlFor="exam-rules-accept"
              className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground"
            >
              I have read and understand the exam rules.
            </Label>
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 min-h-11 flex-1 rounded-[10px] text-sm font-medium"
              onClick={closeBriefing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!rulesAccepted}
              className="h-11 min-h-11 flex-1 rounded-[10px] bg-primary text-sm font-medium hover:bg-primary-hover disabled:opacity-40"
              onClick={handleStart}
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
