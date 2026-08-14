'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function ResetPasswordForm() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('Passwords do not match', 'ពាក្យសម្ងាត់មិនត្រូវគ្នា'));
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setMessage(data.message);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500 font-bold">{t('Invalid or missing token', 'តំណភ្ជាប់មិនត្រឹមត្រូវ ឬបាត់បង់')}</p>
        <button onClick={() => router.push('/forgot-password')} className="mt-4 text-sm font-bold text-[color:var(--color-primary)]">
          {t('Request new link', 'ស្នើសុំតំណភ្ជាប់ថ្មី')}
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {message && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-semibold border border-emerald-100 italic">
          {message}. {t('Redirecting to login...', 'កំពុងបញ្ជូនទៅកាន់ទំព័រចូល...')}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-semibold border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-[color:var(--text-main)] ml-1 opacity-60 transition-colors duration-300">
          {t('New Password', 'ពាក្យសម្ងាត់ថ្មី')}
        </label>
        <div className="relative group">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-6 py-4 bg-[color:var(--bg-main)]/50 border border-[color:var(--border-main)] rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-bold text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-[color:var(--text-main)] ml-1 opacity-60 transition-colors duration-300">
          {t('Confirm New Password', 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី')}
        </label>
        <input 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-6 py-4 bg-[color:var(--bg-main)]/50 border border-[color:var(--border-main)] rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-bold text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? t('Updating...', 'កំពុងធ្វើបច្ចុប្បន្នភាព...') : t('Update Password', 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់')}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4 bg-[color:var(--bg-main)] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[color:var(--bg-secondary)] p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[color:var(--border-main)] relative overflow-hidden transition-colors duration-500"
      >
        <div className="relative">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-[color:var(--color-primary)] to-[color:var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-[color:var(--text-main)] mb-2 tracking-tight transition-colors duration-300">
              {t('Set New Password', 'កំណត់ពាក្យសម្ងាត់ថ្មី')}
            </h1>
            <p className="text-[color:var(--text-muted)] text-sm font-medium transition-colors duration-300">
              {t('Please enter your new strong password below.', 'សូមបញ្ចូលពាក្យសម្ងាត់ថ្មីរបស់អ្នកខាងក្រោម។')}
            </p>
          </div>

          <Suspense fallback={<div className="text-center font-bold text-[color:var(--text-muted)]">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
