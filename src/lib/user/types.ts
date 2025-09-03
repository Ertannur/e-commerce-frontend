// User API Types - Backend entegrasyonu için tip tanımları

// Update User Request
export interface UpdateUserRequest {
  id: string;
  firstName: string;
  gender: 0 | 1; // 0: Erkek, 1: Kadın
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  email: string;
  phoneNumber: string;
  password: string; // Mevcut şifre (doğrulama için gerekli)
}

// Update User Response
export interface UpdateUserResponse {
  success: boolean;
  message: string;
}

// Get User By ID Response
export interface GetUserByIdResponse {
  id: string;
  firstName: string;
  gender: 0 | 1;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  email: string;
  phoneNumber: string;
}

// Change Password Request
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Change Password Response
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Get Current User Response
export interface GetCurrentUserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

// Validation Error Response
export interface ValidationError {
  Message: string;
  Errors: {
    [key: string]: string[];
  };
}

// User API Error
export interface UserApiError {
  message: string;
  status: number;
  errors?: ValidationError['Errors'];
}

// Frontend User Profile State
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: 0 | 1;
  dateOfBirth: string;
  roles: string[];
}

// User Context Value
export interface UserContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Omit<UpdateUserRequest, 'id'>) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}
