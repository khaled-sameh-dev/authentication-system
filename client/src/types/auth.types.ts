export type UserRole = "user" | "admin";

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface AuthData {
  user: IUser;
  accessToken: string;
}

export type RegisterResponse = ApiResponse<AuthData>;
export type LoginResponse = ApiResponse<AuthData>;

export type RefreshTokenResponse = ApiResponse<AuthData>;

export type VerifyEmailResponse = ApiResponse<AuthData>;

export type ResendVerificationResponse = ApiResponse<null>;
export type ForgotPasswordResponse = ApiResponse<null>;
export type ResetPasswordResponse = ApiResponse<null>;
export type ChangePasswordResponse = ApiResponse<null>;

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
