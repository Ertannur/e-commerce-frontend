"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useChat } from "@/lib/chat/chat-context";
import { type DisplayMessage } from "@/lib/chat/types";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const { 
    state, 
    sendMessage, 
    loadChats, 
    loadAvailableUsers, 
    loadSupportUsers, 
    setCurrentChatUser,
    clearError 
  } = useChat();

  // User role check
  const userRole = useMemo(() => {
    if (!user || !user.roles) return null;
    if (user.roles.includes('Admin')) return 'Admin';
    if (user.roles.includes('Support')) return 'Support';
    if (user.roles.includes('User')) return 'User';
    return null;
  }, [user]);

  // Load available users on open
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    if (userRole === 'Admin' || userRole === 'Support') {
      loadAvailableUsers();
    } else if (userRole === 'User') {
      loadSupportUsers();
    }
  }, [isOpen, isAuthenticated, userRole, loadAvailableUsers, loadSupportUsers]);

  // Auto-select first support user for regular users
  useEffect(() => {
    if (userRole === 'User' && state.supportUsers.length > 0 && !selectedUserId) {
      const firstSupport = state.supportUsers[0];
      
      console.log('=== Auto-selecting first support user ===');
      console.log('User role:', userRole);
      console.log('Support users count:', state.supportUsers.length);
      console.log('Support users:', state.supportUsers);
      console.log('First support user:', firstSupport);
      console.log('Current selectedUserId:', selectedUserId);
      
      setSelectedUserId(firstSupport.id);
      setCurrentChatUser(firstSupport.id);
      loadChats(firstSupport.id);
    }
  }, [userRole, state.supportUsers, selectedUserId, setCurrentChatUser, loadChats]);

  // Transform messages for display
  const displayMessages = useMemo<DisplayMessage[]>(() => {
    if (!user) return [];
    
    return state.messages.map((msg, index) => ({
      id: msg.id || `msg-${index}`,
      from: msg.userId === user.id ? 'user' : 'other',
      text: msg.message,
      timestamp: msg.createdDate || msg.date || new Date().toISOString(),
      userId: msg.userId
    }));
  }, [state.messages, user]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedUserId || !user) return;

    // Guard: prevent sending if supportUsers is empty for regular users
    if (userRole === 'User' && state.supportUsers.length === 0) {
      console.warn('No support users available, cannot send message.');
      return;
    }

    // Debug: Check if selectedUserId exists in the appropriate user list
    const availableUsersList = userRole === 'User' ? state.supportUsers : state.availableUsers;
    const selectedUser = availableUsersList.find(u => u.id === selectedUserId);
    
    console.log('=== SendMessage Debug Info ===');
    console.log('User Role:', userRole);
    console.log('Available Users List:', availableUsersList);
    console.log('Selected User ID:', selectedUserId);
    console.log('Selected User Object:', selectedUser);
    console.log('Support Users:', state.supportUsers);
    console.log('Available Users:', state.availableUsers);
    
    if (!selectedUser) {
      console.error('❌ Selected user not found in user list!', {
        selectedUserId,
        userRole,
        availableCount: availableUsersList.length,
        supportCount: state.supportUsers.length
      });
      return;
    }

    console.log('✅ Selected user validated:', selectedUser);
    console.log('ChatWidget.handleSendMessage called:', {
      input: input.trim(),
      selectedUserId,
      user: { id: user.id, email: user.email }
    });
    
    try {
      await sendMessage(selectedUserId, input);
      setInput("");
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleUserSelect = (userId: string) => {
    console.log('=== User Selection Debug ===');
    console.log('Selected user ID:', userId);
    console.log('User role:', userRole);
    console.log('Support users:', state.supportUsers);
    console.log('Available users:', state.availableUsers);
    
    const userList = userRole === 'User' ? state.supportUsers : state.availableUsers;
    const selectedUser = userList.find(u => u.id === userId);
    console.log('Selected user object:', selectedUser);
    
    setSelectedUserId(userId);
    setCurrentChatUser(userId);
    loadChats(userId);
  };

  // Don't show if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white border rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 flex justify-between items-center">
            <span className="flex items-center gap-2 font-semibold text-sm">
              💬 ShopEase Destek
              {userRole && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {userRole}
                </span>
              )}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition"
            >
              ✕
            </button>
          </div>

          {/* User Selection (for Admin/Support) */}
          {(userRole === 'Admin' || userRole === 'Support') && (
            <div className="p-2 border-b bg-gray-50">
              <select 
                value={selectedUserId || ""}
                onChange={(e) => e.target.value && handleUserSelect(e.target.value)}
                className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Kullanıcı seçin...</option>
                {state.availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Display */}
          {state.error && (
            <div className="p-2 bg-red-50 border-b">
              <div className="flex justify-between items-center">
                <span className="text-red-600 text-xs">{state.error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50">
            {state.isLoading ? (
              <p className="text-gray-400 text-center mt-20">
                Yükleniyor...
              </p>
            ) : displayMessages.length === 0 ? (
              <p className="text-gray-400 text-center mt-20">
                {selectedUserId ? "Henüz mesaj yok" : "Konuşmak için kullanıcı seçin"}
              </p>
            ) : (
              displayMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className={`text-xs mt-1 ${
                    msg.from === "user" ? "text-indigo-100" : "text-gray-500"
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={selectedUserId ? "Mesaj yaz..." : "Önce kullanıcı seçin"}
              disabled={!selectedUserId || state.isLoading}
              className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || !selectedUserId || state.isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gönder
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition"
        >
          💬 Canlı Destek
        </button>
      )}
    </div>
  );
}