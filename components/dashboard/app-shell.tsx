"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { GlobalSearchModal } from "@/components/search/global-search-modal";
import { SearchProvider, useSearchModal } from "@/components/search/search-provider";
import { AppPageHeader } from "@/components/dashboard/app-page-header";
import {
  DashboardSidebar,
  useSidebarCollapsed,
} from "@/components/dashboard/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { MobileNavSheet } from "@/components/dashboard/mobile-nav-sheet";
import { UserAvatar } from "@/components/dashboard/user-summary";
import { TokenRefreshGate } from "@/components/auth/token-refresh-gate";
import { dashboardNavGroups } from "@/lib/dashboard/nav";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const isExamSessionRoute = /^\/exam\/\d+/.test(pathname);
  const { openSearch, open: searchOpen } = useSearchModal();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { collapsed: sidebarCollapsed, toggle: toggleSidebarCollapsed } =
    useSidebarCollapsed();

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="flex h-svh max-h-svh w-full overflow-hidden bg-page">
      <TokenRefreshGate />
      <DashboardSidebar
        suppressNavScroll={isExamSessionRoute}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
      />
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col transition-[margin] duration-200 ease-out",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line bg-card px-4 py-3 lg:hidden">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-primary-soft"
            onClick={openMobileNav}
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </span>
          </button>
          <div className="flex shrink-0 items-center gap-1.5">
            {!isExamSessionRoute ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 shrink-0"
                aria-label="Search"
                onClick={openSearch}
              >
                <Search className="size-4" />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="relative size-8 shrink-0"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger" />
            </Button>
            <UserAvatar compact />
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!isExamSessionRoute ? (
            <div className="relative z-30 shrink-0 border-b border-gray-100 bg-page">
              <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
                <AppPageHeader />
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              "relative flex min-h-0 min-w-0 flex-1 flex-col",
              searchOpen && "overflow-hidden"
            )}
          >
            <main className="scroll-pane min-h-0 flex-1 overflow-x-hidden overflow-y-auto touch-pan-y">
              <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 px-4 py-4 sm:px-6 sm:py-6">
                {children}
              </div>
            </main>
            <GlobalSearchModal />
          </div>
        </div>
      </div>
      <MobileNavSheet
        open={mobileNavOpen}
        onClose={closeMobileNav}
        groups={dashboardNavGroups}
      />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SearchProvider>
      <AppShellInner>{children}</AppShellInner>
    </SearchProvider>
  );
}
