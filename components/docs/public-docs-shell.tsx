import { DocsFooter } from "@/components/docs/docs-footer";
import { DocsNavbar } from "@/components/docs/docs-navbar";

/** Offset for fixed docs navbar (py-3 + min-h-11 row + border). */
const DOCS_NAV_OFFSET = "pt-[4.5rem]";

export function PublicDocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-page text-ink sm:h-svh">
      <DocsNavbar />
      <div
        className={`scroll-pane min-h-0 flex-1 overflow-y-auto overscroll-y-contain ${DOCS_NAV_OFFSET}`}
      >
        <main className="pb-12">{children}</main>
        <DocsFooter />
      </div>
    </div>
  );
}
