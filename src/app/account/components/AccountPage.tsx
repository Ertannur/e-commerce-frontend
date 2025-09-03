"use client";
import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useUser } from '@/lib/user/user-context';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProfileSettings from './ProfileSettings';
import PasswordSettings from './PasswordSettings';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const { isAuthenticated, user } = useAuth();
  const { profile, isLoading } = useUser();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hesap Ayarları
                </h1>
                <p className="text-gray-600">
                  {user?.firstName} {user?.lastName} • {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Bilgiler yükleniyor...</p>
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${ 
                      activeTab === 'profile'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    Profil Bilgileri
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'password'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    Şifre Değiştir
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && profile && (
                  <ProfileSettings profile={profile} />
                )}
                {activeTab === 'password' && (
                  <PasswordSettings />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
