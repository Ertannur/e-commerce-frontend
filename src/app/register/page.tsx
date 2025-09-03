"use client";
import Header from "@/app/components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterRequest } from "@/lib/auth/types";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: 0, // 0: Erkek, 1: Kadın
  });
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await register(form);
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      router.push("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert("Kayıt sırasında bir hata oluştu: " + (error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Kayıt Ol</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input 
            type="text" 
            placeholder="Ad" 
            className="w-full border p-3 rounded-md"
            value={form.firstName} 
            onChange={e => setForm({...form, firstName: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Soyad" 
            className="w-full border p-3 rounded-md"
            value={form.lastName} 
            onChange={e => setForm({...form, lastName: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full border p-3 rounded-md"
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})}
            required
          />
          <input 
            type="tel" 
            placeholder="Telefon Numarası (örn: 05050505050)" 
            className="w-full border p-3 rounded-md"
            value={form.phoneNumber} 
            onChange={e => setForm({...form, phoneNumber: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Şifre (min 7 karakter)" 
            className="w-full border p-3 rounded-md"
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})}
            required
          />
          <input 
            type="date" 
            placeholder="Doğum Tarihi" 
            className="w-full border p-3 rounded-md"
            value={form.dateOfBirth} 
            onChange={e => setForm({...form, dateOfBirth: e.target.value})}
            required
          />
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="0" 
                checked={form.gender === 0}
                onChange={e => setForm({...form, gender: parseInt(e.target.value) as 0 | 1})}
                className="mr-2"
              />
              Erkek
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="1" 
                checked={form.gender === 1}
                onChange={e => setForm({...form, gender: parseInt(e.target.value) as 0 | 1})}
                className="mr-2"
              />
              Kadın
            </label>
          </div>
          <button type="submit" disabled={pending}
                  className="w-full bg-black text-white py-3 rounded-md disabled:bg-gray-400">
            {pending ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}