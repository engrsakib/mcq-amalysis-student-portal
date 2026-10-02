import { apiGetAuth } from "@/lib/api/authorized";
import type { GlobalSearchPayload } from "@/lib/api/types";

export type GetGlobalSearchParams = {
  page?: number;
  limit?: number;
};

export async function getGlobalSearch(
  q: string,
  params: GetGlobalSearchParams = {}
): Promise<GlobalSearchPayload> {
  const trimmed = q.trim();
  if (!trimmed) {
    throw new Error("Search query is required.");
  }

  const { page = 1, limit = 10 } = params;
  const query = new URLSearchParams({
    q: trimmed,
    page: String(page),
    limit: String(limit),
  });

  return apiGetAuth<GlobalSearchPayload>(`/search?${query.toString()}`);
}
