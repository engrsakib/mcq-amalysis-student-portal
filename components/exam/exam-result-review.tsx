"use client";

import { MathContent } from "@/components/exam/math-content";
import { parseCorrectOptionIndex } from "@/lib/exam/compute-exam-score";
import type {
  ExamQuestionGrading,
  ExamQuestionPublic,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

type ExamResultReviewProps = {
  questions: ExamQuestionPublic[];
  answers: Record<number, number>;
  gradingByQuestionId: Record<number, ExamQuestionGrading>;
};

export function ExamResultReview({
  questions,
  answers,
  gradingByQuestionId,
}: ExamResultReviewProps) {
  return (
    <section id="exam-result-review" className="mt-6 space-y-4 pb-8">
      <h2 className="text-lg font-semibold text-ink">Answer review</h2>
      {questions.map((question, index) => {
        const grading = gradingByQuestionId[question.questionId];
        const correctIndex = parseCorrectOptionIndex(grading?.correctAnswer);
        const selected = answers[question.questionId];

        let status: "correct" | "wrong" | "skipped" = "skipped";
        if (selected !== undefined && correctIndex !== null) {
          status = selected === correctIndex ? "correct" : "wrong";
        }

        return (
          <article
            key={question.questionId}
            className="rounded-xl border border-line/80 bg-card p-4 shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                Q{index + 1}
              </span>
              <StatusPill status={status} />
            </div>

            {question.title ? (
              <p className="text-base font-medium leading-relaxed text-ink">
                {question.title}
              </p>
            ) : null}
            {question.mathFormula ? (
              <div className="mt-2 min-w-0">
                <MathContent content={question.mathFormula} />
              </div>
            ) : null}

            <ul className="mt-3 space-y-2">
              {question.options.map((option, optionIndex) => {
                const label = String.fromCharCode(65 + optionIndex);
                const isCorrect = correctIndex === optionIndex;
                const isSelected = selected === optionIndex;

                return (
                  <li
                    key={`${question.questionId}-${optionIndex}`}
                    className={cn(
                      "flex gap-3 rounded-lg border px-3 py-2.5 text-sm",
                      isCorrect &&
                        "border-emerald-500/50 bg-emerald-50/80 text-ink",
                      isSelected &&
                        !isCorrect &&
                        "border-destructive/40 bg-destructive/5 text-ink",
                      !isCorrect &&
                        !isSelected &&
                        "border-line/60 bg-page/30 text-ink"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        isCorrect
                          ? "bg-emerald-600 text-white"
                          : isSelected
                            ? "bg-destructive text-white"
                            : "bg-primary-soft text-primary"
                      )}
                    >
                      {label}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">
                      <MathContent content={option} />
                    </span>
                    {isCorrect ? (
                      <span className="shrink-0 text-xs font-medium text-emerald-700">
                        Correct
                      </span>
                    ) : null}
                    {isSelected && !isCorrect ? (
                      <span className="shrink-0 text-xs font-medium text-destructive">
                        Your pick
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
    </section>
  );
}

function StatusPill({
  status,
}: {
  status: "correct" | "wrong" | "skipped";
}) {
  const label =
    status === "correct"
      ? "Correct"
      : status === "wrong"
        ? "Incorrect"
        : "Not answered";

  return (
    <span
      className={cn(
        "rounded-lg px-2 py-0.5 text-xs font-semibold",
        status === "correct" && "bg-emerald-100 text-emerald-800",
        status === "wrong" && "bg-destructive/10 text-destructive",
        status === "skipped" && "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </span>
  );
}
