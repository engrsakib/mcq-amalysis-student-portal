"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MobileNavSheet } from "@/components/dashboard/mobile-nav-sheet";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { TokenRefreshGate } from "@/components/auth/token-refresh-gate";
import { dashboardNavGroups } from "@/lib/dashboard/nav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { initials } = useProfileDisplay();

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="flex min-h-svh w-full bg-page">
      <TokenRefreshGate />
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[240px]">
        <div className="flex items-center justify-between border-b border-line bg-card px-4 py-3 lg:hidden">
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
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="MCQ Analysis"
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        </div>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
      <MobileNavSheet
        open={mobileNavOpen}
        onClose={closeMobileNav}
        groups={dashboardNavGroups}
      />
    </div>
  );
}
