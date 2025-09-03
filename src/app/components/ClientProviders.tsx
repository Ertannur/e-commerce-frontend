"use client";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ChatProvider } from "@/lib/chat/chat-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AuthProvider>
  );
}