"use client";

import { MathContent } from "@/components/exam/math-content";
import type { ExamQuestionPublic } from "@/lib/api/types";
import { optionNeedsMultilineLayout } from "@/lib/exam/option-layout";
import { cn } from "@/lib/utils";

type ExamQuestionCardProps = {
  index: number;
  question: ExamQuestionPublic;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
};

export function ExamQuestionCard({
  index,
  question,
  selectedOption,
  onSelectOption,
}: ExamQuestionCardProps) {
  const title = question.title?.trim();
  const formula = question.mathFormula?.trim();

  return (
    <article className="min-w-0 rounded-xl border border-line/80 bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span className="rounded-lg bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
          Q{index + 1}
        </span>
        <span className="text-xs text-muted-foreground">
          {question.marks} mark{question.marks === 1 ? "" : "s"}
        </span>
      </div>

      {title ? (
        <p className="text-base font-medium leading-relaxed text-ink">{title}</p>
      ) : null}

      {formula ? (
        <div className="mt-2 min-w-0">
          <MathContent content={formula} displayMode />
        </div>
      ) : null}

      {question.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.image_url}
          alt=""
          className="mt-3 max-h-48 w-full rounded-lg object-contain"
        />
      ) : null}

      <ul className="mt-4 space-y-2">
        {question.options.map((option, optionIndex) => {
          const selected = selectedOption === optionIndex;
          const label = String.fromCharCode(65 + optionIndex);
          const multiline = optionNeedsMultilineLayout(option);

          return (
            <li key={`${question.questionId}-${optionIndex}`}>
              <button
                type="button"
                onClick={() => onSelectOption(optionIndex)}
                aria-label={`Option ${label}`}
                className={cn(
                  "flex w-full min-w-0 rounded-lg border px-3 text-left text-base transition-colors",
                  multiline
                    ? "min-h-14 items-start gap-3 py-3"
                    : "items-center gap-3 py-2.5",
                  selected
                    ? "border-primary bg-primary-soft/50 text-ink"
                    : "border-line/80 bg-page/40 text-ink hover:border-primary/30 hover:bg-primary-soft/20"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    multiline && "mt-0.5",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary-soft text-primary"
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1",
                    multiline ? "leading-relaxed" : "leading-snug"
                  )}
                >
                  <MathContent content={option} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
