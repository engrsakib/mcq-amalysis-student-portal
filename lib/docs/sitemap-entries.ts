import type { SitemapEntry } from "@/lib/site/sitemap";
import { DOCS_HOME, DOCS_NAV_LINKS } from "@/lib/docs/nav-links";

const DOCS_SITEMAP_META: Record<string, Pick<SitemapEntry, "changefreq" | "priority">> =
  {
    [DOCS_HOME]: { changefreq: "weekly", priority: 0.8 },
    "/docs/founder": { changefreq: "monthly", priority: 0.6 },
    "/docs/developer": { changefreq: "monthly", priority: 0.6 },
    "/docs/faq": { changefreq: "monthly", priority: 0.65 },
    "/docs/links": { changefreq: "monthly", priority: 0.65 },
    "/docs/terms-condition": { changefreq: "yearly", priority: 0.5 },
    "/docs/privacy-policy": { changefreq: "yearly", priority: 0.5 },
  };

/** Public /docs routes for XML sitemap (mirrors docs navbar). */
export function getDocsSitemapEntries(): SitemapEntry[] {
  return DOCS_NAV_LINKS.map((link) => {
    const meta = DOCS_SITEMAP_META[link.href];
    return {
      path: link.href,
      changefreq: meta?.changefreq ?? "monthly",
      priority: meta?.priority ?? 0.6,
    };
  });
}
