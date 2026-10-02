"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

type NavListProps = {
  groups: NavGroup[];
  onNavigate?: () => void;
  staggerAnimation?: boolean;
  sheetOpen?: boolean;
  collapsed?: boolean;
};

export function NavList({
  groups,
  onNavigate,
  staggerAnimation = false,
  sheetOpen = true,
  collapsed = false,
}: NavListProps) {
  const pathname = usePathname();
  let itemIndex = 0;

  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.id}>
          <p
            className={cn(
              "mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
              collapsed && "sr-only"
            )}
          >
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isPlayStoreBadge = item.variant === "playStoreBadge";
              const active =
                !item.disabled &&
                !isPlayStoreBadge &&
                (item.activePathPrefix
                  ? pathname.startsWith(item.activePathPrefix)
                  : item.activeExact || item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href));
              const Icon = "icon" in item ? item.icon : undefined;
              const delay = staggerAnimation ? itemIndex * 40 : 0;
              if (staggerAnimation) itemIndex += 1;

              const content = isPlayStoreBadge ? (
                <>
                  <Image
                    src="/playstore.png"
                    alt=""
                    width={48}
                    height={48}
                    aria-hidden
                    className={cn(
                      "shrink-0 object-contain",
                      collapsed ? "size-8" : "size-5"
                    )}
                  />
                  <span
                    className={cn(
                      "transition-opacity duration-150",
                      collapsed && "sr-only opacity-0"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  {Icon ? <Icon className="size-4 shrink-0" /> : null}
                  <span
                    className={cn(
                      "transition-opacity duration-150",
                      collapsed && "sr-only opacity-0"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              );

              const className = cn(
                "pressable flex min-h-11 items-center rounded-lg py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isPlayStoreBadge
                  ? cn(
                      "flex items-center border border-gray-50 bg-gray-50 shadow-sm",
                      "text-muted-foreground hover:border-gray-100 hover:bg-primary-soft/60 hover:text-ink hover:shadow",
                      collapsed ? "justify-center px-2" : "gap-3 px-3"
                    )
                  : cn(
                      collapsed ? "justify-center px-2" : "gap-3 px-3",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-primary-soft/60 hover:text-ink"
                    ),
                item.disabled && "pointer-events-none opacity-50",
                staggerAnimation &&
                  "motion-safe:transition-all motion-safe:duration-300",
                staggerAnimation &&
                  (sheetOpen
                    ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                    : "motion-safe:translate-y-3 motion-safe:opacity-0")
              );

              const style = staggerAnimation
                ? {
                    transitionDelay: sheetOpen ? `${delay}ms` : "0ms",
                  }
                : undefined;

              return (
                <li key={item.id}>
                  {item.disabled ? (
                    <span
                      className={className}
                      style={style}
                      aria-disabled
                      title={collapsed ? item.label : undefined}
                    >
                      {content}
                    </span>
                  ) : isPlayStoreBadge ? (
                    <a
                      href={item.href}
                      className={className}
                      style={style}
                      onClick={onNavigate}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={collapsed ? item.label : undefined}
                    >
                      {content}
                    </a>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      className={className}
                      style={style}
                      onClick={onNavigate}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={collapsed ? item.label : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={className}
                      style={style}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
