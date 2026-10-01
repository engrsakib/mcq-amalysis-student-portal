"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    clearAuthCookies();
    router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
    router.refresh();
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
