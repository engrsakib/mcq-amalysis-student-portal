import type { MetadataRoute } from "next";
import { getGoogleSitemapUrl } from "@/lib/site/sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getGoogleSitemapUrl(),
  };
}
