'use client';

import { motion } from 'framer-motion';
import FAQSection from '@/components/FAQSection';
import { useLanguage } from '@/context/LanguageContext';
import { SparklesIcon } from '@heroicons/react/24/outline';
import CTASection from '@/components/CTASection';

export default function FAQPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Header */}
      <section className="relative pt-12 pb-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-4xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-transparent text-[color:var(--text-main)] border border-[color:var(--border-main)] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            >
              <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
              {t("Help Center", "មជ្ឈមណ្ឌលជំនួយ")}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-[color:var(--text-main)] mb-3 tracking-tight"
            >
              {t("How can we", "តើយើងអាច")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">{t("Help you?", "ជួយអ្នកបាន?")}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xl mx-auto leading-relaxed"
            >
              {t(
                "Everything you need to know about our development process, security standards, and technical ecosystem.",
                "អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវដឹងអំពីដំណើរការអភិវឌ្ឍន៍ ស្តង់ដារសុវត្ថិភាព និងប្រព័ន្ធបច្ចេកវិទ្យារបស់យើង។"
              )}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Dynamic FAQ Section */}
      <FAQSection />

      {/* Refined Dynamic CTA Section */}
      <CTASection />
    </div>
  );
}
