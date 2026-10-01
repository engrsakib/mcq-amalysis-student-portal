import type { ExamQuestionPublic } from "@/lib/api/types";

export function shuffleQuestions<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function shuffleExamQuestions(
  questions: ExamQuestionPublic[]
): ExamQuestionPublic[] {
  return shuffleQuestions(questions);
}
