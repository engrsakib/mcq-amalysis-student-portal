"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import {
  requestUserForgetPassword,
  resetUserPassword,
  verifyForgetPasswordOtp,
} from "@/lib/api/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthIconInput } from "@/components/auth/auth-icon-input";
import {
  digitsOnly,
  isValidPhone,
  PHONE_DIGIT_COUNT,
  PHONE_LENGTH_ERROR,
} from "@/lib/auth/phone";

type ForgotStep = 1 | 2 | 3;

type ForgotPasswordFormProps = {
  onBackToLogin: () => void;
  onStepChange?: (step: ForgotStep) => void;
};

function apiErrorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    return err.errorMessages?.[0]?.message || err.message;
  }
  return fallback;
}

export function ForgotPasswordForm({
  onBackToLogin,
  onStepChange,
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<ForgotStep>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState(false);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  function goToStep(next: ForgotStep) {
    setError(null);
    setMessage(null);
    setStep(next);
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!isValidPhone(phone)) {
      setError(PHONE_LENGTH_ERROR);
      return;
    }

    setLoading(true);
    try {
      await requestUserForgetPassword({ phone_number: phone });
      goToStep(2);
    } catch (err) {
      setError(apiErrorMessage(err, "Unable to send reset code. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const otpNumber = Number(otp.replace(/\D/g, ""));
    if (otp.replace(/\D/g, "").length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await verifyForgetPasswordOtp({ phone_number: phone, otp: otpNumber });
      goToStep(3);
    } catch (err) {
      setError(apiErrorMessage(err, "Invalid or expired code. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);
    setResending(true);
    try {
      await requestUserForgetPassword({ phone_number: phone });
      setMessage("A new code was sent to your phone.");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not resend code."));
    } finally {
      setResending(false);
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
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

    setLoading(true);
    try {
      await resetUserPassword({ phone_number: phone, password });
      setResetComplete(true);
      setMessage(null);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not reset password. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  function handleDoneBackToLogin() {
    setStep(1);
    setPhone("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setResetComplete(false);
    setError(null);
    setMessage(null);
    onBackToLogin();
  }

  if (resetComplete) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Your password has been reset. You can sign in with your new password.
          </AlertDescription>
        </Alert>
        <Button
          type="button"
          className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
          onClick={handleDoneBackToLogin}
        >
          Back to login
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <form onSubmit={handlePhoneSubmit} className="space-y-4">
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
          onChange={(e) => setPhone(digitsOnly(e.target.value))}
          maxLength={PHONE_DIGIT_COUNT}
          required
        />

        <Button
          type="submit"
          className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
          disabled={loading}
        >
          {loading ? "Sending code…" : "Send reset code"}
        </Button>

        <div className="border-t border-line pt-4 text-center text-sm text-muted-foreground">
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={onBackToLogin}
          >
            Back to login
          </button>
        </div>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {message ? (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          Code sent to {phone}
        </p>

        <div className="space-y-2">
          <Label htmlFor="forgot-otp">Verification code</Label>
          <Input
            id="forgot-otp"
            className="h-11 bg-primary-soft/50 tracking-widest"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
          disabled={loading}
        >
          {loading ? "Verifying…" : "Verify code"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          disabled={resending}
          onClick={handleResend}
        >
          {resending ? "Sending…" : "Resend code"}
        </Button>

        <div className="border-t border-line pt-4 text-center text-sm text-muted-foreground">
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={onBackToLogin}
          >
            Back to login
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetSubmit} className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <AuthIconInput
        icon={<Lock className="size-4" />}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="New password"
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
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
        disabled={loading}
      >
        {loading ? "Updating…" : "Set new password"}
      </Button>

      <div className="border-t border-line pt-4 text-center text-sm text-muted-foreground">
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
          onClick={onBackToLogin}
        >
          Back to login
        </button>
      </div>
    </form>
  );
}
