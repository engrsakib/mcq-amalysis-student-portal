import { ExternalLink, Trophy } from "lucide-react";
import { DEVELOPER_COMPETITIONS } from "@/lib/docs/developer-profile-data";
import { DeveloperSection } from "@/components/docs/developer-section";

export function DeveloperCompetitions() {
  return (
    <DeveloperSection
      id="competitive"
      title="Competitive programming"
      description="Problem-solving practice across major platforms."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {DEVELOPER_COMPETITIONS.map((item) => {
          const inner = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Trophy className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">
                  {item.platform}
                </span>
                <span className="mt-0.5 block text-sm text-ink">{item.stat}</span>
              </span>
              {item.href ? (
                <ExternalLink
                  className="size-4 shrink-0 text-primary"
                  aria-hidden
                />
              ) : null}
            </>
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-primary-soft/40"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </DeveloperSection>
  );
}
