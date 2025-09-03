"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await login({ email, password });
      router.push("/");               // Ana sayfaya yönlendir
    } catch (error) {
      console.error("Login error:", error);
      alert("Giriş sırasında bir hata oluştu: " + (error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Giriş Yap</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input type="email" placeholder="Email" className="w-full border p-3 rounded-md"
                 value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Şifre" className="w-full border p-3 rounded-md"
                 value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" disabled={pending}
                  className="w-full bg-black text-white py-3 rounded-md">
            {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Kayıt Ol
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Şifremi Unuttum
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}