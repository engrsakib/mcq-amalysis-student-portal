import Image from "next/image";
import { MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SOCIAL_ICON_SIZE = 16;

export type DocsProfileSocialLink = {
  href: string;
  label: string;
  iconSrc?: string;
  icon?: React.ReactNode;
};

export type DocsProfileHeaderProps = {
  name: string;
  title: string;
  location: string;
  image: string;
  imageAlt?: string;
  socialLinks: DocsProfileSocialLink[];
  headingLevel?: "h1" | "h2";
};

function SocialIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={SOCIAL_ICON_SIZE}
      height={SOCIAL_ICON_SIZE}
      className="size-4 shrink-0 object-contain"
      aria-hidden
    />
  );
}

function SocialLink({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "size-11 shrink-0 p-0 text-ink hover:border-primary/40 hover:bg-primary-soft md:size-10",
        className
      )}
    >
      {icon}
    </a>
  );
}

export function DocsProfileHeader({
  name,
  title,
  location,
  image,
  imageAlt,
  socialLinks,
  headingLevel = "h1",
}: DocsProfileHeaderProps) {
  const Heading = headingLevel;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl ring-2 ring-primary/20 sm:size-32">
          <Image
            src={image}
            alt={imageAlt ?? name}
            width={128}
            height={128}
            className="size-full object-cover object-top"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <Heading className="text-2xl font-semibold text-ink sm:text-3xl">
            {name}
          </Heading>
          <p className="mt-1 text-sm font-medium leading-snug text-primary sm:text-base">
            {title}
          </p>
          <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-ink sm:justify-start">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
            {location}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {socialLinks.map((link) => (
              <SocialLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={
                  link.icon ??
                  (link.iconSrc ? (
                    <SocialIcon src={link.iconSrc} />
                  ) : null)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
