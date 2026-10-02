"use client";

import { useCallback, useEffect, useState } from "react";
import { getGlobalSearch } from "@/lib/api/search";
import { ApiError } from "@/lib/api/client";
import type { GlobalSearchPayload } from "@/lib/api/types";

const SEARCH_DEBOUNCE_MS = 300;

export function useGlobalSearch(query: string, enabled: boolean) {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [data, setData] = useState<GlobalSearchPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDebouncedQuery("");
      return;
    }
    const id = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query, enabled]);

  const fetchSearch = useCallback(async () => {
    if (!debouncedQuery) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload = await getGlobalSearch(debouncedQuery);
      setData(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not load search results.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    void fetchSearch();
  }, [fetchSearch]);

  const reset = useCallback(() => {
    setDebouncedQuery("");
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchSearch,
    reset,
    debouncedQuery,
  };
}
