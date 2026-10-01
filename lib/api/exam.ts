import { apiGetAuth } from "@/lib/api/authorized";
import type { UpcomingExamsPayload } from "@/lib/api/types";

export type GetUpcomingExamsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export function getUpcomingExams(params: GetUpcomingExamsParams = {}) {
  const { page = 1, limit = 10, searchTerm } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (searchTerm?.trim()) {
    query.set("searchTerm", searchTerm.trim());
  }
  return apiGetAuth<UpcomingExamsPayload>(`/exam/upcoming?${query.toString()}`);
}
