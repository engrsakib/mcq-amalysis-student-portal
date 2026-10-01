"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, User, ImageIcon } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { useUserProfile } from "@/components/dashboard/user-profile-provider";
import { AuthIconInput } from "@/components/auth/auth-icon-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  digitsOnly,
  isValidPhone,
  PHONE_DIGIT_COUNT,
  PHONE_LENGTH_ERROR,
} from "@/lib/auth/phone";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileForm() {
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setPhone(profile.phone_number ?? "");
    setEmail(profile.email ?? "");
    setImage(profile.image ?? "");
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError(PHONE_LENGTH_ERROR);
      return;
    }
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone_number: phone,
        email: email.trim() || undefined,
        image: image.trim() || undefined,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (profileLoading && !profile) {
    return (
      <div className="h-64 animate-pulse rounded-2xl bg-primary-soft/40" />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {success ? (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
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
        onChange={(e) => setPhone(digitsOnly(e.target.value))}
        maxLength={PHONE_DIGIT_COUNT}
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
        icon={<ImageIcon className="size-4" />}
        type="url"
        placeholder="Profile image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button
        type="submit"
        className="h-11 w-full bg-primary text-base hover:bg-primary-hover"
        disabled={loading}
      >
        {loading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
