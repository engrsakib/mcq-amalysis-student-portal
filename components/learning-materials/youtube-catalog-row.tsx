"use client";

import { Play, X } from "lucide-react";
import type { UserYoutubeEntry } from "@/lib/api/types";
import {
  extractYoutubeVideoId,
  resolveYoutubeThumbnail,
  youtubeEmbedUrl,
} from "@/lib/youtube/video-url";
import { cn } from "@/lib/utils";

type YoutubeCatalogRowProps = {
  video: UserYoutubeEntry;
  playing: boolean;
  onPlay: () => void;
  onClose: () => void;
  className?: string;
};

export function YoutubeCatalogRow({
  video,
  playing,
  onPlay,
  onClose,
  className,
}: YoutubeCatalogRowProps) {
  const videoId = extractYoutubeVideoId(video.video_url);
  const thumbnailSrc = resolveYoutubeThumbnail(video.video_url, video.thumbnail_url);

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm sm:flex-row sm:items-start",
        className
      )}
    >
      <div className="relative w-full shrink-0 overflow-hidden rounded-lg border border-line sm:w-40">
        <div className="relative aspect-video w-full bg-primary-soft/30">
          {playing && videoId ? (
            <>
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
                className="absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-card/95 text-ink shadow-sm"
                aria-label="Close video"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </>
          ) : thumbnailSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailSrc}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No preview
            </div>
          )}
          {!playing && videoId ? (
            <button
              type="button"
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center bg-ink/20 hover:bg-ink/30"
              aria-label={`Play ${video.title}`}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Play className="ml-0.5 size-5 fill-current" aria-hidden />
              </span>
            </button>
          ) : null}
        </div>
      </div>
      <h3 className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold text-ink sm:py-2">
        {video.title}
      </h3>
    </article>
  );
}
