import { apiGetAuth } from "@/lib/api/authorized";
import type { UserYoutubePayload } from "@/lib/api/types";

export type GetUserYoutubeVideosParams = {
  page?: number;
  limit?: number;
};

export function getUserYoutubeVideos(params: GetUserYoutubeVideosParams = {}) {
  const { page = 1, limit = 5 } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return apiGetAuth<UserYoutubePayload>(`/youtube/user?${query.toString()}`);
}
