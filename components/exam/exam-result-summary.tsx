"use client";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubmitExamResultResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type ExamResultSummaryProps = {
  examName: string;
  result: SubmitExamResultResponse;
  apiMessage?: string;
  onReviewClick: () => void;
};

export function ExamResultSummary({
  examName,
  result,
  apiMessage,
  onReviewClick,
}: ExamResultSummaryProps) {
  const pct =
    result.total_score > 0
      ? Math.round((result.score / result.total_score) * 100)
      : 0;

  return (
    <section className="rounded-2xl border border-line/80 bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Exam submitted
      </p>
      <h2 className="mt-1 text-xl font-semibold leading-snug text-ink">
        {examName}
      </h2>
      {apiMessage ? (
        <p className="mt-2 text-sm text-muted-foreground">{apiMessage}</p>
      ) : null}

      <div className="mt-5 flex flex-col items-center rounded-xl bg-primary-soft/50 py-6">
        <p className="text-sm font-medium text-muted-foreground">Your score</p>
        <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-ink">
          {result.score}
          <span className="text-lg font-semibold text-muted-foreground">
            {" "}
            / {result.total_score}
          </span>
        </p>
        <p className="mt-1 text-sm font-medium text-primary">{pct}%</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <StatBox label="Correct" value={result.correctAnswers} tone="success" />
        <StatBox label="Wrong" value={result.wrongAnswers} tone="danger" />
        <StatBox label="Skipped" value={result.unanswered} tone="muted" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {result.is_cheated ? (
          <Badge icon={AlertTriangle} tone="danger">
            Proctoring flag
          </Badge>
        ) : (
          <Badge icon={CheckCircle2} tone="success">
            No cheat flag
          </Badge>
        )}
        {result.is_on_time ? (
          <Badge icon={Clock} tone="success">
            On time
          </Badge>
        ) : (
          <Badge icon={Clock} tone="danger">
            Late submit
          </Badge>
        )}
      </div>

      <Button
        type="button"
        className="mt-5 w-full rounded-[10px] bg-primary hover:bg-primary-hover"
        onClick={onReviewClick}
        data-pdf-export-ignore
      >
        Review answers
      </Button>
    </section>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "muted";
}) {
  return (
    <div className="rounded-lg border border-line/60 bg-page/40 px-2 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-lg font-semibold tabular-nums",
          tone === "success" && "text-emerald-700",
          tone === "danger" && "text-destructive",
          tone === "muted" && "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({
  icon: Icon,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "danger";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
        tone === "success" && "bg-emerald-50 text-emerald-800",
        tone === "danger" && "bg-destructive/10 text-destructive"
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}
