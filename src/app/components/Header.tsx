"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  HeartIcon, // 👈 eklendi
} from "@heroicons/react/24/outline";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm">
      <nav className="space-x-6 text-sm font-medium hidden md:flex">
        <Link href="/products?category=kadin">Kadın</Link>
        <Link href="/products?category=erkek">Erkek</Link>
        <Link href="/products?category=cocuk">Çocuk</Link>
        <Link href="/products?category=outlet">Outlet</Link>
        <Link href="/products?category=recycle">Geri Dönüştür</Link>
      </nav>

      <h1 className="text-xl font-bold">ShopEase</h1>

      <div className="flex items-center gap-4">
        <MagnifyingGlassIcon className="w-5 h-5" />

        {isAuthenticated ? (
          <>
            <Link href="/account" aria-label="Hesabım">
              <UserIcon className="w-5 h-5 cursor-pointer" />
            </Link>
            <button onClick={logout} className="text-sm underline">
              Çıkış
            </button>
          </>
        ) : (
          <Link href="/login" aria-label="Giriş Yap">
            <UserIcon className="w-5 h-5 cursor-pointer" />
          </Link>
        )}

        <Link href="/cart" aria-label="Sepetim">
          <ShoppingCartIcon className="w-5 h-5 cursor-pointer" />
        </Link>
        {/* 👇 Yeni Favoriler ikonu */}
        <Link href="/favorites" aria-label="Favorilerim">
          <HeartIcon className="w-5 h-5 cursor-pointer" />
        </Link>
      </div>
    </header>
  );
}
