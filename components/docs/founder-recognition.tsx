import { Award, ExternalLink } from "lucide-react";
import { DeveloperSection } from "@/components/docs/developer-section";
import { FOUNDER_AWARDS } from "@/lib/docs/founder-profile-data";

export function FounderRecognition() {
  return (
    <DeveloperSection
      id="recognition"
      title="Recognition & awards"
      description="Honours for community leadership and bestselling books."
    >
      <ul className="grid gap-3 sm:grid-cols-3">
        {FOUNDER_AWARDS.map((award) => (
          <li key={award.id}>
            <a
              href={award.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary-soft/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Award className="size-4" aria-hidden />
                </span>
                <ExternalLink
                  className="size-4 shrink-0 text-ink opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                {award.year}
              </p>
              <p className="mt-1 text-base font-semibold text-ink">{award.title}</p>
              <p className="mt-1 text-sm text-ink">{award.issuer}</p>
            </a>
          </li>
        ))}
      </ul>
    </DeveloperSection>
  );
}
