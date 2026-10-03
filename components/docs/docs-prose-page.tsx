import type { ProseSection } from "@/lib/docs/founder-content";

type DocsProsePageProps = {
  sections: ProseSection[];
  effectiveDate?: string;
};

export function DocsProsePage({ sections, effectiveDate }: DocsProsePageProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      {effectiveDate ? (
        <p className="text-sm font-medium text-ink">
          Effective date: {effectiveDate}
        </p>
      ) : null}
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
          <div className="mt-3 space-y-3">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-ink sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
          {section.bullets?.length ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink sm:text-base">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}
