"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getExamLeaderboard } from "@/lib/api/leaderboard";
import { ApiError } from "@/lib/api/client";
import type {
  LeaderboardCurrentUser,
  LeaderboardEntry,
  PaginatedMeta,
} from "@/lib/api/types";
import { LEADERBOARD_PAGE_LIMIT } from "@/lib/results/constants";

const emptyMeta: PaginatedMeta = {
  page: 1,
  limit: LEADERBOARD_PAGE_LIMIT,
  total: 0,
  totalPage: 1,
};

function pickTopThree(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [1, 2, 3]
    .map((rank) => entries.find((e) => e.rank === rank))
    .filter((e): e is LeaderboardEntry => e != null);
}

export function useExamLeaderboard(examNumber: number | null) {
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardCurrentUser | null>(
    null
  );
  const [meta, setMeta] = useState<PaginatedMeta>(emptyMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);
  const topThreeExamRef = useRef<number | null>(null);

  useEffect(() => {
    setPage(1);
    setTopThree([]);
    topThreeExamRef.current = null;
  }, [examNumber]);

  const fetchLeaderboard = useCallback(async () => {
    if (examNumber == null) {
      setEntries([]);
      setCurrentUser(null);
      setMeta(emptyMeta);
      setError(null);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload = await getExamLeaderboard(examNumber, {
        page,
        limit: LEADERBOARD_PAGE_LIMIT,
      });
      setEntries(payload.data);
      setCurrentUser(payload.current_user);
      setMeta(payload.meta);

      if (page === 1) {
        const podium = pickTopThree(payload.data);
        setTopThree(podium);
        topThreeExamRef.current = examNumber;
      } else if (topThreeExamRef.current !== examNumber) {
        const pageOne = await getExamLeaderboard(examNumber, {
          page: 1,
          limit: LEADERBOARD_PAGE_LIMIT,
        });
        setTopThree(pickTopThree(pageOne.data));
        topThreeExamRef.current = examNumber;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load leaderboard.");
      }
      setEntries([]);
      setCurrentUser(null);
      setMeta(emptyMeta);
    } finally {
      setLoading(false);
    }
  }, [examNumber, page]);

  useEffect(() => {
    void fetchLeaderboard();
  }, [fetchLeaderboard]);

  const listEntries = useMemo(() => {
    if (page === 1) {
      return entries.filter(
        (e) => typeof e.rank !== "number" || e.rank > 3
      );
    }
    return entries;
  }, [entries, page]);

  return {
    page,
    setPage,
    entries: listEntries,
    currentUser,
    meta,
    topThree,
    loading,
    error,
    retry: fetchLeaderboard,
  };
}
