"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { resendVerificationOtp, verifyUserAccount } from "@/lib/api/auth";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get("phone") ?? "";
  const redirectTo = getSafeRedirectPath(searchParams.get("redirect"));

  const [phone, setPhone] = useState(phoneFromQuery);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const otpNumber = Number(otp.replace(/\D/g, ""));
    if (!phone || otp.replace(/\D/g, "").length !== 6) {
      setError("Enter your phone number and 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyUserAccount({
        phone_number: phone,
        otp: otpNumber,
      });
      setAuthCookies(data.access_token, data.refresh_token, true);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!phone) {
      setError("Enter your phone number first.");
      return;
    }
    setError(null);
    setResending(true);
    try {
      await resendVerificationOtp(phone);
      setMessage("A new verification code was sent to your phone.");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not resend OTP.");
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="verify-phone">Phone number</Label>
        <Input
          id="verify-phone"
          className="h-11 bg-primary-soft/50"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="verify-otp">Verification code</Label>
        <Input
          id="verify-otp"
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
        className="h-11 w-full bg-primary hover:bg-primary-hover"
        disabled={loading}
      >
        {loading ? "Verifying…" : "Verify & continue"}
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
    </form>
  );
}
