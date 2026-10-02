import { apiGetAuth } from "@/lib/api/authorized";
import type { UserBooksPayload } from "@/lib/api/types";

export type GetUserBooksParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export function getUserBooks(params: GetUserBooksParams = {}) {
  const { page = 1, limit = 5, searchTerm = "" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    searchTerm: searchTerm.trim(),
  });
  return apiGetAuth<UserBooksPayload>(`/books/user?${query.toString()}`);
}
