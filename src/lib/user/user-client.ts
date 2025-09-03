import type { 
  UpdateUserRequest, 
  UpdateUserResponse,
  GetUserByIdResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetCurrentUserResponse,
  UserApiError,
  ValidationError
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net';

// Generic API request helper with authentication
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  console.log('=== User API Request ===');
  console.log('URL:', url);
  console.log('Method:', config.method || 'GET');
  console.log('Headers:', config.headers);
  if (config.body) {
    console.log('Body:', config.body);
  }

  try {
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ User API Error Response:', errorText);
      
      // Try to parse as JSON for validation errors
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.Errors) {
          // Validation error
          const validationError: ValidationError = errorJson;
          throw new Error(`Validation Error: ${validationError.Message}`);
        } else if (errorJson.message) {
          // Standard error response
          throw new Error(errorJson.message);
        }
      } catch {
        // Not JSON, use raw text
      }
      
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // Handle empty responses (like some POST endpoints)
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.log('✅ User API Success (no JSON response)');
      return {} as T;
    }

    const responseData = await response.json();
    console.log('✅ User API Success Response:', responseData);
    return responseData;
  } catch (error) {
    console.error(`User API request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const UserApiClient = {
  /**
   * 1. UpdateUser - Kullanıcı bilgilerini güncelle
   * @param userData - Güncellenecek kullanıcı bilgileri
   * @returns Update response
   */
  async updateUser(userData: UpdateUserRequest): Promise<UpdateUserResponse> {
    console.log('UserApiClient.updateUser called with:', userData);
    try {
      const result = await apiRequest<UpdateUserResponse>('/api/User/UpdateUser', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      console.log('UpdateUser result:', result);
      return result;
    } catch (error) {
      console.error('UpdateUser API error:', error);
      throw error;
    }
  },

  /**
   * 2. GetUserById - ID ile kullanıcı bilgilerini getir
   * @param id - Kullanıcı ID'si
   * @returns User bilgileri
   */
  async getUserById(id: string): Promise<GetUserByIdResponse> {
    console.log('UserApiClient.getUserById called with:', id);
    try {
      const result = await apiRequest<GetUserByIdResponse>(`/api/User/GetUserById?id=${id}`);
      console.log('GetUserById result:', result);
      return result;
    } catch (error) {
      console.error('GetUserById API error:', error);
      throw error;
    }
  },

  /**
   * 3. ChangePassword - Kullanıcı şifresini değiştir
   * @param passwordData - Eski ve yeni şifre bilgileri
   * @returns Change password response
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    console.log('UserApiClient.changePassword called');
    try {
      const result = await apiRequest<ChangePasswordResponse>('/api/User/ChangePassword', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });
      console.log('ChangePassword result:', result);
      return result;
    } catch (error) {
      console.error('ChangePassword API error:', error);
      throw error;
    }
  },

  /**
   * 4. GetCurrentUser - Giriş yapmış kullanıcının bilgilerini getir
   * @returns Current user bilgileri
   */
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    console.log('UserApiClient.getCurrentUser called');
    try {
      const result = await apiRequest<GetCurrentUserResponse>('/api/User/GetCurrentUser');
      console.log('GetCurrentUser result:', result);
      return result;
    } catch (error) {
      console.error('GetCurrentUser API error:', error);
      throw error;
    }
  },
};

// Error handling helper
export const handleUserApiError = (error: unknown): UserApiError => {
  if (error instanceof Error) {
    // Check if it's a validation error
    if (error.message.includes('Validation Error:')) {
      return {
        message: error.message,
        status: 400,
      };
    }
    
    return {
      message: error.message,
      status: error.message.includes('401') ? 401 : 
              error.message.includes('403') ? 403 : 
              error.message.includes('404') ? 404 : 500
    };
  }
  
  return {
    message: 'An unknown error occurred',
    status: 500
  };
};
