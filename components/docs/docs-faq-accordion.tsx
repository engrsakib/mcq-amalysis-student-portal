import type { FaqItem } from "@/lib/docs/faq";
import { cn } from "@/lib/utils";

type DocsFaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function DocsFaqAccordion({ items, className }: DocsFaqAccordionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <details
          key={item.id}
          className="group rounded-xl border border-border/60 bg-card shadow-sm open:border-primary/30 open:bg-primary-soft/30"
        >
          <summary className="pressable flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-ink marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              className="text-primary transition-transform group-open:rotate-180"
              aria-hidden
            >
              ▾
            </span>
          </summary>
          <div className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
