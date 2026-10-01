import Image from "next/image";
import Link from "next/link";
import { PanelLeftClose, Search } from "lucide-react";
import { NavList } from "@/components/dashboard/nav-list";
import { UserSummary } from "@/components/dashboard/user-summary";
import { LogoutButton } from "@/components/home/logout-button";
import { Input } from "@/components/ui/input";
import { dashboardNavGroups } from "@/lib/dashboard/nav";

type DashboardSidebarProps = {
  /** Exam/content pages: one app scroll region (main only). */
  suppressNavScroll?: boolean;
};

export function DashboardSidebar({
  suppressNavScroll = false,
}: DashboardSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden h-svh w-[240px] flex-col overflow-hidden border-r border-line bg-card lg:flex">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
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
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground hover:bg-primary-soft hover:text-ink"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            placeholder="Search"
            className="h-10 bg-primary-soft/40 pl-9"
            aria-label="Search"
          />
        </div>
      </div>
      <div
        className={
          suppressNavScroll
            ? "min-h-0 flex-1 overflow-hidden px-2"
            : "min-h-0 flex-1 overflow-y-auto px-2"
        }
      >
        <NavList groups={dashboardNavGroups} />
      </div>
      <div className="border-t border-line p-4">
        <div className="mb-3 rounded-xl bg-primary-soft/40 p-2">
          <UserSummary />
        </div>
        <LogoutButton className="w-full" />
      </div>
    </aside>
  );
}
