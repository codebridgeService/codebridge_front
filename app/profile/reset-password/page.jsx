'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../store/authService';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      alert(t('Password updated successfully!', 'ពាក្យសម្ងាត់បានផ្លាស់ប្តូរជោគជ័យ!'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
          {t('Reset Password', 'ប្តូរពាក្យសម្ងាត់')}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {t('Secure your account by updating your password.', 'ការពារគណនីរបស់អ្នកដោយប្តូរពាក្យសម្ងាត់ថ្មី។')}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-5 sm:p-6 space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-[color:var(--color-text-dark)] ml-1">
            {t('Current Password', 'ពាក្យសម្ងាត់ចាស់')}
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium tracking-widest text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-[color:var(--color-text-dark)] ml-1">
            {t('New Password', 'ពាក្យសម្ងាត់ថ្មី')}
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium tracking-widest text-sm"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-75"
          >
            {loading ? t('Updating...', 'កំពុងប្តូរ...') : t('Update Password', 'ប្តូរពាក្យសម្ងាត់')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
