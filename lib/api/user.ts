import { apiGetAuth, apiPatchAuth } from "@/lib/api/authorized";
import type { UpdateProfileRequest, UserProfile } from "@/lib/api/types";

export function getCurrentUser() {
  return apiGetAuth<UserProfile>("/user/auth");
}

export function updateUserProfile(payload: UpdateProfileRequest) {
  return apiPatchAuth<UserProfile>("/user/self", payload);
}
