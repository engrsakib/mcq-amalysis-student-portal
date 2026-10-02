"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PaginatedMeta } from "@/lib/api/types";

const SEARCH_DEBOUNCE_MS = 300;

const emptyMeta: PaginatedMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPage: 1,
};

export type PaginatedCatalogFetchResult<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export type UsePaginatedCatalogOptions<T> = {
  enabled: boolean;
  fetchPage: (
    page: number,
    searchTerm: string
  ) => Promise<PaginatedCatalogFetchResult<T>>;
  errorMessage?: string;
};

export function usePaginatedCatalog<T>({
  enabled,
  fetchPage,
  errorMessage = "Could not load items.",
}: UsePaginatedCatalogOptions<T>) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>(emptyMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [everEnabled, setEverEnabled] = useState(false);
  const fetchedKeysRef = useRef(new Set<string>());

  useEffect(() => {
    if (enabled) setEverEnabled(true);
  }, [enabled]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const cacheKey = `${page}:${debouncedSearch}`;

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await fetchPage(page, debouncedSearch);
      setItems(result.data);
      setMeta(result.meta);
      fetchedKeysRef.current.add(cacheKey);
    } catch (err) {
      setError(
        err instanceof Error && err.message ? err.message : errorMessage
      );
      setItems([]);
      setMeta(emptyMeta);
      fetchedKeysRef.current.delete(cacheKey);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, fetchPage, errorMessage, cacheKey]);

  useEffect(() => {
    if (!enabled && !everEnabled) return;
    if (!enabled) return;
    if (fetchedKeysRef.current.has(cacheKey)) return;
    void load();
  }, [enabled, everEnabled, load, cacheKey]);

  const refresh = useCallback(() => {
    fetchedKeysRef.current.delete(cacheKey);
    return load();
  }, [cacheKey, load]);

  return {
    items,
    meta,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    loading: enabled && !everEnabled ? true : loading,
    error,
    refresh,
  };
}
