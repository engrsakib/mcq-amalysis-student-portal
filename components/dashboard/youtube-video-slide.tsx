"use client";

import { Play, X } from "lucide-react";
import type { UserYoutubeEntry } from "@/lib/api/types";
import {
  extractYoutubeVideoId,
  resolveYoutubeThumbnail,
  youtubeEmbedUrl,
} from "@/lib/youtube/video-url";
import { cn } from "@/lib/utils";

type YoutubeVideoSlideProps = {
  video: UserYoutubeEntry;
  playing: boolean;
  onPlay: () => void;
  onClose: () => void;
  className?: string;
};

export function YoutubeVideoSlide({
  video,
  playing,
  onPlay,
  onClose,
  className,
}: YoutubeVideoSlideProps) {
  const videoId = extractYoutubeVideoId(video.video_url);
  const thumbnailSrc = resolveYoutubeThumbnail(video.video_url, video.thumbnail_url);

  if (playing && videoId) {
    return (
      <div className={cn("min-w-0 space-y-2", className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-ink/5">
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
            className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full border border-line/80 bg-card/95 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-card"
            aria-label="Close video"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
          {video.title}
        </h3>
      </div>
    );
  }

  return (
    <div className={cn("min-w-0 space-y-3", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-primary-soft/30">
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
          <div className="flex size-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Preview unavailable
          </div>
        )}

        {videoId ? (
          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 flex touch-pan-y items-center justify-center bg-ink/20 transition-colors hover:bg-ink/30"
            aria-label="Play video"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md sm:size-16">
              <Play className="ml-0.5 size-7 fill-current sm:size-8" aria-hidden />
            </span>
          </button>
        ) : (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-10">
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white underline-offset-2 hover:underline"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
        {video.title}
      </h3>
    </div>
  );
}
