'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/store/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import TelegramLogin from '@/components/TelegramLogin';

export default function LoginPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);
  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: t('Invalid email format', 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ') }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };
  
  // Check for registration success from URL
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setShowSuccess(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: t('Invalid email address', 'អាសយដ្ឋានអ៊ីមែលមិនត្រឹមត្រូវ') }));
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const data = await authService.login(email, password);
      
      if (data.requiresOTP) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      // Check role and ensure admin access
      if (data.user?.role !== 'admin') {
        await authService.logout();
        setError(t('Access restricted. Administrator privileges required.', 'ការចូលប្រើប្រាស់ត្រូវបានកំណត់។ តម្រូវឱ្យមានសិទ្ធិជាអ្នកគ្រប់គ្រង។'));
        return;
      }

      authService.setSession(data.token, data.user);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex justify-center items-center px-4 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[color:var(--color-primary)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[color:var(--color-secondary)]/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[color:var(--bg-secondary)] p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[color:var(--border-main)] relative overflow-hidden transition-colors duration-500"
      >
        <div className="relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-[color:var(--text-main)] mb-1 tracking-tight transition-colors duration-300">
              {t('Admin Console Login', 'ច្រកចូលអ្នកគ្រប់គ្រង')}
            </h1>
            <p className="text-[color:var(--text-muted)] text-sm font-medium transition-colors duration-300">
              {t('Enter your administrator credentials to access the console.', 'សូមបញ្ចូលគណនីអ្នកគ្រប់គ្រងដើម្បីចូលគ្រប់គ្រងប្រព័ន្ធ។')}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {showSuccess && (
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold border border-green-100 flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {t('Registration successful! Please log in.', 'ការចុះឈ្មោះទទួលបានជោគជ័យ! សូមចូលគណនី។')}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[color:var(--text-main)] ml-1 transition-colors duration-300">
                {t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                onBlur={handleEmailBlur}
                required
                placeholder={t('codebridge2026@gmail.com', 'codebridge2026@gmail.com')}
                className={`w-full px-5 py-3 bg-[color:var(--bg-main)]/50 border ${errors.email ? 'border-red-400 focus:ring-red-400/10' : 'border-[color:var(--border-main)] focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)]'} rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50`}
              />
              {errors.email && (
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-[10px] font-bold ml-1 uppercase">
                  {errors.email}
                </motion.p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1 mr-1">
                <label className="text-sm font-bold text-[color:var(--text-main)] transition-colors duration-300">
                  {t('Password', 'ពាក្យសម្ងាត់')}
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] transition-colors">
                  {t('Forgot password?', 'ភ្លេចពាក្យសម្ងាត់មែនទេ?')}
                </Link>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3 bg-[color:var(--bg-main)]/50 border border-[color:var(--border-main)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium tracking-widest pr-12 text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--color-primary)] transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? t('Signing in...', 'កំពុងចូល...') : t('Sign In as Admin', 'ចូលជាអ្នកគ្រប់គ្រង')}
            </button>
          </form>

          <p className="text-center mt-6 text-sm font-medium text-[color:var(--text-muted)] transition-colors duration-300">
            {t('Looking to start a project?', 'ចង់ចាប់ផ្តើមគម្រោងមែនទេ?')}{' '}
            <Link href="/contact" className="font-bold text-[#0050C3] hover:underline transition-colors">
              {t('Talk to us →', 'ទាក់ទងមកយើង →')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
