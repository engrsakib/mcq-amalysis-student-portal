import { DocsFaqAccordion } from "@/components/docs/docs-faq-accordion";
import { DocsHero } from "@/components/docs/docs-hero";
import { FAQ_ITEMS } from "@/lib/docs/faq";
import { docsPageMetadata } from "@/lib/docs/metadata";

export const metadata = docsPageMetadata("FAQ", {
  path: "/docs/faq",
  description:
    "Frequently asked questions about MCQ Analysis accounts, Android app, exams, and government job preparation.",
});

export default function DocsFaqPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="FAQ"
        title="Frequently asked questions"
        subtitle="Clear answers about signing up, practicing exams, and using the platform."
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
        <DocsFaqAccordion items={FAQ_ITEMS} />
      </div>
    </>
  );
}
