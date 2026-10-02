"use client";

import { ResultsTable } from "@/components/dashboard/results-table";
import { dashboardMock } from "@/lib/dashboard/mock";

export function ResultsView() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Results</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your exam scores and performance history.
        </p>
      </div>
      <ResultsTable rows={dashboardMock.recentResults} />
    </div>
  );
}
