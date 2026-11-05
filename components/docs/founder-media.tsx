import { ExternalLink, Newspaper } from "lucide-react";
import { BrandYoutubeIcon } from "@/components/docs/docs-brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { DeveloperSection } from "@/components/docs/developer-section";
import { DocsYoutubeEmbed } from "@/components/docs/docs-youtube-embed";
import {
  FOUNDER_PRESS,
  FOUNDER_PROFILE,
  FOUNDER_YOUTUBE_FEATURES,
} from "@/lib/docs/founder-profile-data";
import { cn } from "@/lib/utils";

export function FounderMedia() {
  return (
    <DeveloperSection
      id="media"
      title="Media & talks"
      description="Seminars, television, and press on careers and education."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {FOUNDER_YOUTUBE_FEATURES.map((video) => (
          <DocsYoutubeEmbed
            key={video.id}
            videoUrl={video.videoUrl}
            title={video.title}
            caption={video.caption}
          />
        ))}
      </div>

      <a
        href={FOUNDER_PROFILE.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-4 h-11 w-full gap-2 border-primary/30 text-ink hover:bg-primary-soft sm:w-auto"
        )}
      >
        <BrandYoutubeIcon className="size-4 shrink-0 text-primary" />
        BCS Preliminary Analysis on YouTube
        <ExternalLink className="size-3.5 opacity-70" aria-hidden />
      </a>

      <div className="mt-8">
        <h3 className="text-base font-semibold text-ink">In the press</h3>
        <ul className="mt-3 space-y-3">
          {FOUNDER_PRESS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary-soft/30 sm:p-5"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"
                  aria-hidden
                >
                  <Newspaper className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-ink">{item.title}</p>
                    <ExternalLink
                      className="size-4 shrink-0 text-ink opacity-60 group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-primary">
                    {item.outlet}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">
                    {item.description}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </DeveloperSection>
  );
}
