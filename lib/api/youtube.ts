import { apiGetAuth } from "@/lib/api/authorized";
import type { UserYoutubePayload } from "@/lib/api/types";

export type GetUserYoutubeVideosParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export function getUserYoutubeVideos(params: GetUserYoutubeVideosParams = {}) {
  const { page = 1, limit = 5, searchTerm = "" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    searchTerm: searchTerm.trim(),
  });
  return apiGetAuth<UserYoutubePayload>(`/youtube/user?${query.toString()}`);
}
