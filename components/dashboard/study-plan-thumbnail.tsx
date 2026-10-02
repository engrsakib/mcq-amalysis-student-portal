"use client";

import { useState } from "react";
import { STUDY_PLAN_DEFAULT_THUMBNAIL } from "@/lib/study-plan/constants";
import { cn } from "@/lib/utils";

type StudyPlanThumbnailProps = {
  thumbnailUrl?: string;
  className?: string;
};

export function StudyPlanThumbnail({
  thumbnailUrl,
  className,
}: StudyPlanThumbnailProps) {
  const initial = thumbnailUrl?.trim() || STUDY_PLAN_DEFAULT_THUMBNAIL;
  const [src, setSrc] = useState(initial);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn(
        "aspect-video w-full object-cover rounded-lg border border-line/80 bg-primary-soft/30",
        className
      )}
      onError={() => {
        if (src !== STUDY_PLAN_DEFAULT_THUMBNAIL) {
          setSrc(STUDY_PLAN_DEFAULT_THUMBNAIL);
        }
      }}
    />
  );
}
