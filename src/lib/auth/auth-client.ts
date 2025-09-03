// Auth Client - Backend API entegrasyonu ile güncellendi

import {
  type AuthUser,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type RefreshTokenResponse,
  type ResetPasswordResponse,
  type ApiError,
  type ValidationError
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net';
const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "auth_token";
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token";
const TOKEN_COOKIE = "auth_token";           // middleware için (şimdilik non-HttpOnly)

export const AuthClient = {
  // Login fonksiyonu - Backend API entegrasyonu
  async login({ email, password }: LoginRequest): Promise<{ token: string; user: AuthUser }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          // Validation error veya kullanıcı bulunamadı hatası
          if (errorData.Errors) {
            const validationError = errorData as ValidationError;
            throw new Error(`Validation Error: ${JSON.stringify(validationError.Errors)}`);
          } else {
            const apiError = errorData as ApiError;
            throw new Error(apiError.message);
          }
        }
        throw new Error('Login failed');
      }

      const data: LoginResponse = await response.json();
      
      if (!data.success || !data.token || !data.user) {
        throw new Error(data.message || 'Login failed');
      }

      // Token'ları kaydet
      AuthClient.setToken(data.token.accessToken);
      AuthClient.setRefreshToken(data.token.refreshToken);

      // User bilgisini AuthUser formatına çevir
      const authUser: AuthUser = {
        id: data.user.userId,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        birthDate: data.user.birthDate,
        gender: data.user.gender,
        phoneNumber: data.user.phoneNumber,
        roles: data.user.roles,
      };

      return { token: data.token.accessToken, user: authUser };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register fonksiyonu - Backend API entegrasyonu
  async register(data: RegisterRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/Register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.Errors) {
            const validationError = errorData as ValidationError;
            throw new Error(`Validation Error: ${JSON.stringify(validationError.Errors)}`);
          }
        }
        throw new Error('Registration failed');
      }

      const result: RegisterResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Refresh token ile giriş
  async refreshTokenLogin(refreshToken: string): Promise<{ token: string; user: AuthUser }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/RefreshTokenLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const apiError = errorData as ApiError;
          throw new Error(apiError.message);
        }
        throw new Error('Refresh token login failed');
      }

      const data: RefreshTokenResponse = await response.json();
      
      if (!data.success || !data.token || !data.user) {
        throw new Error(data.message || 'Refresh token login failed');
      }

      // Token'ları güncelle
      AuthClient.setToken(data.token.accessToken);
      AuthClient.setRefreshToken(data.token.refreshToken);

      // User bilgisini AuthUser formatına çevir
      const authUser: AuthUser = {
        id: data.user.userId,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        birthDate: data.user.birthDate,
        gender: data.user.gender,
        phoneNumber: data.user.phoneNumber,
        roles: data.user.roles,
      };

      return { token: data.token.accessToken, user: authUser };
    } catch (error) {
      console.error('Refresh token login error:', error);
      throw error;
    }
  },

  // Forgot password fonksiyonu
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/ForgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const apiError = errorData as ApiError;
          throw new Error(apiError.message);
        }
        throw new Error('Forgot password request failed');
      }

      // 200 OK response - işlem başarılı
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password fonksiyonu
  async resetPassword(email: string, newPassword: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/ResetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, token }),
      });

      if (!response.ok) {
        throw new Error('Reset password failed');
      }

      const data: ResetPasswordResponse = await response.json();
      console.log('Password reset successful:', data.message);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  logout() {
    AuthClient.clearToken();
    AuthClient.clearRefreshToken();
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    // middleware ile koruma örneği için cookie de yazıyoruz (HttpOnly DEĞİL — sadece demo)
    document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60}; SameSite=Lax`;
  },

  clearToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  },

  // Refresh Token yönetimi
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(refreshToken: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearRefreshToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!AuthClient.getToken();
  },

  // JWT decode edip kullanıcı bilgisi çıkar
  getUser(): AuthUser | null {
    const token = AuthClient.getToken();
    if (!token) return null;
    
    try {
      // JWT decode et
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Token süresini kontrol et
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Token süresi geçmiş, temizle
        AuthClient.logout();
        return null;
      }

      // Backend'den gelen JWT payload'ından user bilgisini çıkar
      return {
        id: payload.sub || payload.userId || "unknown",
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.email || "unknown@example.com",
        firstName: payload.firstName || "",
        lastName: payload.lastName || "",
        birthDate: payload.birthDate || "",
        gender: payload.gender || 0,
        phoneNumber: payload.phoneNumber || "",
        roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ? 
          [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']] : 
          (payload.roles || [])
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Otomatik token yenileme
  async attemptTokenRefresh(): Promise<boolean> {
    const refreshToken = AuthClient.getRefreshToken();
    if (!refreshToken) return false;

    try {
      await AuthClient.refreshTokenLogin(refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      AuthClient.logout(); // Refresh token da geçersizse tamamen çıkış yap
      return false;
    }
  }
};