'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SparklesIcon, ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <div className="h-[100dvh] w-full flex justify-center items-center px-4 overflow-hidden relative">
      {/* Decorative blurred backdrops */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#0050C3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#378ADD]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[color:var(--bg-secondary)] p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[color:var(--border-main)] text-center relative overflow-hidden transition-colors duration-500"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#0050C3]/10 to-[#378ADD]/20 text-[#0050C3] flex items-center justify-center border border-[#0050C3]/20 shadow-sm">
          <SparklesIcon className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-[color:var(--text-main)] mb-3 tracking-tight">
          {t('Direct Agency Engagement', 'ទំនាក់ទំនងផ្ទាល់ជាមួយទីភ្នាក់ងារ')}
        </h1>

        <p className="text-[color:var(--text-muted)] text-sm font-medium leading-relaxed mb-8">
          {t(
            'We work directly with businesses without requiring client portal signups. Get in touch with our engineering team for instant project estimates and consultations.',
            'យើងធ្វើការដោយផ្ទាល់ជាមួយអាជីវកម្មដោយមិនចាំបាច់ចុះឈ្មោះគណនីឡើយ។ សូមទាក់ទងមកកាន់ក្រុមការងារបច្ចេកវិទ្យាយើងខ្ញុំសម្រាប់ការពិគ្រោះយោបល់ និងដកស្រង់តម្លៃគម្រោង។'
          )}
        </p>

        <div className="space-y-3">
          <Link
            href="/contact"
            className="w-full py-3.5 bg-gradient-to-r from-[#0050C3] to-[#378ADD] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>{t('Talk to us / Request Quote', 'សុំការដកស្រង់តម្លៃ / ទាក់ទងយើង')}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full py-3 bg-[color:var(--bg-main)] hover:bg-[color:var(--border-main)]/20 border border-[color:var(--border-main)] text-[color:var(--text-main)] font-semibold rounded-2xl transition-all text-sm flex items-center justify-center"
          >
            {t('Back to Homepage', 'ត្រឡប់ទៅទំព័រដើម')}
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[color:var(--border-main)] flex items-center justify-center gap-2 text-xs text-[color:var(--text-muted)]">
          <LockClosedIcon className="w-3.5 h-3.5" />
          <span>{t('Staff or Admin?', 'បុគ្គលិក ឬអ្នកគ្រប់គ្រង?')}</span>
          <Link href="/login" className="font-bold text-[#0050C3] hover:underline">
            {t('Sign in here', 'ចូលទីនេះ')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
