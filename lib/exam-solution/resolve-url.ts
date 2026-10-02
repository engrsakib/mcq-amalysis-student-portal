import type { UserExamSolutionEntry } from "@/lib/api/types";

export function resolveExamSolutionUrl(entry: UserExamSolutionEntry): string {
  return (
    entry.exam_solution_url?.trim() ||
    entry.solution_url?.trim() ||
    ""
  );
}
