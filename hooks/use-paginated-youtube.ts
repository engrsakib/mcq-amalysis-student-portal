"use client";

import { useCallback } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserYoutubeVideos } from "@/lib/api/youtube";
import { YOUTUBE_CATALOG_LIMIT } from "@/lib/catalog/page-sizes";
import { usePaginatedCatalog } from "@/hooks/use-paginated-catalog";

export function usePaginatedYoutube(enabled: boolean) {
  const fetchPage = useCallback(async (page: number, searchTerm: string) => {
    try {
      const payload = await getUserYoutubeVideos({
        page,
        limit: YOUTUBE_CATALOG_LIMIT,
        searchTerm,
      });
      const data = payload.data.filter((v) => v.is_published !== false);
      return { data, meta: payload.meta };
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.errorMessages?.[0]?.message || err.message);
      }
      throw new Error("Could not load videos.");
    }
  }, []);

  return usePaginatedCatalog({
    enabled,
    fetchPage,
    errorMessage: "Could not load videos.",
  });
}
