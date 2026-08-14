'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../store/authService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function VerifyOTPContent() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').substring(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleResend = async () => {
    if (canResend) {
      try {
        setError('');
        await authService.resendOTP(email);
        setTimer(30);
        setCanResend(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const code = otp.join('');
    
    try {
      const data = await authService.verifyOTP(email, code);
      authService.setSession(data.token, data.user, data.refreshToken);
      
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex justify-center items-center px-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[color:var(--color-primary)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[color:var(--color-secondary)]/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[color:var(--bg-secondary)] p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[color:var(--border-main)] relative overflow-hidden transition-colors duration-500"
      >
        <div className="relative">
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-black text-[color:var(--text-main)] mb-1 tracking-tight transition-colors duration-300 ${lang === 'kh' ? 'font-battambang' : ''}`}>
              {t('Verify OTP', 'ផ្ទៀងផ្ទាត់លេខកូដ OTP')}
            </h1>
            <p className={`text-[color:var(--text-muted)] text-sm font-medium transition-colors duration-300 ${lang === 'kh' ? 'font-battambang' : ''}`}>
              {t(
                `Enter the 6-digit code sent to ${email}`,
                `សូមបញ្ចូលលេខកូដ ៦ ខ្ទង់ដែលបានផ្ញើទៅ ${email}`
              )}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-full aspect-square text-center text-xl font-bold rounded-2xl border border-[color:var(--border-main)] bg-[color:var(--bg-main)]/50 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all text-[color:var(--text-main)]"
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={loading || otp.some(d => !d)}
              className="w-full py-3.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? t('Verifying...', 'កំពុងផ្ទៀងផ្ទាត់...') : t('Confirm', 'បញ្ជាក់')}
            </button>

            <div className="flex flex-col items-center space-y-2">
              <p className={`text-xs font-bold text-[color:var(--text-muted)] uppercase tracking-wider transition-colors duration-300 ${lang === 'kh' ? 'font-battambang' : ''}`}>
                {t("Didn't receive the code?", "មិនបានទទួលលេខកូដមែនទេ?")}
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`text-sm font-bold transition-all ${
                  canResend 
                    ? 'text-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] underline underline-offset-4' 
                    : 'text-[color:var(--text-muted)]/50 cursor-not-allowed'
                } ${lang === 'kh' ? 'font-battambang' : ''}`}
              >
                {canResend 
                  ? t('Resend Code', 'ផ្ញើលេខកូដម្តងទៀត') 
                  : `${t('Resend in', 'ផ្ញើម្តងទៀតក្នុងរយៈពេល')} ${timer}s`}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[color:var(--border-main)] text-center transition-colors duration-300">
            <Link 
              href="/login" 
              className={`inline-flex items-center gap-2 text-xs font-bold text-[color:var(--text-muted)] hover:text-[color:var(--color-primary)] transition-colors uppercase tracking-widest ${lang === 'kh' ? 'font-battambang' : ''}`}
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              {t('Back to Login', 'ត្រឡប់ទៅការចូលគណនី')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={null}>
      <VerifyOTPContent />
    </Suspense>
  );
}
