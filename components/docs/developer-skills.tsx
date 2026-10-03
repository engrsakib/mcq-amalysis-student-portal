import { DEVELOPER_SKILL_CATEGORIES } from "@/lib/docs/developer-profile-data";
import { DeveloperSection } from "@/components/docs/developer-section";

export function DeveloperSkills() {
  return (
    <DeveloperSection
      id="skills"
      title="Core skills & tech stack"
      description="Languages, ML, backend systems, and product engineering tools."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {DEVELOPER_SKILL_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-primary">{category.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-ink sm:text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DeveloperSection>
  );
}
