"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    token: ""
  });
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // URL parametrelerinden email ve token'ı al
    const email = searchParams.get('email') || "";
    const token = searchParams.get('token') || "";
    setForm(prev => ({ ...prev, email, token }));
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    setPending(true);
    try {
      await resetPassword(form.email, form.newPassword, form.token);
      setSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Şifre sıfırlama sırasında bir hata oluştu: " + (error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Şifre Sıfırla</h1>
        
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Şifreniz başarıyla sıfırlandı! Artık yeni şifrenizle giriş yapabilirsiniz.
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-black text-white py-3 rounded-md"
            >
              Giriş Yap
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="w-full border p-3 rounded-md"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required
              readOnly={!!searchParams.get('email')}
            />
            <input 
              type="password" 
              placeholder="Yeni şifreniz (min 7 karakter)" 
              className="w-full border p-3 rounded-md"
              value={form.newPassword} 
              onChange={e => setForm({...form, newPassword: e.target.value})} 
              required
            />
            <input 
              type="password" 
              placeholder="Yeni şifrenizi tekrar girin" 
              className="w-full border p-3 rounded-md"
              value={form.confirmPassword} 
              onChange={e => setForm({...form, confirmPassword: e.target.value})} 
              required
            />
            <input 
              type="hidden" 
              value={form.token}
            />
            <button 
              type="submit" 
              disabled={pending}
              className="w-full bg-black text-white py-3 rounded-md disabled:bg-gray-400"
            >
              {pending ? "Şifre Sıfırlanıyor..." : "Şifreyi Sıfırla"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-6 py-12">
          <div>Yükleniyor...</div>
        </main>
        <Footer />
      </>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
