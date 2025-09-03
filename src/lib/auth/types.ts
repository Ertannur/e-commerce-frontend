// Backend API Response Types

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 0 | 1; // 0: Erkek, 1: Kadın
  phoneNumber: string;
  roles: string[];
}

export interface Token {
  accessToken: string;
  expiration: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: Token | null;
  user: User | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: 0 | 1;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  token: Token | null;
  user: User | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success?: boolean;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ApiError {
  success: boolean;
  userId?: null;
  message: string;
  token?: null;
  user?: null;
}

export interface ValidationError {
  Message: string;
  Errors: {
    [key: string]: string[];
  };
}

// Auth Client için güncellenmiş User type
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 0 | 1;
  phoneNumber: string;
  roles: string[];
}
