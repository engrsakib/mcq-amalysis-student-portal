import { FEATURE_HIGHLIGHTS } from "@/lib/docs/features";

export function DocsFeatureHighlights() {
  return (
    <section aria-labelledby="features-heading" className="space-y-4">
      <div>
        <h2 id="features-heading" className="text-xl font-semibold text-ink">
          Built for serious preparation
        </h2>
        <p className="mt-1 text-sm text-ink">
          Everything you need to practice, compete, and improve.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {FEATURE_HIGHLIGHTS.map((feature) => {
          const Icon = feature.icon;
          return (
            <li
              key={feature.id}
              className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink">
                    {feature.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
