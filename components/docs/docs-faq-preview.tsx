import Link from "next/link";
import { DocsFaqAccordion } from "@/components/docs/docs-faq-accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS, FAQ_PREVIEW_COUNT } from "@/lib/docs/faq";

export function DocsFaqPreview() {
  const preview = FAQ_ITEMS.slice(0, FAQ_PREVIEW_COUNT);

  return (
    <section aria-labelledby="faq-preview-heading" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="faq-preview-heading" className="text-xl font-semibold text-ink">
            Frequently asked questions
          </h2>
          <p className="mt-1 text-sm text-ink">Quick answers before you sign up.</p>
        </div>
        <Link
          href="/docs/faq"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-full px-4 sm:w-auto"
          )}
        >
          View all FAQs
        </Link>
      </div>
      <DocsFaqAccordion items={preview} />
    </section>
  );
}
