'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PackageCard from "../../components/PackageCard";
import { packageService } from "../../store/packageService";
import { useLanguage } from "../../context/LanguageContext";

export default function AllPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    packageService.getPackages()
      .then(setPackages)
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
    <div className="min-h-screen pt-10 pb-20">
      <section className="max-w-7xl mx-auto px-6">
        {/* Introduction */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-black text-[color:var(--text-main)] mb-6 uppercase tracking-tight transition-colors duration-300">
            {t("Service Packages", "កញ្ចប់សេវាកម្ម")}
          </h1>
          <p className="text-xl text-[color:var(--text-muted)] max-w-3xl mx-auto leading-relaxed font-medium transition-colors duration-300">
            {t(
              "Transparent pricing tailored to your scale. Choose the right path for your digital journey with our curated service plans.",
              "តម្លៃច្បាស់លាស់ស្របតាមទំហំអាជីវកម្មរបស់អ្នក។ ជ្រើសរើសផ្លូវត្រឹមត្រូវសម្រាប់ដំណើរឌីជីថលរបស់អ្នកជាមួយគម្រោងសេវាកម្មរបស់យើង។"
            )}
          </p>
        </motion.div>

        {/* Packages Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <div key={`sk-pkg-all-${i}`} className="w-full h-[500px] bg-[color:var(--bg-secondary)] rounded-[2.5rem] animate-pulse relative overflow-hidden shadow-sm border border-[color:var(--border-main)]">
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
                price: pkg.price,
                description: t(pkg.description, pkg.kh_description) || pkg.description,
                features: lang === 'kh' && pkg.kh_features && pkg.kh_features.length > 0 ? pkg.kh_features : pkg.features
              }} 
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
