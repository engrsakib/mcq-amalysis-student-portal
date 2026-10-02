"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyActivityLogs } from "@/lib/api/activity";
import { ApiError } from "@/lib/api/client";
import type { ActivityLogEntry, PaginatedMeta } from "@/lib/api/types";
import {
  ACTIVITY_PAGE_LIMIT,
  type ActivityActionFilterValue,
} from "@/lib/activity/constants";

const emptyMeta: PaginatedMeta = {
  page: 1,
  limit: ACTIVITY_PAGE_LIMIT,
  total: 0,
  totalPage: 1,
};

export function useActivityLogs() {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState<ActivityActionFilterValue>("");
  const [items, setItems] = useState<ActivityLogEntry[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveDates = useMemo(() => {
    let from = dateFrom.trim();
    let to = dateTo.trim();
    if (from && to && from > to) {
      [from, to] = [to, from];
    }
    return { dateFrom: from, dateTo: to };
  }, [dateFrom, dateTo]);

  const dateRangeInvalid =
    dateFrom.trim() !== "" &&
    dateTo.trim() !== "" &&
    dateFrom.trim() > dateTo.trim();

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, actionFilter]);

  const fetchLogs = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getMyActivityLogs({
        page,
        limit: ACTIVITY_PAGE_LIMIT,
        dateFrom: effectiveDates.dateFrom || undefined,
        dateTo: effectiveDates.dateTo || undefined,
        action: actionFilter || undefined,
      });
      setItems(payload.data);
      setMeta(payload.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load activity.");
      }
      setItems([]);
      setMeta(emptyMeta);
    } finally {
      setLoading(false);
    }
  }, [page, effectiveDates.dateFrom, effectiveDates.dateTo, actionFilter]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const clearDates = useCallback(() => {
    setDateFrom("");
    setDateTo("");
  }, []);

  return {
    items,
    meta,
    page,
    setPage,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    clearDates,
    dateRangeInvalid,
    actionFilter,
    setActionFilter,
    loading,
    error,
    refresh: fetchLogs,
  };
}
