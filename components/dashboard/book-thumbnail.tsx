"use client";

import { useState } from "react";
import { BOOK_DEFAULT_THUMBNAIL } from "@/lib/books/constants";
import { cn } from "@/lib/utils";

type BookThumbnailProps = {
  thumbnailUrl?: string;
  className?: string;
};

export function BookThumbnail({ thumbnailUrl, className }: BookThumbnailProps) {
  const initial = thumbnailUrl?.trim() || BOOK_DEFAULT_THUMBNAIL;
  const [src, setSrc] = useState(initial);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn(
        "aspect-[2/3] w-full object-cover rounded-lg border border-line/80 bg-primary-soft/30",
        className
      )}
      onError={() => {
        if (src !== BOOK_DEFAULT_THUMBNAIL) {
          setSrc(BOOK_DEFAULT_THUMBNAIL);
        }
      }}
    />
  );
}
