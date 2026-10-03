import { DocsHero } from "@/components/docs/docs-hero";
import { DocsProsePage } from "@/components/docs/docs-prose-page";
import { DEVELOPER_SECTIONS } from "@/lib/docs/developer-content";
import { docsPageMetadata } from "@/lib/docs/metadata";

export const metadata = docsPageMetadata("Developer & engineering", {
  path: "/docs/developer",
  description:
    "How MCQ Analysis is engineered—tech stack, security practices, and the team’s approach to the student web portal.",
});

export default function DocsDeveloperPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Developer"
        title="Developer & engineering"
        subtitle="Modern web architecture, secure APIs, and mobile-first UX for exam day."
      />
      <div className="px-4 py-10 sm:py-12">
        <DocsProsePage sections={DEVELOPER_SECTIONS} />
      </div>
    </>
  );
}
