import { AuthHero } from "@/components/auth/auth-hero";
import { AuthSidebar } from "@/components/auth/auth-sidebar";

export function AuthPageShell() {
  return (
    <div className="flex min-h-svh w-full flex-1 flex-col lg:min-h-svh lg:flex-row">
      {/* Mobile: sidebar first; desktop: hero left (~65%), sidebar right */}
      <aside className="order-1 w-full shrink-0 lg:order-2 lg:h-svh lg:w-[min(100%,420px)] lg:overflow-y-auto">
        <AuthSidebar />
      </aside>
      <section className="relative order-2 h-[280px] w-full shrink-0 lg:order-1 lg:h-auto lg:min-h-svh lg:flex-1">
        <AuthHero />
      </section>
    </div>
  );
}
