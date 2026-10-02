import { cn } from "@/lib/utils";

type MessengerIconProps = {
  className?: string;
  title?: string;
};

/** Facebook Messenger logo (inline SVG). */
export function MessengerIcon({ className, title }: MessengerIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-5 shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.891 1.437 5.477 3.684 7.17V22l3.368-1.85c.898.25 1.848.385 2.948.385 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.016 12.556-2.565-2.736-5.015 2.736 5.515-5.847 2.628 2.736 4.954-2.736-5.517 5.847z" />
    </svg>
  );
}
