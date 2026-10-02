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

/** Backdrop + panel fade; keep in sync with Tailwind duration below */
const SHEET_ANIM_MS = 500;

const fadeTransition =
  "transition-opacity duration-500 ease-in-out motion-reduce:transition-none";

export function MobileNavSheet({ open, onClose, groups }: MobileNavSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), SHEET_ANIM_MS);
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
          "absolute inset-0 bg-ink/40",
          fadeTransition,
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl",
          fadeTransition,
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="sticky top-0 z-10 shrink-0 rounded-t-2xl border-b border-line/60 bg-card">
          <button
            type="button"
            className="flex w-full cursor-pointer justify-center py-3 touch-manipulation active:opacity-80"
            aria-label="Close menu"
            onClick={onClose}
          >
            <span className="h-1 w-10 rounded-full bg-line" aria-hidden />
          </button>
        </div>
        <div className="scroll-pane min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y px-4 pb-6 pt-2">
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
            <LogoutButton variant="destructive" fullWidth className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
