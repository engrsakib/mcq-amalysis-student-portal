"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register" | "forgot";

function modeFromSearchParams(modeParam: string | null): AuthMode {
  return modeParam === "register" ? "register" : "login";
}

function LoginFormFallback() {
  return (
    <div className="h-[420px] animate-pulse rounded-lg bg-primary-soft/40" />
  );
}

const FORGOT_TITLES: Record<1 | 2 | 3, string> = {
  1: "Forgot password",
  2: "Verify code",
  3: "Set new password",
};

function AuthCardInner() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() =>
    modeFromSearchParams(searchParams.get("mode"))
  );
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    setMode(modeFromSearchParams(searchParams.get("mode")));
  }, [searchParams]);

  const handleForgotStepChange = useCallback((step: 1 | 2 | 3) => {
    setForgotStep(step);
  }, []);

  const title =
    mode === "login"
      ? "Student Login"
      : mode === "register"
        ? "Create Account"
        : FORGOT_TITLES[forgotStep];

  return (
    <div
      className={cn(
        "w-full overflow-visible rounded-2xl border border-border/60 bg-card py-6 shadow-lg",
        mode === "login" && "min-h-[420px]",
        mode === "register" && "min-h-[500px]",
        mode === "forgot" && "min-h-[480px]"
      )}
    >
      <div className="px-6 pb-2 text-center">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
      </div>
      <div className="px-6 pt-2">
        {mode === "login" ? (
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm
              onSwitchToRegister={() => setMode("register")}
              onSwitchToForgot={() => {
                setForgotStep(1);
                setMode("forgot");
              }}
            />
          </Suspense>
        ) : mode === "register" ? (
          <RegisterForm onSwitchToLogin={() => setMode("login")} />
        ) : (
          <ForgotPasswordForm
            onStepChange={handleForgotStepChange}
            onBackToLogin={() => {
              setForgotStep(1);
              setMode("login");
            }}
          />
        )}
      </div>
    </div>
  );
}

export function AuthCard() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <AuthCardInner />
    </Suspense>
  );
}
