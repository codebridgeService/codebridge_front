'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ServiceCard from "../../components/ServiceCard";
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import ServiceList from '../../components/ServiceList';


const MotionLink = motion.create(Link);

export default function ServicesPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Introduction Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-[color:var(--text-main)] mb-6 transition-colors duration-300">
          {t("Our Core Services", "សេវាកម្មចម្បងរបស់យើង")}
        </h1>
        <p className="text-lg text-[color:var(--text-muted)] max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
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
        className="text-center mt-20 bg-[color:var(--bg-secondary)] p-10 rounded-2xl shadow-inner border border-[color:var(--border-main)] transition-colors duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-[color:var(--text-main)] mb-6 transition-colors duration-300">
          {t("Ready to transform your ideas into reality?", "ត្រៀមខ្លួនប្រែក្លាយគំនិតរបស់អ្នកឱ្យក្លាយជាការពិតឬនៅ?")}
        </h2>
        <p className="text-lg text-[color:var(--text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          {t(
            "Whether you are looking for a new website, a custom app, or a complete system overhaul, our team is ready to help.",
            "មិនថាអ្នកកំពុងស្វែងរកគេហទំព័រថ្មី កម្មវិធីតាមតម្រូវការ ឬការកែលម្អប្រព័ន្ធពេញលេញទេ ក្រុមការងាររបស់យើងត្រៀមខ្លួនជាស្រេចក្នុងការជួយ។"
          )}
        </p>
        <MotionLink 
          href="/contact" 
          className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t("Let's Start Your Project", "តោះចាប់ផ្ដើមគម្រោងរបស់អ្នក")} <ArrowRightIcon className="ml-4 h-6 w-6" />
        </MotionLink>
      </motion.div>
    </section>
  );
}