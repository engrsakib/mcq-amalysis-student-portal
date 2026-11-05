"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import {
  extractYoutubeVideoId,
  resolveYoutubeThumbnail,
  youtubeEmbedUrl,
} from "@/lib/youtube/video-url";

type DocsYoutubeEmbedProps = {
  videoUrl: string;
  title: string;
  caption?: string;
};

export function DocsYoutubeEmbed({
  videoUrl,
  title,
  caption,
}: DocsYoutubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYoutubeVideoId(videoUrl);
  const thumbnailSrc = videoId
    ? resolveYoutubeThumbnail(videoUrl)
    : null;

  if (!videoId) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-4 text-sm text-ink">
        <p className="font-medium">{title}</p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-primary underline-offset-2 hover:underline"
        >
          Watch on YouTube
        </a>
      </div>
    );
  }

  return (
    <figure className="space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-ink/5">
        {playing ? (
          <iframe
            title={title}
            src={youtubeEmbedUrl(videoId)}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
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
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex touch-pan-y items-center justify-center bg-ink/20 transition-colors hover:bg-ink/30"
              aria-label={`Play video: ${title}`}
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md sm:size-16">
                <Play className="ml-0.5 size-7 fill-current sm:size-8" aria-hidden />
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="text-sm font-medium text-ink">{title}</figcaption>
      {caption ? (
        <p className="text-xs leading-relaxed text-ink">{caption}</p>
      ) : null}
    </figure>
  );
}
