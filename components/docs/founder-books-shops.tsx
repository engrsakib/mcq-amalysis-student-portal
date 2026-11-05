import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  FOUNDER_BOOKS,
  FOUNDER_BOOK_SHOPS,
  FOUNDER_PROFILE,
} from "@/lib/docs/founder-profile-data";
import { cn } from "@/lib/utils";

export function FounderBooksShops() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:py-12">
      <Link
        href="/docs/founder"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 gap-2 px-0 text-ink hover:bg-transparent hover:text-primary"
        )}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to founder profile
      </Link>

      <section className="space-y-4" aria-labelledby="founder-books-catalog-heading">
        <div>
          <h2
            id="founder-books-catalog-heading"
            className="text-xl font-semibold text-ink sm:text-2xl"
          >
            Book catalog
          </h2>
          <p className="mt-1 text-sm text-ink sm:text-base">
            Titles by Gazi Mizanur Rahman — open author pages on Rokomari or
            Boiferry for details and purchase options.
          </p>
        </div>
        <ul className="space-y-2">
          {FOUNDER_BOOKS.map((book) => {
            const href = book.href ?? FOUNDER_PROFILE.website;
            return (
              <li key={book.id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary-soft/30 sm:text-base"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <BookOpen
                      className="size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span className="font-medium text-ink">{book.title}</span>
                  </span>
                  <ExternalLink
                    className="size-4 shrink-0 text-ink opacity-60 group-hover:opacity-100"
                    aria-hidden
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="founder-books-shops-heading">
        <div>
          <h2
            id="founder-books-shops-heading"
            className="text-xl font-semibold text-ink sm:text-2xl"
          >
            Online book shops
          </h2>
          <p className="mt-1 text-sm text-ink sm:text-base">
            Cash on delivery and nationwide delivery from trusted Bangladeshi
            retailers.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FOUNDER_BOOK_SHOPS.map((shop) => (
            <a
              key={shop.id}
              href={shop.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto min-h-11 justify-between gap-2 py-3 text-ink hover:border-primary/40 hover:bg-primary-soft"
              )}
            >
              <span>{shop.name}</span>
              <ExternalLink className="size-4 shrink-0 opacity-70" aria-hidden />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
