import { apiPatch, apiPost } from "@/lib/api/client";
import type {
  AuthUser,
  ForgetPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenPair,
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

export function requestUserForgetPassword(payload: ForgetPasswordRequest) {
  return apiPost<unknown>("/forget-password/user", payload);
}

export function verifyForgetPasswordOtp(payload: VerifyOtpRequest) {
  return apiPost<null>("/otp/validate/verify", payload);
}

export function resetUserPassword(payload: ResetPasswordRequest) {
  return apiPatch<null>("/user/reset-password", payload);
}

export function refreshUserTokens(payload: RefreshTokenRequest) {
  return apiPost<TokenPair>("/user/refresh-token", payload);
}
