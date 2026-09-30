"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    clearAuthCookies();
    router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Log out
    </Button>
  );
}
