"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from "@/lib/auth/auth-paths";
import { DOCS_HOME, DOCS_NAV_LINKS } from "@/lib/docs/nav-links";
import { cn } from "@/lib/utils";

export function DocsNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === DOCS_HOME) return pathname === DOCS_HOME;
    return pathname.startsWith(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-card shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href={DOCS_HOME}
          className="pressable flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => setOpen(false)}
        >
          <Image src="/logo.png" alt="" width={32} height={32} className="size-8" />
          <span className="text-sm font-semibold text-ink sm:text-base">
            MCQ Analysis
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Documentation"
        >
          {DOCS_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "pressable rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isActive(link.href)
                  ? "bg-primary-soft text-primary"
                  : "text-ink hover:bg-primary-soft/70"
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href={AUTH_LOGIN_PATH}
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-4")}
          >
            Log in
          </Link>
          <Link
            href={AUTH_REGISTER_PATH}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 bg-primary px-4 hover:bg-primary-hover"
            )}
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="pressable flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line bg-card text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="docs-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="docs-mobile-nav"
          className="border-t border-line bg-card px-4 py-3 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Documentation mobile">
            {DOCS_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pressable min-h-11 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive(link.href)
                    ? "bg-primary-soft text-primary"
                    : "text-ink hover:bg-primary-soft/70"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 sm:hidden">
            <Link
              href={AUTH_LOGIN_PATH}
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 w-full px-4"
              )}
            >
              Log in
            </Link>
            <Link
              href={AUTH_REGISTER_PATH}
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-11 w-full bg-primary px-4 hover:bg-primary-hover"
              )}
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
