"use client";

import { Play, X } from "lucide-react";
import type { UserYoutubeEntry } from "@/lib/api/types";
import {
  extractYoutubeVideoId,
  resolveYoutubeThumbnail,
  youtubeEmbedUrl,
} from "@/lib/youtube/video-url";
import { cn } from "@/lib/utils";

type YoutubeCatalogCardProps = {
  video: UserYoutubeEntry;
  playing: boolean;
  onPlay: () => void;
  onClose: () => void;
  className?: string;
};

export function YoutubeCatalogCard({
  video,
  playing,
  onPlay,
  onClose,
  className,
}: YoutubeCatalogCardProps) {
  const videoId = extractYoutubeVideoId(video.video_url);
  const thumbnailSrc = resolveYoutubeThumbnail(video.video_url, video.thumbnail_url);

  if (playing && videoId) {
    return (
      <article
        className={cn(
          "flex h-full min-w-0 flex-col gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm",
          className
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-line bg-ink/5">
          <iframe
            title={video.title}
            src={youtubeEmbedUrl(videoId)}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full border border-line/80 bg-card/95 text-ink shadow-sm"
            aria-label="Close video"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {video.title}
        </h3>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-line bg-primary-soft/30">
        {thumbnailSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailSrc}
            alt=""
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Preview unavailable
          </div>
        )}
        {videoId ? (
          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors hover:bg-ink/30"
            aria-label={`Play ${video.title}`}
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Play className="ml-0.5 size-6 fill-current" aria-hidden />
            </span>
          </button>
        ) : null}
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
        {video.title}
      </h3>
    </article>
  );
}
