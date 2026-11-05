import { DeveloperSection } from "@/components/docs/developer-section";
import { FounderRichText } from "@/components/docs/founder-rich-text";
import { FOUNDER_BIO_PARAGRAPHS } from "@/lib/docs/founder-profile-data";

export function FounderAbout() {
  return (
    <DeveloperSection
      id="about"
      title="About"
      description="Author, BCS cadre officer, and career guide for students and job seekers across Bangladesh."
    >
      <div className="space-y-4 rounded-2xl border border-border/60 bg-primary-soft/40 p-4 sm:p-5">
        {FOUNDER_BIO_PARAGRAPHS.map((paragraph) => (
          <p
            key={paragraph.id}
            className="text-sm leading-relaxed text-ink sm:text-base"
          >
            <FounderRichText segments={paragraph.segments} />
          </p>
        ))}
      </div>
    </DeveloperSection>
  );
}
