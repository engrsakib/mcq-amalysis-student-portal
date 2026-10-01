import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFoundView() {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center bg-page px-4 py-12">
      <main className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          <Image
            src="/404.avif"
            alt="Page not found"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 448px) 100vw, 384px"
          />
        </div>

        <h1 className="mt-6 text-xl font-semibold text-primary">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-11 min-w-[12rem] bg-primary px-6 text-base hover:bg-primary-hover"
            )}
          >
            Go back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
