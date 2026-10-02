"use client";

import { useCallback, useState } from "react";
import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { YoutubeVideoSlide } from "@/components/dashboard/youtube-video-slide";
import { useUserYoutube } from "@/hooks/use-user-youtube";

export function YoutubeSection() {
  const { videos, total, loading, error } = useUserYoutube();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
    setPlayingId(null);
  }, []);

  const activeVideoId = videos[activeIndex]?._id ?? null;

  return (
    <ExamCarouselCard
      title="Youtube"
      countLabel={videos.length > 0 ? Math.min(total, videos.length) : undefined}
      countSuffix="video"
      loading={loading}
      error={error}
      exams={videos}
      emptyMessage="No videos available."
      autoSlideMs={4000}
      autoPaused={playingId != null}
      onActiveIndexChange={handleActiveIndexChange}
      loadingSkeletonClassName="aspect-video w-full"
      cardClassName="lg:min-h-0"
      renderSlide={(video) => (
        <YoutubeVideoSlide
          video={video}
          playing={playingId === video._id && activeVideoId === video._id}
          onPlay={() => setPlayingId(video._id)}
          onClose={() => setPlayingId(null)}
        />
      )}
    />
  );
}
