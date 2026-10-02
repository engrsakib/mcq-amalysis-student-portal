"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserBooks } from "@/lib/api/books";
import type { UserBookEntry } from "@/lib/api/types";

export function useUserBooks() {
  const [books, setBooks] = useState<UserBookEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserBooks({
        page: 1,
        limit: 5,
        searchTerm: "",
      });
      const published = payload.data.filter((b) => b.is_published !== false);
      setBooks(published);
      setTotal(payload.meta.total);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load books.");
      }
      setBooks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { books, total, loading, error, refresh };
}
