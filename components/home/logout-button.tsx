"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/user";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconOnly?: boolean;
  variant?: "outline" | "destructive";
  fullWidth?: boolean;
};

export function LogoutButton({
  className,
  iconOnly = false,
  variant = "outline",
  fullWidth = false,
}: LogoutButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await logoutUser();
    } catch {
      /* clear local session even if server logout fails */
    } finally {
      clearAuthCookies();
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
      router.refresh();
      setPending(false);
    }
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant={variant}
        size="icon"
        className={cn("mx-auto size-10", fullWidth && "w-full", className)}
        onClick={() => void handleLogout()}
        disabled={pending}
        aria-label="Log out"
        title="Log out"
      >
        <LogOut className="size-4" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("h-10", fullWidth && "w-full", className)}
      onClick={() => void handleLogout()}
      disabled={pending}
    >
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}
