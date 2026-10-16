'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { siteSettingService } from '@/store/siteSettingService';
import { getEncryptedHref } from '@/lib/routeCipher';

const MotionLink = motion.create(Link);

export default function Hero() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    siteSettingService.getSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error("Failed to fetch hero settings:", err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const badgeText = t(
    settings?.heroBadge || "We are Bridging Businesses with Technology that Grow Your Business",
    settings?.heroBadgeKh || "យើងកំពុងតភ្ជាប់អាជីវកម្មជាមួយបច្ចេកវិទ្យាដែលជួយពង្រីកអាជីវកម្មរបស់អ្នក"
  );

  const titleText = t(
    settings?.heroTitle || "We Build Digital Solutions That Grow Your Business",
    settings?.heroTitleKh || "យើងកសាងដំណោះស្រាយឌីជីថលដែលជួយពង្រីកអាជីវកម្មរបស់អ្នក"
  );

  const subtitleText = t(
    settings?.heroSubtitle || "CodeBridges crafts modern, fast, and reliable digital experiences for startups and small businesses. Launch quickly and iterate with confidence.",
    settings?.heroSubtitleKh || "CodeBridges បង្កើតបទពិសោធន៍ឌីជីថលទំនើប រហ័ស និងគួរឱ្យទុកចិត្តសម្រាប់អាជីវកម្មថ្មីថ្មោង និងអាជីវកម្មខ្នាតតូច។ បើកដំណើរការបានយ៉ាងរហ័ស និងបន្តអភិវឌ្ឍប្រកបដោយទំនុកចិត្ត។"
  );

  const ctaBtnText = t(
    settings?.heroCtaText || "Get a free quote",
    settings?.heroCtaTextKh || "ទទួលបានការដកស្រង់តម្លៃឥតគិតថ្លៃ"
  );

  const ctaBtnLink = settings?.heroCtaLink || "/contact";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center gap-12 relative z-10">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[color:var(--navbar-text)]/5 border border-[color:var(--navbar-text)]/10 mb-8 backdrop-blur-sm shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-secondary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--color-secondary)]"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-[color:var(--navbar-text)] uppercase tracking-wider">
            {badgeText}
          </span>
        </motion.div>

        <motion.h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 tracking-tight"
          variants={itemVariants}
        >
          <span className="text-gradient-brand">
            {titleText}
          </span>
        </motion.h1>

        <motion.p 
          className="text-base sm:text-lg text-[color:var(--text-muted)] leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
        >
          {subtitleText}
        </motion.p>

        <motion.div 
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          variants={itemVariants}
        >
          <MotionLink 
            href={getEncryptedHref(ctaBtnLink)} 
            className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:brightness-110 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {ctaBtnText} <ArrowRightIcon className="ml-2.5 h-4 w-4 stroke-[2.5]" />
          </MotionLink>

          <MotionLink 
            href={getEncryptedHref('/portfolio')} 
            className="inline-flex items-center justify-center px-6 py-2.5 border border-[color:var(--border-main)] bg-[color:var(--bg-main)]/80 backdrop-blur-sm text-[color:var(--text-main)] font-bold rounded-full hover:bg-[color:var(--bg-secondary)] hover:border-[color:var(--color-secondary)] transition-all duration-300 transform hover:-translate-y-0.5 text-sm shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("See our work", "មើលស្នាដៃរបស់យើង")} <WrenchScrewdriverIcon className="ml-2.5 h-4 w-4" />
          </MotionLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
