import { GraduationCap } from "lucide-react";
import { DeveloperSection } from "@/components/docs/developer-section";
import { FOUNDER_EDUCATION } from "@/lib/docs/founder-profile-data";

export function FounderEducation() {
  return (
    <DeveloperSection id="education" title="Education">
      <ul className="space-y-3">
        {FOUNDER_EDUCATION.map((entry) => (
          <li
            key={entry.id}
            className="flex gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5"
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"
              aria-hidden
            >
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">{entry.institution}</p>
              <p className="mt-1 text-sm text-ink">{entry.credential}</p>
            </div>
          </li>
        ))}
      </ul>
    </DeveloperSection>
  );
}
