import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { DOCS_HOME } from "@/lib/docs/nav-links";

export function AuthDocumentationLink() {
  return (
    <Link
      href={DOCS_HOME}
      className="pressable group mt-4 flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-primary-soft p-4 shadow-sm transition-[border-color,background-color,box-shadow] duration-150 hover:border-primary/35 hover:bg-primary-soft/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        aria-hidden
      >
        <BookOpen className="size-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold text-ink">
          Browse documentation
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink">
          FAQs, exam prep guide, terms & privacy — no login required
        </span>
      </span>
      <ArrowRight
        className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
