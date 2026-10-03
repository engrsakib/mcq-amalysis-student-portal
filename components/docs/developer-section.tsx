import { cn } from "@/lib/utils";

type DeveloperSectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function DeveloperSection({
  id,
  title,
  description,
  children,
  className,
}: DeveloperSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28 space-y-4", className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div>
        <h2
          id={id ? `${id}-heading` : undefined}
          className="text-xl font-semibold text-ink sm:text-2xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-ink sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
