"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACTIVITY_ACTION_FILTERS,
  type ActivityActionFilterValue,
} from "@/lib/activity/constants";
import { cn } from "@/lib/utils";

const selectClassName =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type ActivityFiltersProps = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearDates: () => void;
  dateRangeInvalid: boolean;
  actionFilter: ActivityActionFilterValue;
  onActionFilterChange: (value: ActivityActionFilterValue) => void;
  className?: string;
};

export function ActivityFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearDates,
  dateRangeInvalid,
  actionFilter,
  onActionFilterChange,
  className,
}: ActivityFiltersProps) {
  const hasDates = dateFrom !== "" || dateTo !== "";

  return (
    <div
      className={cn(
        "rounded-xl border border-line/70 bg-card p-3 shadow-sm sm:p-4",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="activity-date-from">From</Label>
            <Input
              id="activity-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="h-9 bg-card"
              aria-invalid={dateRangeInvalid}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="activity-date-to">To</Label>
            <Input
              id="activity-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="h-9 bg-card"
              aria-invalid={dateRangeInvalid}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Label htmlFor="activity-action">Action</Label>
            <select
              id="activity-action"
              value={actionFilter}
              onChange={(e) =>
                onActionFilterChange(e.target.value as ActivityActionFilterValue)
              }
              className={selectClassName}
            >
              {ACTIVITY_ACTION_FILTERS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {hasDates ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-full shrink-0 rounded-lg sm:w-auto"
              onClick={onClearDates}
            >
              Clear dates
            </Button>
          ) : null}
        </div>
      </div>
      {dateRangeInvalid ? (
        <p className="mt-2 text-xs text-destructive" role="status">
          Start date is after end date — results use the swapped range.
        </p>
      ) : null}
    </div>
  );
}
