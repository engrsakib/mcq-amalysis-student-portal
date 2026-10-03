import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DOCS_CARD_LINKS } from "@/lib/docs/nav-links";

export function DocsLinkCards() {
  const cards = DOCS_CARD_LINKS.filter((c) => c.id !== "overview");

  return (
    <section aria-labelledby="docs-links-heading" className="space-y-4">
      <div>
        <h2 id="docs-links-heading" className="text-xl font-semibold text-ink">
          Explore documentation
        </h2>
        <p className="mt-1 text-sm text-ink">
          Policies, team info, and answers in one place.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="pressable group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Card className="h-full rounded-2xl border-border/60 bg-card shadow-sm ring-0 transition-colors group-hover:border-primary/30 group-hover:bg-primary-soft/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <ArrowRight
                      className="size-4 text-ink transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                  <CardTitle className="text-base text-ink">{item.label}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-ink">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm font-medium text-primary">Read more</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
