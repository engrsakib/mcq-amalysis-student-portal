import { GraduationCap } from "lucide-react";
import { DEVELOPER_EDUCATION } from "@/lib/docs/developer-profile-data";
import { DeveloperSection } from "@/components/docs/developer-section";

export function DeveloperEducation() {
  const edu = DEVELOPER_EDUCATION;

  return (
    <DeveloperSection id="education" title="Education">
      <div className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <GraduationCap className="size-6" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-semibold text-ink">{edu.institution}</h3>
          <p className="mt-1 text-sm text-ink">{edu.degree}</p>
          <p className="mt-1 text-sm font-medium text-primary">{edu.period}</p>
        </div>
      </div>
    </DeveloperSection>
  );
}
