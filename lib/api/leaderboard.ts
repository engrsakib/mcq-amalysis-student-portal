import { apiGetAuth } from "@/lib/api/authorized";
import type {
  ExamLeaderboardPayload,
  LeaderboardMetaRaw,
  PaginatedMeta,
} from "@/lib/api/types";

export type GetExamLeaderboardParams = {
  page?: number;
  limit?: number;
};

function normalizeLeaderboardMeta(raw: LeaderboardMetaRaw): PaginatedMeta {
  return {
    page: raw.page,
    limit: raw.limit,
    total: raw.total,
    totalPage: raw.totalPage ?? raw.totalPages ?? 1,
  };
};

type ExamLeaderboardApiPayload = {
  meta: LeaderboardMetaRaw;
  current_user: ExamLeaderboardPayload["current_user"];
  data: ExamLeaderboardPayload["data"];
};

export async function getExamLeaderboard(
  examNumber: number,
  params: GetExamLeaderboardParams = {}
): Promise<ExamLeaderboardPayload> {
  const { page = 1, limit = 10 } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const payload = await apiGetAuth<ExamLeaderboardApiPayload>(
    `/results/${examNumber}/leaderboard?${query.toString()}`
  );

  return {
    meta: normalizeLeaderboardMeta(payload.meta),
    current_user: payload.current_user ?? null,
    data: payload.data,
  };
}
