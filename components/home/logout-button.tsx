"use client";

import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconOnly?: boolean;
};

export function LogoutButton({ className, iconOnly = false }: LogoutButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    clearAuthCookies();
    router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
    router.refresh();
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("mx-auto size-10", className)}
        onClick={handleLogout}
        aria-label="Log out"
        title="Log out"
      >
        <LogOut className="size-4" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className={cn("h-11", className)}
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
}
