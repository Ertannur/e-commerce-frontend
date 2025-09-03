// Chat API Types - Backend entegrasyonu için tip tanımları

// Chat Message (GetChats response ve SignalR ChatModel)
export interface ChatMessage {
  userId: string;
  toUserId: string;
  date: string;  // Backend'de "date" olarak geliyor
  message: string;
  id?: string;   // REST API'de var, SignalR'da olmayabilir
  createdDate?: string; // REST API'de createdDate var
}

// User info (GetUsers ve GetSupport response)
export interface ChatUser {
  id: string;
  fullName: string;
}

// Send Message Request
export interface SendMessageRequest {
  userId: string;
  toUserId: string;
  message: string;
}

// API Response Types
export type GetChatsResponse = ChatMessage[];
export type GetUsersResponse = ChatUser[];
export type GetSupportResponse = ChatUser[];

// Error Types
export interface ChatApiError {
  message: string;
  status: number;
}

// Frontend State Types
export interface ChatState {
  messages: ChatMessage[];
  availableUsers: ChatUser[];
  supportUsers: ChatUser[];
  currentChatUserId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Message Display Type (frontend için)
export interface DisplayMessage {
  id: string;
  from: 'user' | 'other';
  text: string;
  timestamp: string;
  userId: string;
}

// User Role Types
export type UserRole = 'Admin' | 'User' | 'Support';

// Chat Context Value
export interface ChatContextValue {
  state: ChatState;
  sendMessage: (toUserId: string, message: string) => Promise<void>;
  loadChats: (toUserId: string) => Promise<void>;
  loadAvailableUsers: () => Promise<void>;
  loadSupportUsers: () => Promise<void>;
  setCurrentChatUser: (userId: string | null) => void;
  clearError: () => void;
}
