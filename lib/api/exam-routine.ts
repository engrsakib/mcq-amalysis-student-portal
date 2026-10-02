import { apiGetAuth } from "@/lib/api/authorized";
import type { UserExamRoutinePayload } from "@/lib/api/types";

export type GetUserExamRoutinesParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export function getUserExamRoutines(params: GetUserExamRoutinesParams = {}) {
  const { page = 1, limit = 5, searchTerm = "" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    searchTerm: searchTerm.trim(),
  });
  return apiGetAuth<UserExamRoutinePayload>(
    `/exam-routine/user?${query.toString()}`
  );
}
