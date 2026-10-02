import { AuthHero } from "@/components/auth/auth-hero";
import { AuthSidebar } from "@/components/auth/auth-sidebar";

export function AuthPageShell() {
  return (
    <div className="scroll-pane flex h-svh min-h-0 w-full flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      {/* Mobile: sidebar first; desktop: hero left (~65%), sidebar right */}
      <aside className="scroll-pane order-1 min-h-svh w-full shrink-0 lg:order-2 lg:h-svh lg:min-h-0 lg:w-[min(100%,420px)] lg:overflow-y-auto">
        <AuthSidebar />
      </aside>
      <section className="relative hidden w-full shrink-0 lg:block lg:order-1 lg:h-auto lg:min-h-svh lg:flex-1">
        <AuthHero />
      </section>
    </div>
  );
}
