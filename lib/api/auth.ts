import { apiPost } from "@/lib/api/client";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
} from "@/lib/api/types";

export function loginUser(payload: LoginRequest) {
  return apiPost<AuthUser>("/user/login", payload);
}

export function registerUser(payload: RegisterRequest) {
  return apiPost<null>("/user", payload);
}

export function verifyUserAccount(payload: VerifyOtpRequest) {
  return apiPost<AuthUser>("/user/verify", payload);
}

export function resendVerificationOtp(phone_number: string) {
  return apiPost<null>("/user/resend-otp", { phone_number });
}
