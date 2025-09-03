"use client";
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserApiClient, handleUserApiError } from './user-client';
import type { 
  UserProfile, 
  UserContextValue,
  UpdateUserRequest,
  ChangePasswordRequest,
  GetUserByIdResponse
} from './types';

// User State
interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// User Actions
type UserAction = 
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_PROFILE' };

// Initial state
const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Reducer
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_PROFILE':
      return { ...state, profile: null };
    default:
      return state;
  }
}

// Context
const UserContext = createContext<UserContextValue | null>(null);

// Helper function to convert API response to UserProfile
function convertToUserProfile(data: GetUserByIdResponse, roles: string[]): UserProfile {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    roles,
  };
}

// Provider
interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!user || !isAuthenticated) {
      dispatch({ type: 'CLEAR_PROFILE' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('=== loadProfile called ===');
      console.log('Current auth user:', user);

      // Get detailed user info by ID
      const userDetails = await UserApiClient.getUserById(user.id);
      
      // Combine with auth user roles
      const profile = convertToUserProfile(userDetails, user.roles);
      
      console.log('✅ User profile loaded:', profile);
      dispatch({ type: 'SET_PROFILE', payload: profile });
    } catch (error) {
      console.error('❌ Load profile error:', error);
      const apiError = handleUserApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, isAuthenticated]);

  // Update user profile
  const updateProfile = useCallback(async (updateData: Omit<UpdateUserRequest, 'id'>) => {
    if (!user || !state.profile) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated or profile not loaded' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('=== updateProfile called ===');
      console.log('Update data:', updateData);

      const requestData: UpdateUserRequest = {
        id: user.id,
        ...updateData,
      };

      const response = await UserApiClient.updateUser(requestData);
      
      if (response.success) {
        console.log('✅ Profile updated successfully');
        // Reload profile to get updated data
        await loadProfile();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Update profile error:', error);
      const apiError = handleUserApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, state.profile, loadProfile]);

  // Change password
  const changePassword = useCallback(async (passwordData: ChangePasswordRequest) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('=== changePassword called ===');

      const response = await UserApiClient.changePassword(passwordData);
      
      if (response.success) {
        console.log('✅ Password changed successfully');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Change password error:', error);
      const apiError = handleUserApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Auto-load profile when user changes
  useEffect(() => {
    if (isAuthenticated && user && !state.profile) {
      loadProfile();
    } else if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_PROFILE' });
    }
  }, [isAuthenticated, user, state.profile, loadProfile]);

  // Context value
  const value: UserContextValue = {
    profile: state.profile,
    isLoading: state.isLoading,
    error: state.error,
    updateProfile,
    changePassword,
    loadProfile,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
