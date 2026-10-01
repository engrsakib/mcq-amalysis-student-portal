import { apiGetAuth } from "@/lib/api/authorized";
import type { UpcomingExamsPayload, UserExamsPayload } from "@/lib/api/types";

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

export type GetUserExamsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isLive?: boolean;
};

export function getUserExams(params: GetUserExamsParams = {}) {
  const { page = 1, limit = 10, searchTerm, isLive } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (searchTerm?.trim()) {
    query.set("searchTerm", searchTerm.trim());
  }
  if (isLive === true) {
    query.set("isLive", "true");
  }
  return apiGetAuth<UserExamsPayload>(`/exam/user?${query.toString()}`);
}
