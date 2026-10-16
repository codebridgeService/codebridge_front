'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  CloudIcon, 
  FingerPrintIcon,
  KeyIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { securityFeatureService } from '@/store/securityFeatureService';

const ICON_MAP = {
  ShieldCheckIcon,
  LockClosedIcon,
  CloudIcon,
  FingerPrintIcon,
  KeyIcon,
  ServerIcon
};

export default function Security() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    securityFeatureService.getFeatures()
      .then(data => {
        const activeData = (data || []).filter(item => item.isActive !== false);
        if (activeData && activeData.length > 0) {
          setFeatures(activeData);
        } else {
          setFeatures([]);
        }
      })
      .catch(err => console.error("Failed to load security features:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-6 overflow-hidden relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[color:var(--bg-main)]/80 border border-[color:var(--border-main)] animate-pulse flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[color:var(--text-main)]/5" />
              <div className="w-3/4 h-3.5 rounded bg-[color:var(--text-main)]/5" />
              <div className="w-full h-10 rounded bg-[color:var(--text-main)]/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (features.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-6 overflow-hidden relative z-10">
      <div className="relative z-10">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--bg-main)]/80 backdrop-blur-sm border border-[color:var(--border-main)] shadow-sm mb-4"
          >
            <ShieldCheckIcon className="h-4 w-4 text-[color:var(--color-primary)]" />
            <span className="text-[10px] sm:text-xs font-black text-[color:var(--text-main)] uppercase tracking-widest">
              {t("Secure Development", "ការអភិវឌ្ឍន៍ប្រកបដោយសុវត្ថិភាព")}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[color:var(--text-main)] tracking-tight mb-3"
          >
            {t("Built for", "បង្កើតឡើងដើម្បី")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">{t("Security", "សុវត្ថិភាព")}</span> {t("& Trust", "& ភាពជឿជាក់")}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[color:var(--text-muted)] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
          >
            {t(
              "We prioritize your data's safety at every stage. From conceptual design to production deployment, security is baked into our DNA.",
              "យើងផ្តល់អាទិភាពដល់សុវត្ថិភាពទិន្នន័យរបស់អ្នកនៅគ្រប់ដំណាក់កាល។ សុវត្ថិភាពគឺជាអាទិភាពចម្បងបំផុតរបស់យើង។"
            )}
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, i) => {
            const IconComp = ICON_MAP[feature.icon] || ShieldCheckIcon;
            const accentColor = feature.color || '#3B82F6';
            return (
              <motion.div 
                key={feature.id || i} 
                variants={itemVariants}
                className="group p-5 rounded-2xl bg-[color:var(--bg-main)]/80 backdrop-blur-sm border border-[color:var(--border-main)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Cyber Corner Accents */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70 pointer-events-none" />

                <div 
                  className="w-12 h-12 rounded-xl p-2.5 mb-4 transition-all duration-300 flex items-center justify-center relative z-10"
                  style={{ backgroundColor: `${accentColor}15` }}
                >
                  <IconComp 
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                    style={{ color: accentColor }}
                  />
                </div>
                <h3 className="text-base font-bold text-[color:var(--text-main)] mb-2">
                  {t(feature.title, feature.titleKh)}
                </h3>
                <p className="text-[color:var(--text-muted)] text-xs leading-relaxed">
                  {t(feature.description, feature.descriptionKh)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enterprise Security Telemetry Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] shadow-xs relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[color:var(--text-main)] uppercase tracking-wider">
                {t("Active Defense Protocols", "ពិធីការការពារសន្តិសុខសកម្ម")}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
              {[
                { label: "AES-256-GCM", desc: t("Encrypted At-Rest", "ទិន្នន័យការពារកម្រិតខ្ពស់"), icon: LockClosedIcon },
                { label: "TLS 1.3 Strict", desc: t("Zero-Degradation", "បញ្ជូនមានសុវត្ថិភាព"), icon: ShieldCheckIcon },
                { label: "Argon2id / JWT", desc: t("Hardened Auth", "ការផ្ទៀងផ្ទាត់តឹងរ៉ឹង"), icon: KeyIcon },
                { label: "OWASP Top 10", desc: t("Automated Shield", "ប្រព័ន្ធការពារស្វ័យប្រវត្តិ"), icon: ServerIcon },
              ].map((proto, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[color:var(--bg-main)] border border-[color:var(--border-main)]/70">
                  <proto.icon className="w-3.5 h-3.5 text-[color:var(--color-primary)] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-[color:var(--text-main)] leading-tight">{proto.label}</span>
                    <span className="text-[8px] font-mono text-[color:var(--text-muted)] leading-tight">{proto.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
