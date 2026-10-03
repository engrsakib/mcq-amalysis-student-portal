import { DocsHero } from "@/components/docs/docs-hero";
import { DocsProsePage } from "@/components/docs/docs-prose-page";
import { docsPageMetadata } from "@/lib/docs/metadata";
import { TERMS_EFFECTIVE, TERMS_SECTIONS } from "@/lib/docs/terms-content";

export const metadata = docsPageMetadata("Terms & conditions", {
  path: "/docs/terms-condition",
  description:
    "Terms and conditions for using the MCQ Analysis student web portal and Android application.",
});

export default function DocsTermsPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Terms"
        title="Terms & conditions"
        subtitle="Rules for accounts, content use, and responsible preparation on MCQ Analysis."
      />
      <div className="px-4 py-10 sm:py-12">
        <DocsProsePage sections={TERMS_SECTIONS} effectiveDate={TERMS_EFFECTIVE} />
      </div>
    </>
  );
}
