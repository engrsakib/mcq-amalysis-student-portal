"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavList } from "@/components/dashboard/nav-list";
import { SidebarUserFooter } from "@/components/dashboard/sidebar-user-footer";
import { dashboardNavGroups } from "@/lib/dashboard/nav";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "dashboard-sidebar-collapsed";

type DashboardSidebarProps = {
  suppressNavScroll?: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function DashboardSidebar({
  suppressNavScroll = false,
  collapsed,
  onToggleCollapsed,
}: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden h-svh flex-col overflow-hidden border-r border-line bg-card lg:flex",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div
        className={cn(
          "flex items-center py-5",
          collapsed ? "justify-center px-2" : "justify-between gap-2 px-4"
        )}
      >
        {!collapsed ? (
          <Link href="/" className="flex min-w-0 flex-1 items-center">
            <Image
              src="/logo.png"
              alt="MCQ Analysis"
              width={320}
              height={120}
              className="h-auto w-full max-w-[200px] object-contain"
              priority
            />
          </Link>
        ) : null}
        <button
          type="button"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-primary-soft hover:text-ink"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={onToggleCollapsed}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>

      <div
        className={cn(
          suppressNavScroll
            ? "min-h-0 flex-1 overflow-hidden"
            : "scroll-pane min-h-0 flex-1 overflow-y-auto",
          collapsed ? "px-1.5" : "px-2"
        )}
      >
        <NavList groups={dashboardNavGroups} collapsed={collapsed} />
      </div>

      <div className={cn("border-t border-line", collapsed ? "p-2" : "p-4")}>
        <SidebarUserFooter collapsed={collapsed} />
      </div>
    </aside>
  );
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed, hydrated]);

  const toggle = () => setCollapsed((value) => !value);

  return { collapsed: hydrated ? collapsed : false, toggle };
}

export const sidebarWidths = {
  expanded: "240px",
  collapsed: "72px",
} as const;
