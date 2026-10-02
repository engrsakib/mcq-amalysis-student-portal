import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ContentEmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
};

export function ContentEmptyState({
  title,
  description,
  icon: Icon,
  className,
}: ContentEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-10 text-center sm:py-14",
        className
      )}
    >
      {Icon ? (
        <div
          className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary"
          aria-hidden
        >
          <Icon className="size-6" />
        </div>
      ) : null}
      <p className="text-sm font-medium text-ink sm:text-base">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
