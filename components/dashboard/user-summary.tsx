"use client";

import { useUserProfile } from "@/components/dashboard/user-profile-provider";
import {
  getDisplayContact,
  getDisplayName,
  getInitials,
} from "@/lib/user/display";
import { cn } from "@/lib/utils";

type UserSummaryProps = {
  avatarClassName?: string;
  compact?: boolean;
};

export function UserSummary({ avatarClassName, compact }: UserSummaryProps) {
  const { profile, loading } = useUserProfile();
  const name = loading ? "…" : getDisplayName(profile);
  const contact = loading ? "…" : profile ? getDisplayContact(profile) : "—";
  const initials = loading ? "…" : getInitials(getDisplayName(profile));

  return (
    <div className={cn("flex items-center gap-3", compact && "gap-2")}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground",
          compact ? "size-8 text-xs" : "size-9 text-xs",
          avatarClassName
        )}
      >
        {initials}
      </div>
      {!compact ? (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{contact}</p>
        </div>
      ) : null}
    </div>
  );
}

export function useProfileDisplay() {
  const { profile, loading } = useUserProfile();
  const name = getDisplayName(profile);
  return {
    loading,
    name,
    initials: getInitials(name),
    contact: profile ? getDisplayContact(profile) : "—",
  };
}
