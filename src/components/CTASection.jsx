'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { siteSettingService } from '@/store/siteSettingService';

export default function CTASection() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    siteSettingService.getSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error("Failed to load CTA settings:", err));
  }, []);

  const ctaTitle = t(
    settings?.ctaTitle || "Ready to build something?",
    settings?.ctaTitleKh || "រួចរាល់សម្រាប់ចាប់ផ្ដើមអ្វីមួយហើយឬនៅ?"
  );

  const ctaSubtitle = t(
    settings?.ctaSubtitle || "Message us on Telegram — we reply fast, in Khmer or English. Let's discuss your next project together.",
    settings?.ctaSubtitleKh || "ផ្ញើសារមកយើងតាម Telegram — យើងឆ្លើយតបយ៉ាងរហ័ស ជាភាសាខ្មែរ ឬអង់គ្លេស។ តោះពិភាក្សាអំពីគម្រោងបន្ទាប់របស់អ្នកជាមួយគ្នា។"
  );

  const ctaBtnText = t(
    settings?.ctaBtnText || "Message on Telegram",
    settings?.ctaBtnTextKh || "ផ្ញើសារតាម Telegram"
  );

  const telegramUrl = settings?.telegramUrl || "https://t.me/codebridgee";
  const ctaBtnLink = settings?.ctaBtnLink || telegramUrl;

  return (
    <section className="relative py-16 overflow-hidden z-10">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-[color:var(--text-main)] mb-4 tracking-tight">
            {settings?.ctaTitle ? (
              ctaTitle
            ) : lang === 'kh' ? (
              <>
                រួចរាល់សម្រាប់ <span className="text-gradient-brand">ចាប់ផ្ដើមគម្រោង</span> ហើយឬនៅ?
              </>
            ) : (
              <>
                Ready to Build <span className="text-gradient-brand">Something Great</span>?
              </>
            )}
          </h2>
          
          <p className="text-base sm:text-lg text-[color:var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            {ctaSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={ctaBtnLink.startsWith('http') ? ctaBtnLink : (ctaBtnLink.startsWith('/') ? ctaBtnLink : `https://${ctaBtnLink}`)}
              target={ctaBtnLink.startsWith('http') ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:brightness-110 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTelegramPlane className="text-lg" />
              {ctaBtnText}
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/packages"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 border border-[color:var(--border-main)] bg-[color:var(--bg-main)]/80 backdrop-blur-sm text-[color:var(--text-main)] font-bold rounded-full hover:bg-[color:var(--bg-secondary)] hover:border-[color:var(--color-secondary)] transition-all duration-300 text-sm shadow-sm"
              >
                {t("View Packages", "មើលកញ្ចប់សេវាកម្ម")}
                <ArrowRightIcon className="h-4 w-4 stroke-[2.5]" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
