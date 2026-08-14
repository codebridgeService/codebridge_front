'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex justify-center items-center px-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[color:var(--bg-secondary)] p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[color:var(--border-main)] relative overflow-hidden transition-colors duration-500"
      >
         {/* Decorative backgrounds */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-[color:var(--color-secondary)]/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative">
          <Link href="/login" className="inline-flex items-center text-xs font-bold text-[color:var(--text-muted)] hover:text-[color:var(--color-primary)] transition-colors mb-6 group">
            <ArrowLeftIcon className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('Back to Login', 'ត្រឡប់ទៅការចូល')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[color:var(--text-main)] mb-2 tracking-tight transition-colors duration-300">
              {t('Forgot Password?', 'ភ្លេចពាក្យសម្ងាត់មែនទេ?')}
            </h1>
            <p className="text-[color:var(--text-muted)] text-sm font-medium leading-relaxed transition-colors duration-300">
              {t('No worries! Enter your email and we\'ll send you a link to reset your password.', 'កុំបារម្ភ! សូមបញ្ចូលអ៊ីមែលរបស់អ្នក ហើយយើងនឹងផ្ញើតំណភ្ជាប់ដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ។')}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-semibold border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-300">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-semibold border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[color:var(--text-main)] ml-1 opacity-60 transition-colors duration-300">
                {t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-6 py-4 bg-[color:var(--bg-main)]/50 border border-[color:var(--border-main)] rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-bold text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center">
                {loading ? t('Processing...', 'កំពុងដំណើរការ...') : t('Send Reset Link', 'ផ្ញើតំណភ្ជាប់កំណត់ឡើងវិញ')}
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
