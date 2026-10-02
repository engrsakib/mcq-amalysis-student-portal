import type {
  ExamEntry,
  ExamQuestion,
  ExamQuestionGrading,
  ExamQuestionPublic,
  ExamSessionMeta,
  ExamSessionPayload,
} from "@/lib/api/types";

export function sanitizeExamQuestion(q: ExamQuestion): ExamQuestionPublic {
  const options =
    q.answer?.options?.length ? q.answer.options : q.options ?? [];

  return {
    _id: q._id,
    questionId: q.questionId,
    title: q.title,
    type: q.type,
    answerType: q.answerType,
    marks: q.marks,
    image_url: q.image_url,
    mathFormula: q.mathFormula,
    options,
  };
}

export function isPracticeSession(exam: Pick<ExamEntry, "is_started" | "is_completed">) {
  return exam.is_started === true && exam.is_completed === true;
}

export function buildGradingKeyMap(
  questions: ExamQuestion[]
): Record<number, ExamQuestionGrading> {
  const map: Record<number, ExamQuestionGrading> = {};
  for (const q of questions) {
    const correct = q.answer?.correctAnswer;
    if (correct === undefined || correct === "") continue;
    map[q.questionId] = {
      correctAnswer: String(correct),
      marks: q.marks,
    };
  }
  return map;
}

export function toExamSessionPayload(entry: ExamEntry): ExamSessionPayload {
  const exam: ExamSessionMeta = {
    _id: entry._id,
    exam_number: entry.exam_number,
    exam_name: entry.exam_name,
    subject: entry.subject,
    exam_date_time: entry.exam_date_time,
    duration_minutes: entry.duration_minutes,
    total_marks: entry.total_marks,
    is_started: entry.is_started,
    is_completed: entry.is_completed,
    is_practice_mode: entry.is_practice_mode,
    negative_mark: entry.negative_mark,
  };

  const rawQuestions = entry.questions ?? [];

  return {
    exam,
    questions: rawQuestions.map(sanitizeExamQuestion),
    gradingByQuestionId: buildGradingKeyMap(rawQuestions),
    isPracticeSession: isPracticeSession(entry),
  };
}
