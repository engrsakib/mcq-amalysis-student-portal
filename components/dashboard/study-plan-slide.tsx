"use client";

import { ExternalLink } from "lucide-react";
import { StudyPlanThumbnail } from "@/components/dashboard/study-plan-thumbnail";
import { buttonVariants } from "@/components/ui/button";
import type { UserStudyPlanEntry } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type StudyPlanSlideProps = {
  plan: UserStudyPlanEntry;
  className?: string;
};

export function StudyPlanSlide({ plan, className }: StudyPlanSlideProps) {
  const url = plan.study_plan_url?.trim();

  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <StudyPlanThumbnail thumbnailUrl={plan.thumbnail_url} />

      <div className="flex min-w-0 flex-wrap items-start gap-2">
        <h3 className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
          {plan.title}
        </h3>
        {plan.status === "active" ? (
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
            "inline-flex h-10 w-full gap-2 rounded-[10px] border-primary/40 px-4 text-sm font-medium text-primary hover:bg-primary-soft sm:w-auto sm:min-w-[160px]"
          )}
        >
          Open study plan
          <ExternalLink className="size-4" aria-hidden />
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">Link unavailable</p>
      )}
    </div>
  );
}
