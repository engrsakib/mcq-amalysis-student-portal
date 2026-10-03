import Link from "next/link";
import { DOCS_HOME, DOCS_NAV_LINKS } from "@/lib/docs/nav-links";
import { PLAY_STORE_URL } from "@/lib/important-links/play-store";
import { SITE_NAME } from "@/lib/site/metadata";

export function DocsFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-ink">{SITE_NAME}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Student documentation, policies, and platform overview for competitive
            exam preparation.
          </p>
          <Link
            href="/"
            className="pressable mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
          >
            Open student portal
          </Link>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Documentation</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
            {DOCS_NAV_LINKS.map((link) => (
              <li key={link.href} className="min-w-0">
                <Link
                  href={link.href}
                  className="pressable flex min-h-11 w-full items-center text-sm text-ink hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Mobile app</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Practice on Android with quizzes, leaderboard, and mistake analysis.
          </p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
          >
            Get it on Google Play
          </a>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-ink">
        © {year} {SITE_NAME}.{" "}
        <Link href={DOCS_HOME} className="font-medium text-primary hover:underline">
          Docs home
        </Link>
      </div>
    </footer>
  );
}
