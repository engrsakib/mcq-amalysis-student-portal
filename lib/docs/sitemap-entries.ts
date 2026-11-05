import type { SitemapEntry } from "@/lib/site/sitemap";
import { DOCS_HOME, DOCS_NAV_LINKS } from "@/lib/docs/nav-links";

const DOCS_SITEMAP_META: Record<string, Pick<SitemapEntry, "changefreq" | "priority">> =
  {
    [DOCS_HOME]: { changefreq: "weekly", priority: 0.8 },
    "/docs/founder": { changefreq: "monthly", priority: 0.6 },
    "/docs/founder/books": { changefreq: "monthly", priority: 0.55 },
    "/docs/developer": { changefreq: "monthly", priority: 0.6 },
    "/docs/faq": { changefreq: "monthly", priority: 0.65 },
    "/docs/links": { changefreq: "monthly", priority: 0.65 },
    "/docs/terms-condition": { changefreq: "yearly", priority: 0.5 },
    "/docs/privacy-policy": { changefreq: "yearly", priority: 0.5 },
  };

const DOCS_SITEMAP_EXTRA_PATHS = ["/docs/founder/books"] as const;

/** Public /docs routes for XML sitemap (navbar + nested doc pages). */
export function getDocsSitemapEntries(): SitemapEntry[] {
  const paths = [
    ...DOCS_NAV_LINKS.map((link) => link.href),
    ...DOCS_SITEMAP_EXTRA_PATHS,
  ];
  return paths.map((path) => {
    const meta = DOCS_SITEMAP_META[path];
    return {
      path,
      changefreq: meta?.changefreq ?? "monthly",
      priority: meta?.priority ?? 0.6,
    };
  });
}
