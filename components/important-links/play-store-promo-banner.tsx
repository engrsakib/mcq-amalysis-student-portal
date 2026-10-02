import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PLAY_STORE_URL } from "@/lib/important-links/play-store";
import { cn } from "@/lib/utils";

export function PlayStorePromoBanner() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "pressable group flex touch-pan-y flex-col gap-4 rounded-xl border border-line/80 bg-gradient-to-br from-primary-soft/50 to-card p-5 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-6",
        "transition-colors hover:border-primary/40 hover:from-primary-soft/70 hover:shadow-md"
      )}
    >
      <span className="flex size-14 shrink-0 items-center justify-center self-start rounded-2xl bg-card ring-1 ring-line/60 sm:size-16">
        <Image
          src="/playstore.png"
          alt=""
          width={56}
          height={56}
          className="size-12 object-contain sm:size-14"
          aria-hidden
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
          Now on Google Play
        </span>
        <span className="mt-2 block text-lg font-semibold leading-snug text-ink sm:text-xl">
          Get MCQ Analysis on Android
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
          Practice verified past questions, compete on the live leaderboard, and
          use deep mistake analysis wherever you study.
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:underline">
          Install on Google Play
          <ExternalLink className="size-4 shrink-0" aria-hidden />
        </span>
      </span>
    </a>
  );
}
