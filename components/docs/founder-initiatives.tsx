import { MapPinned } from "lucide-react";
import { DeveloperSection } from "@/components/docs/developer-section";
import { FOUNDER_INITIATIVE } from "@/lib/docs/founder-profile-data";

export function FounderInitiatives() {
  return (
    <DeveloperSection id="initiatives" title="Nationwide impact">
      <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            aria-hidden
          >
            <MapPinned className="size-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-ink">
              {FOUNDER_INITIATIVE.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink sm:text-base">
              {FOUNDER_INITIATIVE.description}
            </p>
          </div>
        </div>
      </article>
    </DeveloperSection>
  );
}
