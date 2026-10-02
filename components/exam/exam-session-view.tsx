"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/components/dashboard/user-profile-provider";
import { ExamProctoringModal } from "@/components/exam/exam-proctoring-modal";
import { ExamQuestionCard } from "@/components/exam/exam-question-card";
import { ExamResultReview } from "@/components/exam/exam-result-review";
import { ExamResultSummary } from "@/components/exam/exam-result-summary";
import { ExamStickyFooter } from "@/components/exam/exam-sticky-footer";
import { ExamSubmitConfirmModal } from "@/components/exam/exam-submit-confirm-modal";
import { useExamProctoring } from "@/hooks/use-exam-proctoring";
import { ApiError } from "@/lib/api/client";
import { submitExamResult } from "@/lib/api/results";
import type { ExamSessionPayload, SubmitExamResultResponse } from "@/lib/api/types";
import { computeExamScore } from "@/lib/exam/compute-exam-score";
import { getExamEndMs, isOnTime } from "@/lib/exam/exam-timing";
import { formatExamNumber } from "@/lib/exam/format-exam-number";
import { isCheatedFromEvents } from "@/lib/exam/proctoring-cheat";
import {
  clearProctoringEvents,
  clearSessionStartedAt,
  getOrCreateSessionStartedAt,
  getProctoringEvents,
} from "@/lib/exam/proctoring-storage";
import {
  downloadExamResultPdf,
  examResultPdfFileName,
} from "@/lib/exam/download-exam-result-pdf";
import { shuffleExamQuestions } from "@/lib/exam/shuffle-questions";

type ExamSessionViewProps = ExamSessionPayload;

type SessionPhase = "exam" | "submitting" | "results";

