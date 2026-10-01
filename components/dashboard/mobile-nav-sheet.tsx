"use client";

import { useEffect, useState } from "react";
import { NavList } from "@/components/dashboard/nav-list";
import { UserSummary } from "@/components/dashboard/user-summary";
import { LogoutButton } from "@/components/home/logout-button";
import type { NavGroup } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

type MobileNavSheetProps = {
  open: boolean;
  onClose: () => void;
  groups: NavGroup[];
};

const CLOSE_MS = 320;

export function MobileNavSheet({ open, onClose, groups }: MobileNavSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal>
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0"
        )}
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-card pb-6 shadow-xl",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="flex justify-center py-3">
          <span className="h-1 w-10 rounded-full bg-line" aria-hidden />
        </div>
        <div className="px-4">
          <NavList
            groups={groups}
            onNavigate={onClose}
            staggerAnimation
            sheetOpen={visible}
          />
          <div className="mt-6 rounded-xl border border-line bg-primary-soft/30 p-3">
            <UserSummary />
          </div>
          <div className="mt-4">
            <LogoutButton className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
