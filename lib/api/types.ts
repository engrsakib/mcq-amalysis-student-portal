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

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type UpcomingExam = {
  _id: string;
  id?: string;
  exam_number: number;
  exam_name: string;
  subject: string;
  exam_date_time: string;
  duration_minutes: number;
  total_marks: number;
  is_started: boolean;
  is_completed: boolean;
  is_published: boolean;
  manual_status_override?: boolean;
  results_published?: boolean;
  is_practice_mode?: boolean;
  completed_at?: string | null;
  negative_mark?: number;
};

export type UpcomingExamsPayload = {
  meta: PaginatedMeta;
  data: UpcomingExam[];
};

export type UserExam = UpcomingExam & {
  isSubmitted?: boolean;
  isLive?: boolean;
};

export type UserExamsPayload = {
  meta: PaginatedMeta;
  data: UserExam[];
};

export type ExamQuestionAnswer = {
  options: string[];
  correctAnswer?: string;
};

export type ExamQuestion = {
  _id: string;
  id?: string;
  questionId: number;
  title: string;
  type: string;
  answerType: string;
  marks: number;
  image_url?: string;
  mathFormula?: string;
  answer: ExamQuestionAnswer;
  options?: string[];
  category_id?: string;
  blanks?: unknown[];
};

export type ExamEntry = UpcomingExam & {
  rank_notifications_sent?: boolean;
  questions: ExamQuestion[];
};

export type ExamQuestionPublic = {
  _id: string;
  questionId: number;
  title: string;
  type: string;
  answerType: string;
  marks: number;
  image_url?: string;
  mathFormula?: string;
  options: string[];
};

export type ExamSessionMeta = {
  _id: string;
  exam_number: number;
  exam_name: string;
  subject: string;
  exam_date_time: string;
  duration_minutes: number;
  total_marks: number;
  is_started: boolean;
  is_completed: boolean;
  is_practice_mode?: boolean;
  negative_mark?: number;
};

export type ExamSessionPayload = {
  exam: ExamSessionMeta;
  questions: ExamQuestionPublic[];
  isPracticeSession: boolean;
};
