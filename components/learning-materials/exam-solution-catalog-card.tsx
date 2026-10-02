"use client";

import { ExternalLink } from "lucide-react";
import { StudyPlanThumbnail } from "@/components/dashboard/study-plan-thumbnail";
import { buttonVariants } from "@/components/ui/button";
import type { UserExamSolutionEntry } from "@/lib/api/types";
import { resolveExamSolutionUrl } from "@/lib/exam-solution/resolve-url";
import { cn } from "@/lib/utils";

type ExamSolutionCatalogCardProps = {
  solution: UserExamSolutionEntry;
  className?: string;
};

export function ExamSolutionCatalogCard({
  solution,
  className,
}: ExamSolutionCatalogCardProps) {
  const url = resolveExamSolutionUrl(solution);

  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm",
        className
      )}
    >
      <StudyPlanThumbnail thumbnailUrl={solution.thumbnail_url} />

      <div className="flex min-w-0 flex-wrap items-start gap-2">
        <h3 className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {solution.title}
        </h3>
        {solution.status === "active" ? (
          <span className="shrink-0 rounded-lg bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Active
          </span>
        ) : null}
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-auto inline-flex h-10 w-full gap-2 rounded-[10px] border-primary/40 px-4 text-sm font-medium text-primary hover:bg-primary-soft"
          )}
        >
          Open solution
          <ExternalLink className="size-4" aria-hidden />
        </a>
      ) : (
        <p className="mt-auto text-sm text-muted-foreground">Link unavailable</p>
      )}
    </article>
  );
}
