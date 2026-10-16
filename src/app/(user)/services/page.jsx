'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/ServiceCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import ServiceList from '@/components/ServiceList';


const MotionLink = motion.create(Link);

export default function ServicesPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Introduction Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] mb-3 transition-colors duration-300">
          {t("Our Core Services", "សេវាកម្មចម្បងរបស់យើង")}
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          {t(
            "We specialize in crafting bespoke digital solutions that drive growth and engagement. Explore our core offerings designed to elevate your business.",
            "យើងជំនាញក្នុងការបង្កើតដំណោះស្រាយឌីជីថលតាមតម្រូវការ ដែលជំរុញការលូតលាស់ និងការចូលរួម។ ស្វែងយល់ពីសេវាកម្មចម្បងរបស់យើងដើម្បីលើកកម្ពស់អាជីវកម្មរបស់អ្នក។"
          )}
        </p>
      </motion.div>

      {/* Services Grid */}
      <ServiceList />

      {/* Call to Action Section */}
      <motion.div
        className="text-center mt-12 bg-transparent p-6 sm:p-8 rounded-2xl border border-[color:var(--border-main)]/70 transition-colors duration-300 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Cyber Corner Accents */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[color:var(--border-main)] opacity-70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[color:var(--border-main)] opacity-70 pointer-events-none" />
        <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-main)] mb-3 transition-colors duration-300">
          {t("Ready to transform your ideas into reality?", "ត្រៀមខ្លួនប្រែក្លាយគំនិតរបស់អ្នកឱ្យក្លាយជាការពិតឬនៅ?")}
        </h2>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] mb-6 max-w-xl mx-auto leading-relaxed transition-colors duration-300">
          {t(
            "Whether you are looking for a new website, a custom app, or a complete system overhaul, our team is ready to help.",
            "មិនថាអ្នកកំពុងស្វែងរកគេហទំព័រថ្មី កម្មវិធីតាមតម្រូវការ ឬការកែលម្អប្រព័ន្ធពេញលេញទេ ក្រុមការងាររបស់យើងត្រៀមខ្លួនជាស្រេចក្នុងការជួយ។"
          )}
        </p>
        <MotionLink 
          href="/contact" 
          className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t("Let's Start Your Project", "តោះចាប់ផ្ដើមគម្រោងរបស់អ្នក")} <ArrowRightIcon className="ml-2 h-4 w-4" />
        </MotionLink>
      </motion.div>
    </section>
  );
}