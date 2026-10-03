import { DocsHero } from "@/components/docs/docs-hero";
import { DocsProsePage } from "@/components/docs/docs-prose-page";
import { FOUNDER_SECTIONS } from "@/lib/docs/founder-content";
import { docsPageMetadata } from "@/lib/docs/metadata";

export const metadata = docsPageMetadata("Founder & vision", {
  path: "/docs/founder",
  description:
    "Learn about the founder’s vision and mission behind MCQ Analysis for competitive exam students in Bangladesh.",
});

export default function DocsFounderPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Founder"
        title="Founder & vision"
        subtitle="Why we built a student-first platform for measurable exam preparation."
      />
      <div className="px-4 py-10 sm:py-12">
        <DocsProsePage sections={FOUNDER_SECTIONS} />
      </div>
    </>
  );
}
