"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACTIVITY_ACTION_FILTERS,
  type ActivityActionFilterValue,
} from "@/lib/activity/constants";
import { cn } from "@/lib/utils";

const fieldClassName = "h-9 w-full min-w-0 bg-card";

const selectClassName = cn(
  fieldClassName,
  "appearance-none rounded-lg border border-input bg-card bg-[length:1rem] bg-[position:right_0.5rem_center] bg-no-repeat py-1 pl-2.5 pr-9 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%235c6b66%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]"
);

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
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 lg:grid-cols-4 lg:items-end">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="activity-date-from">From</Label>
          <Input
            id="activity-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={fieldClassName}
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
            className={fieldClassName}
            aria-invalid={dateRangeInvalid}
          />
        </div>
        <div className="col-span-2 flex min-w-0 flex-col gap-1.5 lg:col-span-1">
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
          <div className="col-span-2 flex min-w-0 items-end lg:col-span-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-full rounded-lg lg:w-full"
              onClick={onClearDates}
            >
              Clear dates
            </Button>
          </div>
        ) : null}
      </div>
      {dateRangeInvalid ? (
        <p className="mt-2 text-xs text-destructive" role="status">
          Start date is after end date — results use the swapped range.
        </p>
      ) : null}
    </div>
  );
}
