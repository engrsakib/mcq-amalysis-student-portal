"use client";

import { useState } from "react";
import { EXAM_ROUTINE_DEFAULT_THUMBNAIL } from "@/lib/exam-routine/constants";
import { cn } from "@/lib/utils";

type ExamRoutineThumbnailProps = {
  thumbnailUrl?: string;
  className?: string;
};

export function ExamRoutineThumbnail({
  thumbnailUrl,
  className,
}: ExamRoutineThumbnailProps) {
  const initial = thumbnailUrl?.trim() || EXAM_ROUTINE_DEFAULT_THUMBNAIL;
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
        if (src !== EXAM_ROUTINE_DEFAULT_THUMBNAIL) {
          setSrc(EXAM_ROUTINE_DEFAULT_THUMBNAIL);
        }
      }}
    />
  );
}
