'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useLanguage } from './context/LanguageContext';

export default function NotFound() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <div className="h-[100dvh] w-full flex justify-center items-center px-4 overflow-hidden relative font-poppins">
      {/* Decorative elements from login/auth pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--color-primary)]/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[color:var(--color-secondary)]/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden text-center"
      >
        <div className="relative flex flex-col items-center">
          {/* 404 Header Area */}
          <div className="mb-8">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] leading-none mb-2">
              404
            </h1>
            <h2 className={`text-xl font-black text-[color:var(--color-text-dark)] tracking-tight ${lang === 'kh' ? 'font-battambang' : ''}`}>
              {t("Oops! Page Not Found", "អូ! រកមិនឃើញទំព័រនេះទេ")}
            </h2>
            <p className={`mt-3 text-[color:var(--color-text-muted-light)] text-sm font-medium px-4 ${lang === 'kh' ? 'font-battambang' : ''}`}>
              {t(
                "The page you're looking for doesn't exist or has been moved.",
                "ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។"
              )}
            </p>
          </div>

          <div className="w-full space-y-3">
            <Link href="/" className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-2xl shadow-lg transition-all text-sm uppercase tracking-widest ${lang === 'kh' ? 'font-battambang' : ''}`}
              >
                <HomeIcon className="h-5 w-5" />
                {t("Back to Home", "ត្រឡប់ទៅទំព័រដើម")}
              </motion.div>
            </Link>
            
            <Link href="/services" className="block text-xs font-bold text-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] transition-colors uppercase tracking-widest pt-2">
              {t("Need help? Explore our services", "ត្រូវការជំនួយ? ស្វែងយល់ពីសេវាកម្មរបស់យើង")}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
