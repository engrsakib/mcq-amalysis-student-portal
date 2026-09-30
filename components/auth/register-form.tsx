"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { registerUser } from "@/lib/api/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthIconInput } from "@/components/auth/auth-icon-input";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6 || password.length > 15) {
      setError("Password must be 6–15 characters.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        phone_number: phone,
        password,
        role: "customer",
        ...(email.trim() ? { email: email.trim() } : {}),
      });
      router.push(`/verify?phone=${encodeURIComponent(phone)}`);
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
    <form onSubmit={handleSubmit} className="space-y-3">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <AuthIconInput
        icon={<User className="size-4" />}
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <AuthIconInput
        icon={<Phone className="size-4" />}
        type="tel"
        inputMode="numeric"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        required
      />
      <AuthIconInput
        icon={<Mail className="size-4" />}
        type="email"
        autoComplete="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthIconInput
        icon={<Lock className="size-4" />}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
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
      <AuthIconInput
        icon={<Lock className="size-4" />}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
        disabled={loading}
      >
        {loading ? "Creating account…" : "Register"}
      </Button>

      <div className="border-t border-line pt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
          onClick={onSwitchToLogin}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
