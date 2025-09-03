"use client";

import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { ChatApiClient, handleChatApiError } from './chat-client';
import { 
  type ChatState, 
  type ChatContextValue, 
  type ChatMessage, 
  type ChatUser,
  type SendMessageRequest 
} from './types';
import { useAuth } from '../auth/auth-context';

// Initial State
const initialState: ChatState = {
  messages: [],
  availableUsers: [],
  supportUsers: [],
  currentChatUserId: null,
  isLoading: false,
  error: null,
};

// Actions
type ChatAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_AVAILABLE_USERS'; payload: ChatUser[] }
  | { type: 'SET_SUPPORT_USERS'; payload: ChatUser[] }
  | { type: 'SET_CURRENT_CHAT_USER'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, isLoading: false };
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        isLoading: false 
      };
    case 'SET_AVAILABLE_USERS':
      return { ...state, availableUsers: action.payload, isLoading: false };
    case 'SET_SUPPORT_USERS':
      return { ...state, supportUsers: action.payload, isLoading: false };
    case 'SET_CURRENT_CHAT_USER':
      return { ...state, currentChatUserId: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
};

// Context
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  // Load chats for specific user
  const loadChats = useCallback(async (toUserId: string) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const messages = await ChatApiClient.getChats(toUserId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
      dispatch({ type: 'SET_CURRENT_CHAT_USER', payload: toUserId });
    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user]);

  // Load available users (for Admin/Support)
  const loadAvailableUsers = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    // Sadece Admin ve Support kullanıcıları tüm kullanıcıları görebilir
    const canSeeAllUsers = user.roles.includes('Admin') || user.roles.includes('Support');
    if (!canSeeAllUsers) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const users = await ChatApiClient.getUsers();
      dispatch({ type: 'SET_AVAILABLE_USERS', payload: users });
    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user]);

  // Load support users (for regular Users)
  const loadSupportUsers = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    // Sadece User rolü support kullanıcılarını görebilir
    const isRegularUser = user.roles.includes('User') && 
                          !user.roles.includes('Admin') && 
                          !user.roles.includes('Support');
    
    if (!isRegularUser) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const supportUsers = await ChatApiClient.getSupport();
      dispatch({ type: 'SET_SUPPORT_USERS', payload: supportUsers });
    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (toUserId: string, message: string) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    if (!message.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Message cannot be empty' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const messageData: SendMessageRequest = {
        userId: user.id,
        toUserId: toUserId,
        message: message.trim(),
      };

      await ChatApiClient.sendMessage(messageData);

      // Optimistic update - mesajı hemen ekle
      const newMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        userId: user.id,
        toUserId: toUserId,
        message: message.trim(),
        date: new Date().toISOString(),
        createdDate: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

      // Mesajları yeniden yükle
      setTimeout(() => {
        loadChats(toUserId);
      }, 500);

    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user, loadChats]);

  // Set current chat user
  const setCurrentChatUser = useCallback((userId: string | null) => {
    dispatch({ type: 'SET_CURRENT_CHAT_USER', payload: userId });
    if (!userId) {
      dispatch({ type: 'CLEAR_MESSAGES' });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value = useMemo<ChatContextValue>(() => ({
    state,
    sendMessage,
    loadChats,
    loadAvailableUsers,
    loadSupportUsers,
    setCurrentChatUser,
    clearError,
  }), [
    state,
    sendMessage,
    loadChats,
    loadAvailableUsers,
    loadSupportUsers,
    setCurrentChatUser,
    clearError,
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom Hook
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
