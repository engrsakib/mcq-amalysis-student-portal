import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { authLoginPath, AUTH_REGISTER_PATH } from "@/lib/auth/auth-paths";
import { DOCS_HOME } from "@/lib/docs/nav-links";
import { cn } from "@/lib/utils";

type DocsHeroProps = {
  variant?: "landing" | "page";
  eyebrow?: string;
  title: string;
  subtitle: string;
  breadcrumbLabel?: string;
  className?: string;
};

export function DocsHero({
  variant = "page",
  eyebrow,
  title,
  subtitle,
  breadcrumbLabel,
  className,
}: DocsHeroProps) {
  const isLanding = variant === "landing";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line bg-primary text-white",
        isLanding ? "min-h-[320px]" : "min-h-[200px]",
        className
      )}
    >
      <Image
        src="/exam.avif"
        alt=""
        fill
        className="object-cover object-center opacity-30"
        priority={isLanding}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-hover" />
      <div
        className={cn(
          "relative z-10 mx-auto max-w-6xl px-4",
          isLanding ? "py-12 sm:py-16" : "py-8 sm:py-10"
        )}
      >
        {variant === "page" && breadcrumbLabel ? (
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li>
                <Link href={DOCS_HOME} className="hover:underline">
                  Docs
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page">{breadcrumbLabel}</li>
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-white">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "max-w-3xl font-semibold leading-tight text-white",
            isLanding ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-white sm:text-lg",
            isLanding && "max-w-xl"
          )}
        >
          {subtitle}
        </p>

        {isLanding ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={AUTH_REGISTER_PATH}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full bg-white text-primary hover:bg-primary-soft sm:w-auto sm:px-6"
              )}
            >
              Get started
            </Link>
            <Link
              href={authLoginPath("/exam")}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 w-full border-white bg-primary text-white hover:bg-primary-hover sm:w-auto sm:px-6"
              )}
            >
              Explore exams
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
