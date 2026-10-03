import { getDocsSitemapEntries } from "@/lib/docs/sitemap-entries";
import { baseUrl } from "@/lib/site";

export type SitemapEntry = {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  lastmod?: string;
};

/** Portal pages (login-gated in app; listed for discovery where indexed). */
const PORTAL_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: 1 },
  { path: "/exam", changefreq: "daily", priority: 0.8 },
  { path: "/results", changefreq: "weekly", priority: 0.7 },
  { path: "/activity", changefreq: "weekly", priority: 0.7 },
  { path: "/learning-materials", changefreq: "weekly", priority: 0.7 },
  { path: "/important-links", changefreq: "monthly", priority: 0.6 },
  { path: "/certificates", changefreq: "monthly", priority: 0.6 },
  { path: "/settings", changefreq: "monthly", priority: 0.5 },
];

/**
 * Static indexable routes (no auth-only or dynamic exam session URLs).
 * Docs paths come from `DOCS_NAV_LINKS` — add a nav link to include new /docs routes.
 */
export const SITEMAP_ENTRIES: SitemapEntry[] = [
  ...PORTAL_SITEMAP_ENTRIES,
  ...getDocsSitemapEntries(),
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function buildSitemapXml(
  entries: SitemapEntry[] = SITEMAP_ENTRIES,
  origin: string = baseUrl
): string {
  const site = normalizeBaseUrl(origin);
  const lastmodDefault = new Date().toISOString().slice(0, 10);

  const urls = entries
    .map((entry) => {
      const loc = escapeXml(`${site}${entry.path === "/" ? "" : entry.path}`);
      const lastmod = escapeXml(entry.lastmod ?? lastmodDefault);
      const changefreq = entry.changefreq ?? "weekly";
      const priority =
        entry.priority != null ? entry.priority.toFixed(1) : "0.7";

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const GOOGLE_SITEMAP_PATH = "/settings/google/sitemap";

export function getGoogleSitemapUrl(origin: string = baseUrl): string {
  return `${normalizeBaseUrl(origin)}${GOOGLE_SITEMAP_PATH}`;
}
