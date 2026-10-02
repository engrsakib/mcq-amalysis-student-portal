"use client";

import { FolderTabs, type FolderTabItem } from "@/components/ui/folder-tabs";
import { cn } from "@/lib/utils";

type TabbedFolderViewProps<T extends string> = {
  items: readonly FolderTabItem<T>[];
  value: T;
  onValueChange: (id: T) => void;
  "aria-label"?: string;
  scrollableOnMobile?: boolean;
  className?: string;
  tabsClassName?: string;
  listClassName?: string;
  children: React.ReactNode;
};

export function TabbedFolderView<T extends string>({
  items,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  scrollableOnMobile = false,
  className,
  tabsClassName,
  listClassName,
  children,
}: TabbedFolderViewProps<T>) {
  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      <FolderTabs
        items={items}
        value={value}
        onValueChange={onValueChange}
        aria-label={ariaLabel}
        scrollableOnMobile={scrollableOnMobile}
        className={tabsClassName}
        listClassName={listClassName}
      />
      <section
        role="tabpanel"
        id={`folder-tabpanel-${value}`}
        aria-labelledby={`folder-tab-${value}`}
        className="min-w-0"
      >
        {children}
      </section>
    </div>
  );
}
