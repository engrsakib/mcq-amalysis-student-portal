"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { ResultTableRow } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

type ResultsTableProps = {
  rows: ResultTableRow[];
};

function MiniAnalysisBar({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-6 items-end gap-0.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-t bg-primary/70"
          style={{ height: `${(v / max) * 100}%`, minHeight: 2 }}
        />
      ))}
    </div>
  );
}

function scoreBadgeClass(score: number) {
  if (score >= 85) return "bg-primary-soft text-primary";
  if (score >= 70) return "bg-primary/10 text-primary";
  if (score >= 60) return "bg-amber-100 text-amber-800";
  return "bg-danger-soft text-danger";
}

export function ResultsTable({ rows }: ResultsTableProps) {
  const { initials } = useProfileDisplay();

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-sm ring-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base font-semibold text-ink">
          My recent results
        </CardTitle>
        <span className="text-xs text-muted-foreground">Static preview</span>
      </CardHeader>
      <CardContent className="scroll-pane-x overflow-x-auto px-0 pb-2">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">
                <Checkbox aria-label="Select all" disabled />
              </th>
              <th className="px-2 py-2 font-medium">Name</th>
              <th className="px-2 py-2 font-medium">Total score</th>
              <th className="px-2 py-2 font-medium">Reasoning</th>
              <th className="px-2 py-2 font-medium">Time</th>
              <th className="px-2 py-2 font-medium">Analysis</th>
              <th className="px-2 py-2 font-medium">Start date</th>
              <th className="px-2 py-2 font-medium">Score</th>
              <th className="px-4 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-line/80 last:border-0"
              >
                <td className="px-4 py-3">
                  <Checkbox aria-label={`Select ${row.subject}`} disabled />
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                      {initials}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{row.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.subject}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                      scoreBadgeClass(row.totalScore)
                    )}
                  >
                    {row.totalScore.toFixed(1)}%
                  </span>
                </td>
                <td className="px-2 py-3 text-muted-foreground">
                  {row.reasoning}%
                </td>
                <td className="px-2 py-3 text-muted-foreground">{row.time}</td>
                <td className="px-2 py-3">
                  <MiniAnalysisBar values={row.analysis} />
                </td>
                <td className="px-2 py-3 text-muted-foreground">
                  {row.startDate}
                </td>
                <td className="px-2 py-3 font-medium text-primary">
                  {row.genericScore}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button
                      type="button"
                      className="flex min-h-11 min-w-11 items-center justify-center rounded hover:bg-primary-soft hover:text-primary"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="flex min-h-11 min-w-11 items-center justify-center rounded hover:bg-primary-soft hover:text-primary"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="flex min-h-11 min-w-11 items-center justify-center rounded hover:bg-primary-soft hover:text-primary"
                      aria-label="More"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
