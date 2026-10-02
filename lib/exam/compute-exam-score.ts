import type {
  ExamQuestionGrading,
  ExamQuestionPublic,
} from "@/lib/api/types";

export type ExamScoreStats = {
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  score: number;
};

type ComputeScoreInput = {
  questions: ExamQuestionPublic[];
  answers: Record<number, number>;
  gradingByQuestionId: Record<number, ExamQuestionGrading>;
  negativeMark: number;
  totalMarks: number;
};

export function computeExamScore(input: ComputeScoreInput): ExamScoreStats {
  const { questions, answers, gradingByQuestionId, negativeMark, totalMarks } =
    input;

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unanswered = 0;
  let earned = 0;

  for (const q of questions) {
    const grading = gradingByQuestionId[q.questionId];
    const selected = answers[q.questionId];

    if (selected === undefined) {
      unanswered += 1;
      continue;
    }

    const correctIndex = parseCorrectOptionIndex(grading?.correctAnswer);
    if (correctIndex === null) {
      unanswered += 1;
      continue;
    }

    if (selected === correctIndex) {
      correctAnswers += 1;
      earned += grading?.marks ?? q.marks ?? 0;
    } else {
      wrongAnswers += 1;
      earned -= negativeMark;
    }
  }

  const maxEarned = totalMarks > 0 ? totalMarks : earned;
  const score = Math.max(0, Math.min(earned, maxEarned));

  return { correctAnswers, wrongAnswers, unanswered, score };
}

/** API `correctAnswer` is 1-based option index (e.g. `"3"` → index 2). */
export function parseCorrectOptionIndex(
  correctAnswer: string | undefined
): number | null {
  if (correctAnswer === undefined || correctAnswer === "") return null;
  const n = Number.parseInt(correctAnswer.trim(), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n - 1;
}
