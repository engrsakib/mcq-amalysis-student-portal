import type { Metadata } from "next";
import type { ExamEntry } from "@/lib/api/types";

export const SITE_NAME = "MCQ Analysis";

/** Default document / Open Graph title for the student portal home and root layout. */
export const PORTAL_BRAND_TITLE = "MCQ Analysis - Student Portal";

export const DEFAULT_OG_DESCRIPTION =
  "A general educational tool for Android featuring verified past questions, customized quizzes, a live leaderboard, and a deep mistake-analysis tool to track weak areas.";

export const SOCIAL_IMAGE_PATH = "/social.jpeg";

export const SOCIAL_IMAGE_ALT =
  "MCQ Analysis — practice exams and analytics";

export const DEFAULT_KEYWORDS = [
  "MCQ",
  "quiz",
  "past questions",
  "leaderboard",
  "mistake analysis",
  "education",
  "exam preparation",
  "MCQ Analysis",
];

const SOCIAL_IMAGE = {
  url: SOCIAL_IMAGE_PATH,
  alt: SOCIAL_IMAGE_ALT,
};

export function defaultOpenGraph(
  overrides?: Partial<NonNullable<Metadata["openGraph"]>>
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "en",
    title: SITE_NAME,
    description: DEFAULT_OG_DESCRIPTION,
    images: [SOCIAL_IMAGE],
    ...overrides,
  };
}

export function defaultTwitter(
  overrides?: Partial<NonNullable<Metadata["twitter"]>>
): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_OG_DESCRIPTION,
    images: [SOCIAL_IMAGE_PATH],
    ...overrides,
  };
}

export type PageMetadataOptions = {
  description?: string;
  path?: string;
  /** Open Graph / Twitter title; defaults to page `title`. */
  ogTitle?: string;
  keywords?: string[];
  robots?: Metadata["robots"];
};

/** Uses root layout `title.template` (`%s — MCQ Analysis`). */
export function pageMetadata(
  title: string,
  options?: PageMetadataOptions | string
): Metadata {
  const opts: PageMetadataOptions =
    typeof options === "string" ? { description: options } : (options ?? {});

  const description = opts.description ?? DEFAULT_OG_DESCRIPTION;
  const ogTitle = opts.ogTitle ?? title;
  const keywords = opts.keywords ?? DEFAULT_KEYWORDS;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: defaultOpenGraph({
      title: ogTitle,
      description,
    }),
    twitter: defaultTwitter({
      title: ogTitle,
      description,
    }),
  };

  if (opts.path) {
    metadata.alternates = { canonical: opts.path };
  }

  if (opts.robots !== undefined) {
    metadata.robots = opts.robots;
  }

  return metadata;
}

export function examPageMetadata(
  entry: ExamEntry,
  examNumber: string
): Metadata {
  const name = entry.exam_name?.trim() || `Exam #${examNumber}`;
  const title = name;
  const description = `${entry.subject} · ${entry.duration_minutes} min · ${entry.total_marks} marks. Practice and review with ${SITE_NAME}.`;

  return pageMetadata(title, {
    description,
    path: `/exam/${examNumber}`,
    ogTitle: name,
  });
}

export const rootSiteMetadata: Metadata = {
  title: {
    default: PORTAL_BRAND_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_OG_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  openGraph: defaultOpenGraph({
    title: PORTAL_BRAND_TITLE,
  }),
  twitter: defaultTwitter({
    title: PORTAL_BRAND_TITLE,
  }),
  robots: { index: true, follow: true },
};

/** Metadata for `/` — brand title for tabs and social previews (not "Dashboard" / login redirect). */
export const homePageMetadata: Metadata = {
  title: { absolute: PORTAL_BRAND_TITLE },
  description: DEFAULT_OG_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: defaultOpenGraph({
    title: PORTAL_BRAND_TITLE,
    url: "/",
  }),
  twitter: defaultTwitter({
    title: PORTAL_BRAND_TITLE,
  }),
  robots: { index: true, follow: true },
};
