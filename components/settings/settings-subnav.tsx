"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/settings", label: "Profile" },
  { href: "/settings/change-password", label: "Change password" },
] as const;

export function SettingsSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account settings"
      className="-mx-1 flex gap-1 overflow-x-auto pb-1 scrollbar-none"
    >
      {LINKS.map(({ href, label }) => {
        const active =
          href === "/settings"
            ? pathname === "/settings"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "pressable shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-primary-soft/60 text-muted-foreground hover:bg-primary-soft hover:text-ink"
            )}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
