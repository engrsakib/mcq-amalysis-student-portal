"use client";

import { ExternalLink } from "lucide-react";
import { StudyPlanThumbnail } from "@/components/dashboard/study-plan-thumbnail";
import { buttonVariants } from "@/components/ui/button";
import type { UserExamSolutionEntry } from "@/lib/api/types";
import { resolveExamSolutionUrl } from "@/lib/exam-solution/resolve-url";
import { cn } from "@/lib/utils";

type ExamSolutionCatalogRowProps = {
  solution: UserExamSolutionEntry;
  className?: string;
};

export function ExamSolutionCatalogRow({
  solution,
  className,
}: ExamSolutionCatalogRowProps) {
  const url = resolveExamSolutionUrl(solution);

  return (
    <article
      className={cn(
        "flex gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm sm:items-center",
        className
      )}
    >
      <div className="w-28 shrink-0 sm:w-32">
        <StudyPlanThumbnail
          thumbnailUrl={solution.thumbnail_url}
          className="aspect-video"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="line-clamp-2 text-sm font-semibold text-ink">{solution.title}</h3>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "pressable inline-flex h-11 shrink-0 gap-2 rounded-[10px] border-primary/40 px-3 text-sm font-medium text-primary hover:bg-primary-soft"
            )}
          >
            Open
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </div>
    </article>
  );
}
