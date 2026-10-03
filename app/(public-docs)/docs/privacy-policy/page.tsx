import { DocsHero } from "@/components/docs/docs-hero";
import { DocsProsePage } from "@/components/docs/docs-prose-page";
import { docsPageMetadata } from "@/lib/docs/metadata";
import { PRIVACY_EFFECTIVE, PRIVACY_SECTIONS } from "@/lib/docs/privacy-content";

export const metadata = docsPageMetadata("Privacy policy", {
  path: "/docs/privacy-policy",
  description:
    "Privacy policy for MCQ Analysis—how student account, exam, and device data is collected and protected.",
});

export default function DocsPrivacyPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Privacy"
        title="Privacy policy"
        subtitle="Transparency about data we collect and how we keep your account secure."
      />
      <div className="px-4 py-10 sm:py-12">
        <DocsProsePage
          sections={PRIVACY_SECTIONS}
          effectiveDate={PRIVACY_EFFECTIVE}
        />
      </div>
    </>
  );
}
