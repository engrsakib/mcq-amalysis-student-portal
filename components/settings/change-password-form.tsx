"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { AuthIconInput } from "@/components/auth/auth-icon-input";
import { ApiError } from "@/lib/api/client";
import { changePassword } from "@/lib/api/user";
import {
  generateStrongPassword,
  getPasswordRequirements,
  getPasswordStrength,
  validatePassword,
} from "@/lib/auth/password-policy";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PasswordToggle({
  visible,
  onToggle,
  label,
}: {
  visible: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="rounded-md p-1 text-muted-foreground hover:text-ink"
      onClick={onToggle}
      aria-label={label}
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

const STRENGTH_BAR_CLASS: Record<number, string> = {
  0: "bg-destructive/70",
  1: "bg-orange-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
  4: "bg-emerald-600",
};

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [touchedNew, setTouchedNew] = useState(false);

  const requirements = useMemo(
    () => getPasswordRequirements(newPassword),
    [newPassword]
  );
  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const passwordsMatch =
    retypePassword.length > 0 && newPassword === retypePassword;
  const retypeMismatch =
    retypePassword.length > 0 && newPassword !== retypePassword;
  const policyOk = validatePassword(newPassword).ok;

  function handleGenerate() {
    const generated = generateStrongPassword(16);
    setNewPassword(generated);
    setRetypePassword(generated);
    setTouchedNew(true);
    setShowNew(true);
    setShowRetype(true);
    setCopied(false);
    setError(null);
    setSuccess(null);
  }

  async function handleCopyGenerated() {
    if (!newPassword) return;
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTouchedNew(true);

    if (!oldPassword.trim()) {
      setError("Enter your current password.");
      return;
    }

    const { ok, reasons } = validatePassword(newPassword);
    if (!ok) {
      setError(reasons[0] ?? "New password does not meet requirements.");
      return;
    }

    if (newPassword !== retypePassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccess("Your password has been updated. Use it the next time you sign in.");
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
      setTouchedNew(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    !loading &&
    oldPassword.length > 0 &&
    policyOk &&
    passwordsMatch &&
    oldPassword !== newPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {success ? (
        <Alert role="status">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <AuthIconInput
        icon={<Lock className="size-4" />}
        type={showOld ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Current password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
        trailing={
          <PasswordToggle
            visible={showOld}
            onToggle={() => setShowOld((v) => !v)}
            label={showOld ? "Hide current password" : "Show current password"}
          />
        }
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-ink">New password</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full gap-2 border-line bg-card sm:w-auto"
            onClick={handleGenerate}
          >
            <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
            Generate strong password
          </Button>
        </div>

        <AuthIconInput
          icon={<KeyRound className="size-4" />}
          type={showNew ? "text" : "password"}
          autoComplete="new-password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setTouchedNew(true);
          }}
          onBlur={() => setTouchedNew(true)}
          required
          aria-describedby="password-strength password-requirements"
          trailing={
            <div className="flex items-center gap-0.5">
              {newPassword ? (
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground hover:text-ink"
                  onClick={handleCopyGenerated}
                  aria-label="Copy new password"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              ) : null}
              <PasswordToggle
                visible={showNew}
                onToggle={() => setShowNew((v) => !v)}
                label={showNew ? "Hide new password" : "Show new password"}
              />
            </div>
          }
        />

        {newPassword ? (
          <div id="password-strength" className="space-y-2" aria-live="polite">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Password strength</span>
              <span
                className={cn(
                  "font-medium",
                  strength.level >= 3 ? "text-emerald-600" : "text-muted-foreground"
                )}
              >
                {strength.label}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-primary-soft"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={strength.percent}
              aria-label={`Password strength: ${strength.label}`}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  STRENGTH_BAR_CLASS[strength.level] ?? STRENGTH_BAR_CLASS[0]
                )}
                style={{ width: `${Math.max(strength.percent, newPassword ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ) : null}

        <ul
          id="password-requirements"
          className="grid gap-1.5 rounded-xl border border-border/60 bg-primary-soft/30 p-3 text-sm"
        >
          {requirements.map((req) => (
            <li
              key={req.id}
              className={cn(
                "flex items-center gap-2",
                req.met ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
              )}
            >
              {req.met ? (
                <Check className="size-4 shrink-0" aria-hidden />
              ) : (
                <X className="size-4 shrink-0 opacity-60" aria-hidden />
              )}
              <span>{req.label}</span>
            </li>
          ))}
        </ul>

        {touchedNew && newPassword && !policyOk ? (
          <p className="text-sm text-destructive" role="alert">
            Fix the items above before saving.
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <AuthIconInput
          icon={<Lock className="size-4" />}
          type={showRetype ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm new password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          required
          aria-invalid={retypeMismatch}
          aria-describedby={retypeMismatch ? "retype-hint" : undefined}
          trailing={
            <PasswordToggle
              visible={showRetype}
              onToggle={() => setShowRetype((v) => !v)}
              label={
                showRetype ? "Hide password confirmation" : "Show password confirmation"
              }
            />
          }
        />
        {passwordsMatch ? (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="size-4 shrink-0" aria-hidden />
            Passwords match
          </p>
        ) : null}
        {retypeMismatch ? (
          <p id="retype-hint" className="text-sm text-destructive" role="alert">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
        disabled={!canSubmit}
      >
        {loading ? "Updating…" : "Update password"}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Use at least 8 characters with uppercase, lowercase, and a special character.
        You will stay signed in on this device after updating.
      </p>
    </form>
  );
}
