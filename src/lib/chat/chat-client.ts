// Chat API Client - Backend entegrasyonu

import { 
  type GetChatsResponse,
  type GetUsersResponse, 
  type GetSupportResponse,
  type SendMessageRequest,
  type ChatApiError 
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net';

// Token'ı localStorage'dan al
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "auth_token");
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
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

  try {
    const response = await fetch(url, config);
    
    // 401 - Unauthorized
    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }
    
    // 403 - Forbidden (role yetki hatası)
    if (response.status === 403) {
      throw new Error('Access denied - Insufficient permissions');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // 200 response ama body yok (SendMessage için)
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const ChatApiClient = {
  /**
   * 1. GetChats - Belirli kullanıcıyla olan chat mesajlarını getir
   * @param toUserId - Mesajlaşılan kullanıcının ID'si
   * @returns Chat mesajları listesi
   */
  async getChats(toUserId: string): Promise<GetChatsResponse> {
    return apiRequest<GetChatsResponse>(`/api/Chat/GetChats?toUserId=${toUserId}`);
  },

  /**
   * 2. GetUsers - Mesajlaşılabilir kullanıcıları getir (Admin/Support için)
   * @returns User listesi
   */
  async getUsers(): Promise<GetUsersResponse> {
    return apiRequest<GetUsersResponse>('/api/Chat/GetUsers');
  },

  /**
   * 3. GetSupport - Müşteri hizmetleri kullanıcılarını getir (User için)
   * @returns Support kullanıcıları listesi
   */
  async getSupport(): Promise<GetSupportResponse> {
    return apiRequest<GetSupportResponse>('/api/Chat/GetSupport');
  },

  /**
   * 4. SendMessage - Mesaj gönder
   * @param messageData - Gönderilecek mesaj bilgileri
   */
  async sendMessage(messageData: SendMessageRequest): Promise<void> {
    await apiRequest<void>('/api/Chat/SendMessage', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// Error handling helper
export const handleChatApiError = (error: unknown): ChatApiError => {
  if (error instanceof Error) {
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
