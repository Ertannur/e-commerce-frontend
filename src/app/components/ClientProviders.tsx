"use client";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ChatProvider } from "@/lib/chat/chat-context";
import { UserProvider } from "@/lib/user/user-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </UserProvider>
    </AuthProvider>
  );
}