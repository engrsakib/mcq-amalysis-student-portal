export type ApiErrorMessage = {
  path: string;
  message: string;
};

export type ApiSuccessResponse<T> = {
  statusCode: number;
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  statusCode: number;
  success: false;
  message: string;
  errorMessages?: ApiErrorMessage[];
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type AuthUser = {
  _id: string;
  name: string;
  phone_number: string;
  fcmToken?: string;
  image?: string;
  is_Deleted?: boolean;
  email?: string;
  role: string;
  status?: string;
  last_login_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
  access_token: string;
  refresh_token: string;
};

export type LoginRequest = {
  phone_number: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  phone_number: string;
  password: string;
  role: "customer";
  email?: string;
};

export type VerifyOtpRequest = {
  phone_number: string;
  otp: number;
};

export type ForgetPasswordRequest = {
  phone_number: string;
};

export type ResetPasswordRequest = {
  phone_number: string;
  password: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export type UserProfile = {
  _id: string;
  name: string;
  phone_number: string;
  fcmToken?: string;
  image?: string;
  is_Deleted?: boolean;
  email?: string;
  role: string;
  status?: string;
  last_login_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateProfileRequest = {
  name?: string;
  image?: string;
  phone_number?: string;
  email?: string;
};
