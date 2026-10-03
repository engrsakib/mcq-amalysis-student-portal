import Image from "next/image";
import { MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DEVELOPER_PROFILE } from "@/lib/docs/developer-profile-data";
import { cn } from "@/lib/utils";

const SOCIAL_ICON_SIZE = 16;

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
        "h-11 min-w-11 gap-2 px-3 text-ink hover:border-primary/40 hover:bg-primary-soft sm:min-w-0 md:h-10 md:flex-1 md:justify-center md:px-2",
        className
      )}
    >
      {icon}
      <span className="hidden truncate sm:inline">{label}</span>
    </a>
  );
}

export function DeveloperProfile() {
  const p = DEVELOPER_PROFILE;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl ring-2 ring-primary/20 sm:size-32">
          <Image
            src={p.image}
            alt={p.name}
            width={128}
            height={128}
            className="size-full object-cover object-top"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{p.name}</h1>
          <p className="mt-1 text-base font-medium text-primary">{p.title}</p>
          <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-ink sm:justify-start">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
            {p.location}
          </p>
          <div className="mt-4 flex w-full flex-wrap items-stretch justify-center gap-2 sm:justify-start md:flex-nowrap md:gap-1.5">
            <SocialLink
              href={p.website}
              label="Website"
              icon={<SocialIcon src="/search.png" />}
            />
            <SocialLink
              href={p.linkedin}
              label="LinkedIn"
              icon={<SocialIcon src="/linkedin.png" />}
            />
            <SocialLink
              href={p.facebook}
              label="Facebook"
              icon={<SocialIcon src="/fbpage.png" />}
            />
            <SocialLink
              href={p.github}
              label="GitHub"
              icon={<SocialIcon src="/github.png" />}
            />
            <SocialLink
              href={p.leetcode}
              label="LeetCode"
              icon={<SocialIcon src="/leetcode.png" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
