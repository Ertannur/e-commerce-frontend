"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthClient } from "./auth-client";
import { type AuthUser, type RegisterRequest } from "./types";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (p: { email: string; password: string }) => Promise<void>;
  register: (p: RegisterRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string, token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const u = AuthClient.getUser();
        
        if (u) {
          // Token süresi kontrolü ve gerekirse refresh
          const refreshSuccess = await AuthClient.attemptTokenRefresh();
          if (refreshSuccess) {
            setUser(AuthClient.getUser());
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async ({ email, password }) => {
      try {
        const result = await AuthClient.login({ email, password });
        setUser(result.user);
      } catch (error) {
        console.error('Login error in context:', error);
        throw error;
      }
    },
    register: async (registerData: RegisterRequest) => {
      try {
        await AuthClient.register(registerData);
      } catch (error) {
        console.error('Register error in context:', error);
        throw error;
      }
    },
    logout: () => {
      AuthClient.logout();
      setUser(null);
    },
    forgotPassword: async (email: string) => {
      try {
        await AuthClient.forgotPassword(email);
      } catch (error) {
        console.error('Forgot password error in context:', error);
        throw error;
      }
    },
    resetPassword: async (email: string, newPassword: string, token: string) => {
      try {
        await AuthClient.resetPassword(email, newPassword, token);
      } catch (error) {
        console.error('Reset password error in context:', error);
        throw error;
      }
    },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}