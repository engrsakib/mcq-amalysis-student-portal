"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserYoutubeVideos } from "@/lib/api/youtube";
import type { UserYoutubeEntry } from "@/lib/api/types";

export function useUserYoutube(enabled = true) {
  const [videos, setVideos] = useState<UserYoutubeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserYoutubeVideos({ page: 1, limit: 5 });
      const published = payload.data.filter((v) => v.is_published !== false);
      setVideos(published);
      setTotal(payload.meta.total);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load videos.");
      }
      setVideos([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled || fetched) return;
    void refresh();
  }, [enabled, fetched, refresh]);

  return {
    videos,
    total,
    loading: enabled && !fetched ? true : loading,
    error,
    refresh,
    fetched,
  };
}
