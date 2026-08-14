'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../store/authService';

export default function EditProfilePage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (session && session.user) {
      setUser(session.user);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.updateProfile(user.name, user.email);
      // Update local storage with new user info
      const session = authService.getSession();
      authService.setSession(session.token, data.user);
      alert(t('Profile updated successfully!', 'ព័ត៌មានគណនីបានកែប្រែដោយជោគជ័យ!'));
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
          {t('Edit Profile', 'កែប្រែគណនី')}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {t('Update your personal details here.', 'កែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកនៅទីនេះ។')}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-5 sm:p-6 space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-[color:var(--color-text-dark)] ml-1">
            {t('Full Name', 'ឈ្មោះពេញ')}
          </label>
          <input 
            type="text" 
            value={user?.name || ''}
            onChange={(e) => setUser({...user, name: e.target.value})}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-[color:var(--color-text-dark)] ml-1">
            {t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}
          </label>
          <input 
            type="email" 
            value={user?.email || ''}
            onChange={(e) => setUser({...user, email: e.target.value})}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium text-sm"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-75"
          >
            {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : t('Save Changes', 'រក្សាទុកការផ្លាស់ប្តូរ')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
