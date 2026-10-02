import { apiGetAuth } from "@/lib/api/authorized";
import type { UserExamSolutionPayload } from "@/lib/api/types";

export type GetUserExamSolutionsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export function getUserExamSolutions(params: GetUserExamSolutionsParams = {}) {
  const { page = 1, limit = 20, searchTerm = "" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    searchTerm: searchTerm.trim(),
  });
  return apiGetAuth<UserExamSolutionPayload>(
    `/exam-solution/user?${query.toString()}`
  );
}
