import type { Metadata } from "next";
import { DEFAULT_KEYWORDS, pageMetadata } from "@/lib/site/metadata";

const DOCS_KEYWORDS = [
  ...DEFAULT_KEYWORDS,
  "government job preparation",
  "competitive exams",
  "BCS",
  "bank job",
  "MCQ practice",
  "student documentation",
];

export type DocsPageMetadataOptions = {
  description: string;
  path: string;
  keywords?: string[];
};

/** SEO metadata for public /docs routes (indexable). */
export function docsPageMetadata(
  title: string,
  options: DocsPageMetadataOptions
): Metadata {
  return pageMetadata(title, {
    description: options.description,
    path: options.path,
    keywords: options.keywords ?? DOCS_KEYWORDS,
    robots: { index: true, follow: true },
  });
}
