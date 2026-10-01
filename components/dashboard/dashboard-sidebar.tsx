import Image from "next/image";
import Link from "next/link";
import { PanelLeftClose, Search } from "lucide-react";
import { NavList } from "@/components/dashboard/nav-list";
import { LogoutButton } from "@/components/home/logout-button";
import { Input } from "@/components/ui/input";
import { dashboardNavGroups } from "@/lib/dashboard/nav";

type DashboardSidebarProps = {
  studentName: string;
  studentEmail: string;
  initials: string;
};

export function DashboardSidebar({
  studentName,
  studentEmail,
  initials,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden h-svh w-[240px] shrink-0 flex-col border-r border-line bg-card lg:flex">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="MCQ Analysis"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
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
      <div className="flex-1 overflow-y-auto px-2">
        <NavList groups={dashboardNavGroups} />
      </div>
      <div className="border-t border-line p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-primary-soft/40 p-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{studentName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {studentEmail}
            </p>
          </div>
        </div>
        <LogoutButton className="w-full" />
      </div>
    </aside>
  );
}
