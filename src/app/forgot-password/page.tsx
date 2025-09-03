"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Şifre sıfırlama sırasında bir hata oluştu: " + (error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Şifremi Unuttum</h1>
        
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              E-posta adresinize şifre sıfırlama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.
            </div>
            <Link 
              href="/login" 
              className="block w-full bg-black text-white py-3 rounded-md text-center"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <p className="text-sm text-gray-600 mb-4">
              E-posta adresinizi girin. Şifre sıfırlama bağlantısını size göndereceğiz.
            </p>
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="w-full border p-3 rounded-md"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
            <button 
              type="submit" 
              disabled={pending}
              className="w-full bg-black text-white py-3 rounded-md disabled:bg-gray-400"
            >
              {pending ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}
        
        <p className="mt-4 text-sm text-gray-600">
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş sayfasına dön
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
