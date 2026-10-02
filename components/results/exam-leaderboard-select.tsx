"use client";

import { Label } from "@/components/ui/label";
import type { ResultsExamOption } from "@/hooks/use-results-exam-options";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "h-11 w-full min-w-0 appearance-none rounded-lg border border-input bg-card bg-[length:1rem] bg-[position:right_0.5rem_center] bg-no-repeat py-1 pl-2.5 pr-9 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%235c6b66%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]"
);

type ExamLeaderboardSelectProps = {
  options: ResultsExamOption[];
  value: number | null;
  onChange: (examNumber: number | null) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function ExamLeaderboardSelect({
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  className,
}: ExamLeaderboardSelectProps) {
  const isDisabled = disabled || loading;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor="results-exam-select">Exam</Label>
      <select
        id="results-exam-select"
        className={selectClassName}
        value={value ?? ""}
        disabled={isDisabled}
        onChange={(e) => {
          const next = e.target.value;
          onChange(next === "" ? null : Number(next));
        }}
      >
        <option value="">
          {loading ? "Loading exams…" : "Select an exam"}
        </option>
        {options.map((opt) => (
          <option key={opt.examNumber} value={opt.examNumber}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
