'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTelegramPlane } from 'react-icons/fa';
import PackageCard from '@/components/PackageCard';
import { packageService } from '@/store/packageService';
import { useLanguage } from '@/context/LanguageContext';

export default function AllPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    packageService.getPackages()
      .then(data => {
        const active = (data || []).filter(p => p.isActive !== false);
        setPackages(active);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-12">
      <section className="max-w-7xl mx-auto px-6">
        {/* Introduction */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] mb-3 uppercase tracking-tight transition-colors duration-300">
            {t("Architecture Blueprints", "កញ្ចប់ស្ថាបត្យកម្មប្រព័ន្ធ")}
          </h1>
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xl mx-auto leading-relaxed font-medium transition-colors duration-300">
            {t(
              "Scalable architecture blueprints tailored to your business scale. Every project is unique—connect directly with our engineers to design your custom technology scope.",
              "ប្លង់ស្ថាបត្យកម្មប្រព័ន្ធដែលអាចពង្រីកបានស្របតាមទំហំអាជីវកម្មរបស់អ្នក។ គម្រោងនីមួយៗមានតម្រូវការជាក់ស្ដែងរៀងៗខ្លួន—ពិភាក្សាផ្ទាល់ជាមួយក្រុមវិស្វកររបស់យើងដើម្បីរៀបចំដំណោះស្រាយស័ក្តិសមបំផុត។"
            )}
          </p>
        </motion.div>

        {/* Packages Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <div key={`sk-pkg-all-${i}`} className="w-full h-[420px] bg-[color:var(--bg-main)]/40 border border-[color:var(--border-main)]/60 rounded-2xl animate-pulse relative overflow-hidden shadow-xs">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[color:var(--text-main)]/5 to-transparent" />
              </div>
            ))
          ) : packages.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[color:var(--text-muted)] font-bold text-xl">
              {t("No packages available at the moment.", "មិនមានកញ្ចប់សេវាកម្មនៅឡើយទេ។")}
            </div>
          ) : packages.map((pkg) => (
            <PackageCard 
              key={pkg.id} 
              pkg={{
                ...pkg,
                name: t(pkg.name, pkg.kh_name) || pkg.name,
                description: t(pkg.description, pkg.kh_description) || pkg.description,
                features: lang === 'kh' && pkg.kh_features && pkg.kh_features.length > 0 ? pkg.kh_features : pkg.features
              }} 
            />
          ))}
        </motion.div>

        {/* Direct Consultation Callout */}
        <div className="text-center mt-12 p-6 rounded-2xl bg-transparent border border-[color:var(--border-main)]/60 max-w-2xl mx-auto">
          <h3 className="text-base font-black text-[color:var(--text-main)] mb-1 uppercase tracking-tight">
            {t("Ready to Map Out Your Custom Architecture?", "រួចរាល់ដើម្បីរៀបចំប្លង់ប្រព័ន្ធរបស់អ្នកហើយឬនៅ?")}
          </h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-5 leading-relaxed">
            {t(
              "Every project has unique requirements, security protocols, and infrastructure scale. Message our engineers directly on Telegram to consult on your specific vision.",
              "គម្រោងនីមួយៗមានតម្រូវការជាក់ស្ដែង កម្រិតសុវត្ថិភាព និងទំហំផ្ទុកទិន្នន័យខុសៗគ្នា។ ផ្ញើសារមកកាន់ក្រុមវិស្វកររបស់យើងតាម Telegram ដើម្បីពិភាក្សាអំពីគម្រោងរបស់អ្នក។"
            )}
          </p>
          <a
            href="https://t.me/codebridgee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <FaTelegramPlane className="w-3.5 h-3.5" />
            {t("Discuss With Our Team on Telegram", "ពិភាក្សាជាមួយក្រុមការងារតាម Telegram")}
          </a>
        </div>
      </section>
    </div>
  );
}