export function ExamSessionView({
  exam,
  questions,
  gradingByQuestionId,
  isPracticeSession,
}: ExamSessionViewProps) {
  const router = useRouter();
  const { profile, loading: profileLoading } = useUserProfile();
  const [orderedQuestions, setOrderedQuestions] = useState(questions);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<SessionPhase>("exam");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitExamResultResponse | null>(null);

  const sessionStartedAtRef = useRef<string>("");
  const submittingRef = useRef(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    setOrderedQuestions(shuffleExamQuestions(questions));
  }, [questions]);

  useEffect(() => {
    sessionStartedAtRef.current = getOrCreateSessionStartedAt(exam.exam_number);
  }, [exam.exam_number]);

  const timerEnabled = !isPracticeSession;
  const proctoringEnabled = true;

  const proctoring = useExamProctoring({
    examNumber: exam.exam_number,
    enabled: proctoringEnabled && phase === "exam",
  });

  const handleSelect = useCallback(
    (questionId: number, optionIndex: number) => {
      if (phase !== "exam") return;
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    },
    [phase]
  );

  const totalQuestions = orderedQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  const performSubmit = useCallback(async () => {
    if (submittingRef.current || phase !== "exam") return;

    if (profileLoading) {
      setSubmitError("Loading your profile. Please try again in a moment.");
      return;
    }

    if (!profile?.name?.trim() || !profile?.phone_number?.trim()) {
      setSubmitError("Your name and phone are required to submit. Update profile in Settings.");
      return;
    }

    submittingRef.current = true;
    setSubmitError(null);
    setPhase("submitting");

    const clientSubmittedAt = new Date().toISOString();
    const proctoringEvents = getProctoringEvents(exam.exam_number);
    const stats = computeExamScore({
      questions: orderedQuestions,
      answers,
      gradingByQuestionId,
      negativeMark: exam.negative_mark ?? 0,
      totalMarks: exam.total_marks,
    });

    const payload = {
      clientSubmittedAt,
      correctAnswers: stats.correctAnswers,
      exam_number: exam.exam_number,
      is_cheated: isCheatedFromEvents(proctoringEvents),
      is_on_time: timerEnabled
        ? isOnTime(
            clientSubmittedAt,
            getExamEndMs(exam.exam_date_time, exam.duration_minutes)
          )
        : true,
      proctoringEvents,
      score: stats.score,
      sessionStartedAt: sessionStartedAtRef.current,
      student_name: profile.name.trim(),
      student_phone: profile.phone_number.trim(),
      totalQuestions,
      total_score: exam.total_marks,
      unanswered: stats.unanswered,
      writtenExam: [] as unknown[],
      wrongAnswers: stats.wrongAnswers,
    };

    try {
      const data = await submitExamResult(payload);
      clearProctoringEvents(exam.exam_number);
      clearSessionStartedAt(exam.exam_number);
      setResult(data);
      setSubmitMessage("Results submitted successfully.");
      setSubmitModalOpen(false);
      setPhase("results");
    } catch (err) {
      submittingRef.current = false;
      setPhase("exam");
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Could not submit your exam. Please try again."
      );
    }
  }, [
    phase,
    profileLoading,
    profile,
    exam,
    orderedQuestions,
    answers,
    gradingByQuestionId,
    timerEnabled,
    totalQuestions,
  ]);

  const handleSubmitClick = useCallback(() => {
    if (phase !== "exam") return;
    setSubmitError(null);
    setSubmitModalOpen(true);
  }, [phase]);

  const handleCancelSubmit = useCallback(() => {
    if (phase === "submitting") return;
    setSubmitModalOpen(false);
    setSubmitError(null);
  }, [phase]);

  const scrollToReview = useCallback(() => {
    document
      .getElementById("exam-result-review")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    const root = exportRef.current;
    if (!root || pdfBusy) return;

    setPdfError(null);
    setPdfBusy(true);
    try {
      await downloadExamResultPdf(
        root,
        examResultPdfFileName(exam.exam_number)
      );
    } catch (err) {
      setPdfError(
        err instanceof Error ? err.message : "Could not create PDF. Try again."
      );
    } finally {
      setPdfBusy(false);
    }
  }, [exam.exam_number, pdfBusy]);

  const readOnly = phase !== "exam";

  return (
    <>
      <ExamProctoringModal
        modal={proctoring.modal}
        visible={proctoring.modalVisible}
        awayThresholdMs={proctoring.awayThresholdMs}
        onStay={proctoring.handleStay}
        onConfirmLeave={proctoring.handleConfirmLeave}
        onDismissReturn={proctoring.closeReturnWarning}
      />

      <ExamSubmitConfirmModal
        open={submitModalOpen}
        unansweredCount={unansweredCount}
        submitting={phase === "submitting"}
        errorMessage={submitError}
        onConfirm={performSubmit}
        onCancel={handleCancelSubmit}
      />

      <div className="mx-auto w-full min-w-0 max-w-3xl pb-28">
        {phase === "results" && result ? (
          <>
            <div id="exam-result-export" ref={exportRef}>
              <ExamResultSummary
                examName={exam.exam_name}
                result={result}
                apiMessage={submitMessage ?? undefined}
                onReviewClick={scrollToReview}
              />
              <ExamResultReview
                questions={orderedQuestions}
                answers={answers}
                gradingByQuestionId={gradingByQuestionId}
                onDownloadPdf={handleDownloadPdf}
                downloadBusy={pdfBusy}
                downloadError={pdfError}
              />
            </div>
            <div className="mt-6 pb-8">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm font-medium text-primary hover:underline"
                data-html2canvas-ignore
              >
                Back to dashboard
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="space-y-2 pb-4">
              <button
                type="button"
                onClick={proctoring.handleDashboardLeaveClick}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Dashboard
              </button>
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
                  readOnly={readOnly}
                  onSelectOption={(optionIndex) =>
                    handleSelect(question.questionId, optionIndex)
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      {phase === "exam" ? (
        <ExamStickyFooter
          examDateTime={exam.exam_date_time}
          durationMinutes={exam.duration_minutes}
          timerEnabled={timerEnabled}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          onSubmit={handleSubmitClick}
        />
      ) : null}
    </>
  );
}
