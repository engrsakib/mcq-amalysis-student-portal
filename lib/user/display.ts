import type { UserProfile } from "@/lib/api/types";

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

export function getDisplayContact(
  profile: Pick<UserProfile, "email" | "phone_number">
): string {
  const email = profile.email?.trim();
  if (email) return email;
  const phone = profile.phone_number?.trim();
  if (phone) return phone;
  return "—";
}

export function getDisplayName(
  profile: Pick<UserProfile, "name"> | null | undefined,
  fallback = "Student"
): string {
  const name = profile?.name?.trim();
  return name || fallback;
}
