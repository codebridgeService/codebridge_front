'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'; // Example icon

import { useLanguage } from '../context/LanguageContext';

const MotionLink = motion.create(Link);

export default function Hero() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center gap-12">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[color:var(--navbar-text)]/5 border border-[color:var(--navbar-text)]/10 mb-8 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-secondary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--color-secondary)]"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-[color:var(--navbar-text)] uppercase tracking-wider">
            {t("We are Bridging Businesses with Technology that Grow Your Business", "យើងកំពុងតភ្ជាប់អាជីវកម្មជាមួយបច្ចេកវិទ្យាដែលជួយពង្រីកអាជីវកម្មរបស់អ្នក")}
          </span>
        </motion.div>
        <motion.h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-[color:var(--text-main)] mb-6"
          variants={itemVariants}
        >
          {t("We Build", "យើងកសាង")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] drop-shadow-md brightness-110">{t("Digital Solutions", "ដំណោះស្រាយឌីជីថល")}</span> {t("That Grow Your Business", "ដែលជួយពង្រីកអាជីវកម្មរបស់អ្នក")}
        </motion.h1>
        <motion.p 
          className="text-base sm:text-lg text-[color:var(--text-muted)] leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
        >
          {t(
            "Codebridge crafts modern, fast, and reliable digital experiences for startups and small businesses. Launch quickly and iterate with confidence.",
            "Codebridge បង្កើតបទពិសោធន៍ឌីជីថលទំនើប រហ័ស និងគួរឱ្យទុកចិត្តសម្រាប់អាជីវកម្មថ្មីថ្មោង និងអាជីវកម្មខ្នាតតូច។ បើកដំណើរការបានយ៉ាងរហ័ស និងបន្តអភិវឌ្ឍប្រកបដោយទំនុកចិត្ត។"
          )}
        </motion.p>
        <motion.div 
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          variants={itemVariants}
        >
          <MotionLink 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[color:var(--color-primary)] text-white font-bold rounded-full shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:bg-[color:var(--color-secondary)] transition-all duration-300 transform hover:-translate-y-0.5 text-sm border-2 border-transparent"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("Get a free quote", "ទទួលបានការដកស្រង់តម្លៃឥតគិតថ្លៃ")} <ArrowRightIcon className="ml-3 h-5 w-5" />
          </MotionLink>
          <MotionLink 
            href="/portfolio" 
            className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-[color:var(--navbar-text)]/20 bg-transparent text-[color:var(--text-main)] font-bold rounded-full hover:bg-[color:var(--navbar-text)]/5 hover:border-[color:var(--navbar-text)]/40 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("See our work", "មើលស្នាដៃរបស់យើង")} <WrenchScrewdriverIcon className="ml-3 h-5 w-5" />
          </MotionLink>
        </motion.div>
      </motion.div>

    </section>
  );
}
