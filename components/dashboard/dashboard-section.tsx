import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** First section on the page — skips top border */
  first?: boolean;
};

export function DashboardSection({
  title,
  description,
  children,
  className,
  first = false,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4",
        !first && "border-t border-line/70 pt-8 sm:pt-10",
        className
      )}
    >
      {title || description ? (
        <header className="space-y-1">
          {title ? (
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
