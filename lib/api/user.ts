import { apiGetAuth, apiPatchAuth, apiPostAuth } from "@/lib/api/authorized";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from "@/lib/api/types";

export function getCurrentUser() {
  return apiGetAuth<UserProfile>("/user/auth");
}

export function updateUserProfile(payload: UpdateProfileRequest) {
  return apiPatchAuth<UserProfile>("/user/self", payload);
}

export function logoutUser() {
  return apiPostAuth<unknown>("/user/logout", {});
}

/** POST /user/change-password — logged-in user; body: old_password, new_password. */
export function changePassword(payload: ChangePasswordRequest) {
  return apiPostAuth<string>("/user/change-password", payload);
}
