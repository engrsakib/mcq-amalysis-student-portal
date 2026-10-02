export type YoutubeThumbnailQuality = "default" | "hqdefault" | "mqdefault" | "sddefault" | "maxresdefault";

export function extractYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && id.length >= 6 ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const embedMatch = parsed.pathname.match(
        /^\/(?:embed|shorts|live)\/([^/?]+)/
      );
      if (embedMatch?.[1]) return embedMatch[1];
    }
  } catch {
    /* ignore invalid URLs */
  }

  return null;
}

export function youtubeThumbnailUrl(
  videoId: string,
  quality: YoutubeThumbnailQuality = "hqdefault"
): string {
  return `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/${quality}.jpg`;
}

export function youtubeEmbedUrl(videoId: string): string {
  const query = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${query.toString()}`;
}

export function resolveYoutubeThumbnail(
  videoUrl: string,
  thumbnailUrl?: string
): string | null {
  const fromApi = thumbnailUrl?.trim();
  if (fromApi) return fromApi;
  const id = extractYoutubeVideoId(videoUrl);
  return id ? youtubeThumbnailUrl(id) : null;
}
