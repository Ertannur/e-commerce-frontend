// API Error Handling Utilities

export class AuthError extends Error {
  public statusCode?: number;
  public validationErrors?: Record<string, string[]>;

  constructor(message: string, statusCode?: number, validationErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof AuthError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new AuthError(error.message);
  }
  
  throw new AuthError('Bilinmeyen bir hata oluştu');
};

export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  const errorMessages: string[] = [];
  
  for (const [field, messages] of Object.entries(errors)) {
    errorMessages.push(`${field}: ${messages.join(', ')}`);
  }
  
  return errorMessages.join('\n');
};

// Token süresini kontrol et
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp) return false; // Eğer exp claim'i yoksa token geçersiz sayma
    
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Parse edilemeyen token geçersiz
  }
};

// HTTP interceptor benzeri fonksiyon
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  // Eğer token varsa ve süresi geçmemişse header'a ekle
  if (token && !isTokenExpired(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        // Token süresi geçmiş veya geçersiz
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        throw new AuthError('Oturum süreniz dolmuş, lütfen tekrar giriş yapın', 401);
      }
      
      if (response.status === 400 && errorData.Errors) {
        throw new AuthError(
          'Validation hatası oluştu', 
          400, 
          errorData.Errors
        );
      }
      
      throw new AuthError(
        errorData.message || `HTTP Error: ${response.status}`, 
        response.status
      );
    }
    
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    
    console.error('API request failed:', error);
    throw new AuthError('Ağ hatası oluştu');
  }
};
