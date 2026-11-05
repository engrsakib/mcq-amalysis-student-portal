import { DocsHero } from "@/components/docs/docs-hero";
import { FounderAbout } from "@/components/docs/founder-about";
import { FounderBooksPreview } from "@/components/docs/founder-books-preview";
import { FounderEducation } from "@/components/docs/founder-education";
import { FounderInitiatives } from "@/components/docs/founder-initiatives";
import { FounderMedia } from "@/components/docs/founder-media";
import { FounderProfile } from "@/components/docs/founder-profile";
import { FounderRecognition } from "@/components/docs/founder-recognition";
import { FounderTimeline } from "@/components/docs/founder-timeline";
import { FOUNDER_PROFILE } from "@/lib/docs/founder-profile-data";
import { docsPageMetadata } from "@/lib/docs/metadata";

export const metadata = docsPageMetadata("Founder — Gazi Mizanur Rahman", {
  path: "/docs/founder",
  description:
    "Gazi Mizanur Rahman — BCS cadre, bestselling author, career specialist, and motivational speaker behind MCQ Analysis for exam students in Bangladesh.",
  keywords: [
    "Gazi Mizanur Rahman",
    "BCS Preliminary Analysis",
    "career specialist Bangladesh",
    "MCQ Analysis founder",
    "bestselling author BCS",
  ],
});

export default function DocsFounderPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Founder"
        title="Founder profile"
        subtitle={FOUNDER_PROFILE.title}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:py-12">
        <FounderProfile />
        <FounderAbout />
        <FounderRecognition />
        <FounderTimeline />
        <FounderEducation />
        <FounderMedia />
        <FounderInitiatives />
        <FounderBooksPreview />
      </div>
    </>
  );
}
