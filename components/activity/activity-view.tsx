"use client";

import { ActivityFilters } from "@/components/activity/activity-filters";
import { ActivityLogItem } from "@/components/activity/activity-log-item";
import { ActivityLogSkeleton } from "@/components/activity/activity-log-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { useActivityLogs } from "@/hooks/use-activity-logs";

export function ActivityView() {
  const {
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
    refresh,
  } = useActivityLogs();

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exam starts, submissions, and proctoring events for your account.
        </p>
      </div>

      <ActivityFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onClearDates={clearDates}
        dateRangeInvalid={dateRangeInvalid}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load activity</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <ActivityLogSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card/50 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No activity for these filters.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((entry) => (
            <li key={entry._id}>
              <ActivityLogItem entry={entry} />
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && meta.totalPage > 1 ? (
        <PaginationBar
          page={page}
          totalPages={meta.totalPage}
          onPageChange={setPage}
          summaryLabel={`${meta.total} event${meta.total === 1 ? "" : "s"}`}
        />
      ) : null}
    </div>
  );
}
