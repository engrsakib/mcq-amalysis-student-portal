import { ImportantLinksView } from "@/components/important-links/important-links-view";
import { DocsHero } from "@/components/docs/docs-hero";
import { docsPageMetadata } from "@/lib/docs/metadata";
import { DOCS_LINKS_PATH } from "@/lib/docs/nav-links";
import { loadImportantLinks } from "@/lib/important-links/load-important-links";

export const metadata = docsPageMetadata("Links", {
  path: DOCS_LINKS_PATH,
  description:
    "Facebook groups and official pages for MCQ Analysis—exam updates, model tests, and community discussion.",
});

export default async function DocsLinksPage() {
  const { groups, pages } = await loadImportantLinks();

  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Links"
        title="Important links"
        subtitle="Join our Facebook groups and follow official pages for exam updates, model tests, and analysis."
      />
      <div className="px-4 py-10 sm:py-12">
        <ImportantLinksView groups={groups} pages={pages} showHeading={false} />
      </div>
    </>
  );
}
