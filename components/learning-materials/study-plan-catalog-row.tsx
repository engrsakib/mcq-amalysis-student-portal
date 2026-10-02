"use client";

import { ExternalLink } from "lucide-react";
import { StudyPlanThumbnail } from "@/components/dashboard/study-plan-thumbnail";
import { buttonVariants } from "@/components/ui/button";
import type { UserStudyPlanEntry } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type StudyPlanCatalogRowProps = {
  plan: UserStudyPlanEntry;
  className?: string;
};

export function StudyPlanCatalogRow({ plan, className }: StudyPlanCatalogRowProps) {
  const url = plan.study_plan_url?.trim();

  return (
    <article
      className={cn(
        "flex gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm sm:items-center",
        className
      )}
    >
      <div className="w-28 shrink-0 sm:w-32">
        <StudyPlanThumbnail thumbnailUrl={plan.thumbnail_url} className="aspect-video" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-ink">{plan.title}</h3>
          {plan.status === "active" ? (
            <span className="mt-1 inline-block rounded-lg bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
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
              "inline-flex h-9 shrink-0 gap-2 rounded-[10px] border-primary/40 px-3 text-sm font-medium text-primary hover:bg-primary-soft"
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
