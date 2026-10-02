"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LogoutButton } from "@/components/home/logout-button";
import { UserSummary } from "@/components/dashboard/user-summary";
import { cn } from "@/lib/utils";

type SidebarUserFooterProps = {
  collapsed: boolean;
};

export function SidebarUserFooter({ collapsed }: SidebarUserFooterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl bg-primary-soft/40",
        collapsed ? "p-1.5" : "overflow-hidden"
      )}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg text-left transition-colors hover:bg-primary-soft/60",
          collapsed ? "justify-center p-1" : "p-2"
        )}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="sidebar-user-menu"
        aria-label={open ? "Collapse account menu" : "Expand account menu"}
      >
        <div className={cn("min-w-0", !collapsed && "flex-1")}>
          <UserSummary compact={collapsed} />
        </div>
        {!collapsed ? (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        ) : null}
      </button>

      {open ? (
        <div
          id="sidebar-user-menu"
          className={cn(collapsed ? "mt-1.5 px-0 pb-0.5" : "px-2 pb-2 pt-1")}
        >
          <LogoutButton
            variant="destructive"
            fullWidth
            iconOnly={collapsed}
            className={cn(collapsed && "mx-auto size-10 w-full max-w-none")}
          />
        </div>
      ) : null}
    </div>
  );
}
