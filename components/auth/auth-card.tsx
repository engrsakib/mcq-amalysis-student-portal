"use client";

import { Suspense, useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { cn } from "@/lib/utils";

function LoginFormFallback() {
  return (
    <div className="h-[420px] animate-pulse rounded-lg bg-primary-soft/40" />
  );
}

export function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div
      className={cn(
        "w-full overflow-visible rounded-2xl border border-border/60 bg-card py-6 shadow-lg",
        mode === "login" ? "min-h-[420px]" : "min-h-[560px]"
      )}
    >
      <div className="px-6 pb-2 text-center">
        <h2 className="text-xl font-semibold text-primary">
          {mode === "login" ? "Student Login" : "Create Account"}
        </h2>
      </div>
      <div className="px-6 pt-2">
        {mode === "login" ? (
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm onSwitchToRegister={() => setMode("register")} />
          </Suspense>
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
