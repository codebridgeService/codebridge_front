'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function CTASection() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <section className="relative py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[color:var(--bg-main)] transition-colors duration-500" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[color:var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-[color:var(--text-main)] mb-2 tracking-tight">
            {t("Ready to build something?", "រួចរាល់សម្រាប់ចាប់ផ្ដើមបុកអ្វីមួយ?")}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-[color:var(--color-primary)] mb-6">
             {t("Let's Get Started!", "រួចចាប់ផ្តើមមែនទេ?")}
          </p>
          
          <p className="text-lg text-[color:var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Message us on Telegram — we reply fast, in Khmer or English. Let's discuss your next project together.",
              "ផ្ញើសារមកយើងតាម Telegram — យើងឆ្លើយតបយ៉ាងរហ័ស ជាភាសាខ្មែរ ឬអង់គ្លេស។ តោះពិភាក្សាអំពីគម្រោងបន្ទាប់របស់អ្នកជាមួយគ្នា។"
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="https://t.me/codebridgee"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-2.5 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-secondary)] text-white font-bold rounded-full shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTelegramPlane className="text-xl" />
              {t("Message on Telegram", "ផ្ញើសារតាម Telegram")}
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/packages"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 border-2 border-[color:var(--border-main)] text-[color:var(--text-main)] font-bold rounded-full hover:bg-[color:var(--text-main)] hover:text-[color:var(--bg-main)] transition-all duration-300 text-sm"
              >
                {t("View Packages", "មើលកញ្ចប់សេវាកម្ម")}
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
