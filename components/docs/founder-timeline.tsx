import { Briefcase } from "lucide-react";
import { DeveloperSection } from "@/components/docs/developer-section";
import { FOUNDER_EXPERIENCE } from "@/lib/docs/founder-profile-data";

export function FounderTimeline() {
  return (
    <DeveloperSection
      id="experience"
      title="Professional journey"
      description="From banking to the Bangladesh Civil Service, alongside public career education."
    >
      <ol className="relative space-y-6 border-l-2 border-primary/25 pl-6 sm:pl-8">
        {FOUNDER_EXPERIENCE.map((job) => (
          <li key={job.id} className="relative">
            <span
              className="absolute -left-[1.625rem] top-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground sm:-left-[2.125rem] sm:size-9"
              aria-hidden
            >
              <Briefcase className="size-4" />
            </span>
            <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-ink">{job.organization}</h3>
                <p className="text-sm font-medium text-primary">{job.period}</p>
              </div>
              <p className="mt-1 text-sm text-ink">{job.role}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </DeveloperSection>
  );
}
