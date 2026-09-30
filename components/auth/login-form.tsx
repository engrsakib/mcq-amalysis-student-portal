"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { loginUser } from "@/lib/api/auth";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthIconInput } from "@/components/auth/auth-icon-input";

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
};

export function LoginForm({
  onSwitchToRegister,
  onSwitchToForgot,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectPath(searchParams.get("redirect"));

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ phone_number: phone, password });
      setAuthCookies(data.access_token, data.refresh_token, rememberMe);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <AuthIconInput
        icon={<Phone className="size-4" />}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        required
      />

      <AuthIconInput
        icon={<Lock className="size-4" />}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        trailing={
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:text-ink"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        }
      />

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(v) => setRememberMe(v === true)}
        />
        <Label
          htmlFor="remember"
          className="text-sm font-normal text-muted-foreground"
        >
          Remember me
        </Label>
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
        disabled={loading}
      >
        {loading ? "Logging in…" : "Login"}
      </Button>

      <p className="text-center text-sm">
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={onSwitchToForgot}
        >
          Forgot Password?
        </button>
      </p>

      <div className="border-t border-line pt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
          onClick={onSwitchToRegister}
        >
          Register
        </button>
      </div>
    </form>
  );
}
