import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlatformStat } from "@/lib/docs/platform-stats";

type DocsStatGridProps = {
  stats: PlatformStat[];
};

export function DocsStatGrid({ stats }: DocsStatGridProps) {
  return (
    <section aria-labelledby="platform-stats-heading" className="space-y-4">
      <div>
        <h2 id="platform-stats-heading" className="text-xl font-semibold text-ink">
          Platform at a glance
        </h2>
        <p className="mt-1 text-sm text-ink">
          Live metrics from our student community and Android release.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            className="rounded-2xl border-border/60 bg-card shadow-sm ring-0"
          >
            <CardHeader className="pb-0">
              <CardDescription className="text-ink">{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold text-primary sm:text-3xl">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-ink sm:text-sm">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
