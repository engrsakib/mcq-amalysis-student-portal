"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser, updateUserProfile } from "@/lib/api/user";
import { ensureValidAccessToken } from "@/lib/auth/session";
import type { UpdateProfileRequest, UserProfile } from "@/lib/api/types";

type UserProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<UserProfile>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await ensureValidAccessToken();
      const user = await getCurrentUser();
      setProfile(user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load profile.");
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateProfile = useCallback(async (payload: UpdateProfileRequest) => {
    setError(null);
    const updated = await updateUserProfile(payload);
    setProfile(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({ profile, loading, error, refresh, updateProfile }),
    [profile, loading, error, refresh, updateProfile]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}
