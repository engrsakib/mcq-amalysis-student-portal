"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExamQuestionCard } from "@/components/exam/exam-question-card";
import { ExamStickyFooter } from "@/components/exam/exam-sticky-footer";
import { formatExamNumber } from "@/lib/exam/format-exam-number";
import { shuffleExamQuestions } from "@/lib/exam/shuffle-questions";
import type { ExamSessionPayload } from "@/lib/api/types";

type ExamSessionViewProps = ExamSessionPayload;

export function ExamSessionView({
  exam,
  questions,
  isPracticeSession,
}: ExamSessionViewProps) {
  const [orderedQuestions, setOrderedQuestions] = useState(questions);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    setOrderedQuestions(shuffleExamQuestions(questions));
  }, [questions]);

  const timerEnabled = !isPracticeSession;

  const handleSelect = useCallback(
    (questionId: number, optionIndex: number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    // Submit API wired in a follow-up
  }, []);

  const totalQuestions = orderedQuestions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <div className="mx-auto w-full min-w-0 max-w-3xl pb-28">
        <header className="space-y-2 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {isPracticeSession || exam.is_practice_mode ? (
              <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                Practice
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {formatExamNumber(exam.exam_number)} · {exam.subject}
            </span>
          </div>
          <h1 className="text-lg font-semibold leading-snug text-ink sm:text-xl">
            {exam.exam_name}
          </h1>
        </header>

        <div className="space-y-4">
          {orderedQuestions.map((question, index) => (
            <ExamQuestionCard
              key={question.questionId}
              index={index}
              question={question}
              selectedOption={answers[question.questionId] ?? null}
              onSelectOption={(optionIndex) =>
                handleSelect(question.questionId, optionIndex)
              }
            />
          ))}
        </div>
      </div>

      <ExamStickyFooter
        examDateTime={exam.exam_date_time}
        durationMinutes={exam.duration_minutes}
        timerEnabled={timerEnabled}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        onSubmit={handleSubmit}
      />
    </>
  );
}
