import { ImportantLinksView } from "@/components/important-links/important-links-view";
import { loadImportantLinks } from "@/lib/important-links/load-important-links";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Important Links", {
  path: "/important-links",
  description:
    "Facebook groups and pages for MCQ Analysis—exam updates, model tests, and community discussion.",
});

export default async function ImportantLinksPage() {
  const { groups, pages } = await loadImportantLinks();
  return <ImportantLinksView groups={groups} pages={pages} />;
}
