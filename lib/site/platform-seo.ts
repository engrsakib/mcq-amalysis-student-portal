import { DEVELOPER_PROFILE } from "@/lib/docs/developer-profile-data";
import { FOUNDER_PROFILE } from "@/lib/docs/founder-profile-data";

/** Default document / Open Graph title for home and root layout. */
export const PORTAL_BRAND_TITLE = "MCQ Analysis";

export const DEFAULT_OG_DESCRIPTION = [
  "MCQ Analysis helps competitive exam candidates in Bangladesh practice with verified question banks, live exam routines, and mistake analytics on web and Android.",
  `Founded by ${FOUNDER_PROFILE.name}, BCS cadre and bestselling author (BCS Preliminary Analysis).`,
  `Engineered by ${DEVELOPER_PROFILE.name}, ${DEVELOPER_PROFILE.title}.`,
].join(" ");

export const DEFAULT_KEYWORDS = [
  "MCQ Analysis",
  "MCQ practice",
  "competitive exams Bangladesh",
  "BCS preparation",
  "BCS Preliminary Analysis",
  "government job preparation",
  "bank job MCQ",
  "exam analytics",
  "mistake analysis",
  FOUNDER_PROFILE.name,
  "Gazi Mizanur Rahman BCS",
  "career specialist Bangladesh",
  DEVELOPER_PROFILE.name,
  "engrsakib",
  "full-stack developer Bangladesh",
];
