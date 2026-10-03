import { DocsHero } from "@/components/docs/docs-hero";
import { DeveloperCompetitions } from "@/components/docs/developer-competitions";
import { DeveloperEducation } from "@/components/docs/developer-education";
import { DeveloperObjective } from "@/components/docs/developer-objective";
import { DeveloperProfile } from "@/components/docs/developer-profile";
import { DeveloperProjects } from "@/components/docs/developer-projects";
import { DeveloperSkills } from "@/components/docs/developer-skills";
import { DeveloperTelegram } from "@/components/docs/developer-telegram";
import { DeveloperTimeline } from "@/components/docs/developer-timeline";
import { docsPageMetadata } from "@/lib/docs/metadata";

export const metadata = docsPageMetadata("Developer — Md. Nazmus Sakib", {
  path: "/docs/developer",
  description:
    "Meet Md. Nazmus Sakib, AI/ML engineer and full-stack developer behind MCQ Analysis—experience, tech stack, projects, and contact via Telegram.",
  keywords: [
    "MCQ Analysis developer",
    "engrsakib",
    "full-stack developer Bangladesh",
    "AI ML engineer",
    "student portal engineering",
  ],
});

export default function DocsDeveloperPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Developer"
        title="Developer profile"
        subtitle="Engineering MCQ Analysis with scalable backends, AI integrations, and mobile-first student experiences."
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:py-12">
        {/* Mobile: contact right after profile; md+: contact at end */}
        <div className="order-1">
          <DeveloperProfile />
        </div>
        <div className="order-2 md:order-8">
          <DeveloperTelegram />
        </div>
        <div className="order-3 md:order-2">
          <DeveloperObjective />
        </div>
        <div className="order-4 md:order-3">
          <DeveloperTimeline />
        </div>
        <div className="order-5 md:order-4">
          <DeveloperSkills />
        </div>
        <div className="order-6 md:order-5">
          <DeveloperProjects />
        </div>
        <div className="order-7 md:order-6">
          <DeveloperCompetitions />
        </div>
        <div className="order-8 md:order-7">
          <DeveloperEducation />
        </div>
      </div>
    </>
  );
}
