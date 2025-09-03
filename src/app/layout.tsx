import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/app/components/ChatWidget";
import ClientProviders from "./components/ClientProviders";

export const metadata: Metadata = {
  title: "ShopEase",
  description: "Modern e-ticaret platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="font-sans bg-white text-gray-900">
        <ClientProviders>
          {children}
          <ChatWidget /> {/* sağ altta çıkacak */}
        </ClientProviders>
      </body>
    </html>
  );
}