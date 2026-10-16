'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  CommandLineIcon, 
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Prevent scrollbars from appearing on viewport
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-center items-center px-4 overflow-hidden relative font-poppins select-none">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[color:var(--color-primary)]/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[color:var(--color-secondary)]/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

      {/* Main Content Area (Frameless, Transparent, and Centered) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg relative text-center flex flex-col items-center justify-center my-auto"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--bg-main)]/80 border border-[color:var(--border-main)] shadow-xs mb-2 sm:mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[color:var(--text-main)] uppercase tracking-widest">
            SYSTEM ALERT // HTTP 404 NOT FOUND
          </span>
        </div>

        {/* Frameless Floating Illustration */}
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] mb-2 sm:mb-3 flex items-center justify-center"
        >
          <Image
            src="/illustrations/404-animal.svg"
            alt="404 cute animal illustration"
            width={300}
            height={300}
            priority
            className="w-full max-h-[25vh] sm:max-h-[28vh] h-auto object-contain mx-auto select-none pointer-events-none"
          />
        </motion.div>

        {/* Headline & Description */}
        <h1 className={`text-xl sm:text-2xl font-black text-[color:var(--text-main)] tracking-tight mb-1.5 ${lang === 'kh' ? 'font-battambang' : ''}`}>
          {t("Oops! This Page Got Tangled Up", "អូ! ទំព័រនេះរកមិនឃើញឡើយ")}
        </h1>
        <p className={`text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xs sm:max-w-md mx-auto leading-relaxed mb-4 sm:mb-5 ${lang === 'kh' ? 'font-battambang' : ''}`}>
          {t(
            "The URL or resource you requested does not exist, has been migrated, or is tangled up like yarn. Let's get you back on track.",
            "តំណភ្ជាប់ ឬទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានឡើយ ត្រូវបានផ្លាស់ប្តូរទីតាំង ឬរកមិនឃើញក្នុងប្រព័ន្ធ។ សូមត្រឡប់ទៅកាន់ទំព័រដើមវិញ។"
          )}
        </p>

        {/* Action Navigation Buttons */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-1.5 py-2 px-4 sm:py-2.5 sm:px-4.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] hover:opacity-95 text-white font-semibold rounded-lg sm:rounded-xl shadow-xs transition-all text-[11px] sm:text-xs uppercase tracking-wider ${lang === 'kh' ? 'font-battambang' : ''}`}
            >
              <HomeIcon className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>{t("Back to Home", "ត្រឡប់ទៅទំព័រដើម")}</span>
            </motion.div>
          </Link>

          <Link href="/services">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-1.5 py-2 px-4 sm:py-2.5 sm:px-4.5 border border-[color:var(--border-main)] hover:border-[color:var(--color-primary)] bg-[color:var(--bg-main)]/60 hover:bg-[color:var(--bg-main)] text-[color:var(--text-main)] font-semibold rounded-lg sm:rounded-xl shadow-xs transition-all text-[11px] sm:text-xs uppercase tracking-wider ${lang === 'kh' ? 'font-battambang' : ''}`}
            >
              <CommandLineIcon className="h-3.5 w-3.5 stroke-[2.2] text-[color:var(--color-primary)]" />
              <span>{t("Explore Services", "ស្វែងយល់ពីសេវាកម្ម")}</span>
            </motion.div>
          </Link>
        </div>

        {/* Secondary Quick Links */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs">
          <Link 
            href="/docs" 
            className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
          >
            <DocumentTextIcon className="w-3.5 h-3.5" />
            <span>{t("Technical Specs & Docs", "ឯកសារបច្ចេកទេស & Docs")}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

