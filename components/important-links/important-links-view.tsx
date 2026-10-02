import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PlayStorePromoBanner } from "@/components/important-links/play-store-promo-banner";
import type { FacebookLinkItem } from "@/lib/important-links/load-important-links";
import { cn } from "@/lib/utils";

type ImportantLinksViewProps = {
  groups: FacebookLinkItem[];
  pages: FacebookLinkItem[];
};

function FacebookLinkCard({ item }: { item: FacebookLinkItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "pressable group flex min-h-[4.5rem] touch-pan-y items-center gap-3 rounded-xl border border-line/80 bg-card p-4 shadow-sm",
        "transition-colors hover:border-primary/40 hover:bg-primary-soft/35"
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:text-primary">
          {item.name}
        </span>
      </span>
      <ExternalLink
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
        aria-hidden
      />
    </a>
  );
}

function FacebookLinkSection({
  title,
  subtitle,
  iconSrc,
  items,
}: {
  title: string;
  subtitle: string;
  iconSrc: string;
  items: FacebookLinkItem[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#1877F2]/10 ring-1 ring-[#1877F2]/20">
          <Image
            src={iconSrc}
            alt=""
            width={40}
            height={40}
            className="size-10 object-contain"
            aria-hidden
          />
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={`${item.link}-${item.name}`}>
            <FacebookLinkCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ImportantLinksView({ groups, pages }: ImportantLinksViewProps) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-10 pb-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          Important Links
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Join our Facebook groups and follow official pages for exam updates,
          model tests, and analysis from MCQ Analysis.
        </p>
      </div>

      <PlayStorePromoBanner />

      <FacebookLinkSection
        title="Facebook Groups"
        subtitle="Community groups for discussion, model tests, and exam analysis."
        iconSrc="/fb-group.png"
        items={groups}
      />

      <FacebookLinkSection
        title="Facebook Pages"
        subtitle="Official pages for announcements, resources, and live updates."
        iconSrc="/fbpage.png"
        items={pages}
      />
    </div>
  );
}
