import { DEVELOPER_OBJECTIVE } from "@/lib/docs/developer-profile-data";
import { DeveloperSection } from "@/components/docs/developer-section";

export function DeveloperObjective() {
  return (
    <DeveloperSection id="objective" title="Career objective">
      <p className="rounded-2xl border border-border/60 bg-primary-soft/50 p-4 text-sm leading-relaxed text-ink sm:p-5 sm:text-base">
        {DEVELOPER_OBJECTIVE}
      </p>
    </DeveloperSection>
  );
}
