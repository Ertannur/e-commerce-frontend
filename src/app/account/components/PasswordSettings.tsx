"use client";
import { useState } from 'react';
import { useUser } from '@/lib/user/user-context';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function PasswordSettings() {
  const { changePassword, error, isLoading, clearError } = useUser();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (error) clearError();
    if (success) setSuccess(false);
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 7) {
      errors.push('Şifreniz minimum 7 karakter olmalıdır.');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Şifreniz en az bir sayı içermelidir.');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    clearError();
    setValidationErrors([]);
    setSuccess(false);

    // Validate form
    if (!formData.oldPassword.trim()) {
      setValidationErrors(['Mevcut şifrenizi girin.']);
      return;
    }

    if (!formData.newPassword.trim()) {
      setValidationErrors(['Yeni şifrenizi girin.']);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationErrors(['Yeni şifreler eşleşmiyor.']);
      return;
    }

    // Validate new password
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setValidationErrors(passwordErrors);
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setValidationErrors(['Yeni şifre mevcut şifreyle aynı olamaz.']);
      return;
    }

    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      
      setSuccess(true);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    
    let score = 0;
    if (password.length >= 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { strength: score, text: 'Zayıf', color: 'bg-red-500' };
    if (score <= 3) return { strength: score, text: 'Orta', color: 'bg-yellow-500' };
    if (score <= 4) return { strength: score, text: 'İyi', color: 'bg-blue-500' };
    return { strength: score, text: 'Güçlü', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Şifre Değiştir</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">✅ Şifreniz başarıyla güncellendi!</p>
        </div>
      )}

      {/* Error Messages */}
      {(error || validationErrors.length > 0) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          {error && <p className="text-red-800">❌ {error}</p>}
          {validationErrors.map((err, index) => (
            <p key={index} className="text-red-800">❌ {err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mevcut Şifre <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.old ? 'text' : 'password'}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('old')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.old ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yeni Şifre <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{passwordStrength.text}</span>
              </div>
            </div>
          )}
          
          {/* Password Requirements */}
          <div className="mt-2 text-xs text-gray-500">
            <p>Şifreniz şunları içermelidir:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li className={formData.newPassword.length >= 7 ? 'text-green-600' : ''}>
                Minimum 7 karakter
              </li>
              <li className={/\d/.test(formData.newPassword) ? 'text-green-600' : ''}>
                En az bir sayı
              </li>
            </ul>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yeni Şifre Tekrar <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-1">
              {formData.newPassword === formData.confirmPassword ? (
                <p className="text-xs text-green-600">✓ Şifreler eşleşiyor</p>
              ) : (
                <p className="text-xs text-red-600">✗ Şifreler eşleşmiyor</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir'}
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Güvenlik İpuçları</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Şifrenizi düzenli olarak değiştirin</li>
          <li>• Farklı hesaplarınız için farklı şifreler kullanın</li>
          <li>• Şifrenizi kimseyle paylaşmayın</li>
          <li>• Güçlü şifreler için büyük/küçük harf, sayı ve özel karakter kullanın</li>
        </ul>
      </div>
    </div>
  );
}
