import { DEVELOPER_PROJECTS } from "@/lib/docs/developer-profile-data";
import { DeveloperSection } from "@/components/docs/developer-section";

export function DeveloperProjects() {
  return (
    <DeveloperSection
      id="projects"
      title="Featured projects"
      description="Enterprise systems and ML pipelines with production-grade architecture."
    >
      <ul className="grid gap-4 lg:grid-cols-2">
        {DEVELOPER_PROJECTS.map((project) => (
          <li
            key={project.id}
            className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink">
              {project.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-line bg-page px-2 py-1 text-xs font-medium text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </DeveloperSection>
  );
}
