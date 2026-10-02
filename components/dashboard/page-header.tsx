"use client";

import { useSyncExternalStore } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const LG_MEDIA = "(min-width: 1024px)";

function subscribeLg(cb: () => void) {
  const mq = window.matchMedia(LG_MEDIA);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getLgSnapshot() {
  return window.matchMedia(LG_MEDIA).matches;
}

function useIsLgUp() {
  return useSyncExternalStore(subscribeLg, getLgSnapshot, () => false);
}

type PageHeaderProps = {
  studentName: string;
  examDate: string;
  initials: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function PageHeader({
  studentName,
  examDate,
  initials,
  onMenuClick,
  showMenuButton = false,
}: PageHeaderProps) {
  const firstName = studentName.split(" ")[0] ?? studentName;
  const isLgUp = useIsLgUp();

  return (
    <header className="flex flex-col gap-4 max-lg:items-center max-lg:text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <div className="flex items-start gap-3 max-lg:flex-col max-lg:items-center">
        {showMenuButton ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-ink" />
              <span className="block h-0.5 w-4 bg-ink" />
              <span className="block h-0.5 w-4 bg-ink" />
            </span>
          </Button>
        ) : null}
        <div>
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-0.5 text-sm font-medium text-primary">
            Next exam: {examDate}
          </p>
        </div>
      </div>
      {isLgUp ? (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger" />
          </Button>
          <div
            className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden
          >
            {initials}
          </div>
        </div>
      ) : null}
    </header>
  );
}
