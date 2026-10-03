import { DocsFaqPreview } from "@/components/docs/docs-faq-preview";
import { DocsFeatureHighlights } from "@/components/docs/docs-feature-highlights";
import { DocsHero } from "@/components/docs/docs-hero";
import { DocsLinkCards } from "@/components/docs/docs-link-cards";
import { DocsStatGrid } from "@/components/docs/docs-stat-grid";
import { docsPageMetadata } from "@/lib/docs/metadata";
import { getPlatformStats } from "@/lib/docs/platform-stats";

export const metadata = docsPageMetadata("Documentation", {
  path: "/docs",
  description:
    "MCQ Analysis documentation for government job and competitive exam preparation—platform overview, FAQs, policies, and team info.",
});

export default async function DocsLandingPage() {
  const stats = await getPlatformStats();

  return (
    <>
      <DocsHero
        variant="landing"
        eyebrow="Student documentation"
        title="Prepare for government jobs and competitive exams with confidence"
        subtitle="MCQ Analysis combines verified past questions, live routines, leaderboard results, and mistake analytics on web and Android—built mobile-first for serious students."
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:py-12">
        <DocsStatGrid stats={stats} />
        <DocsLinkCards />
        <DocsFeatureHighlights />
        <DocsFaqPreview />
      </div>
    </>
  );
}
