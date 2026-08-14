'use client';

import { motion } from 'framer-motion';
import { ShieldCheckIcon, LockClosedIcon, CloudIcon, FingerPrintIcon } from '@heroicons/react/24/outline';

const securityFeatures = [
  {
    title: "End-to-End Encryption",
    description: "Your data is secured using industry-standard AES-256 encryption protocols during transit and at rest.",
    icon: LockClosedIcon,
  },
  {
    title: "Secure Cloud Infrastructure",
    description: "Leveraging globally distributed, enterprise-grade cloud servers with 99.9% uptime and DDoS protection.",
    icon: CloudIcon,
  },
  {
    title: "Privacy by Design",
    description: "Built-in compliance with data protection regulations ensuring your user information remains private.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Continuous Monitoring",
    description: "24/7 security auditing and automated patch management to stay ahead of emerging threats.",
    icon: FingerPrintIcon,
  }
];

import { useLanguage } from '../context/LanguageContext';

export default function Security() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const securityFeatures = [
    {
      title: t("End-to-End Encryption", "ការបំប្លែងកូដពីចុងម្ខាងទៅចុងម្ខាង"),
      description: t(
        "Your data is secured using industry-standard AES-256 encryption protocols during transit and at rest.",
        "ទិន្នន័យរបស់អ្នកត្រូវបានធានាសុវត្ថិភាពដោយប្រើពិធីការបំប្លែងកូដ AES-256 ស្តង់ដារឧស្សាហកម្ម។"
      ),
      icon: LockClosedIcon,
      color: "#3B82F6", // Blue
    },
    {
      title: t("Secure Cloud Infrastructure", "ហេដ្ឋារចនាសម្ព័ន្ធក្លោតប្រកបដោយសុវត្ថិភាព"),
      description: t(
        "Leveraging globally distributed, enterprise-grade cloud servers with 99.9% uptime and DDoS protection.",
        "ប្រើប្រាស់ម៉ាស៊ីនមេក្លោតកម្រិតសហគ្រាស ជាមួយនឹងពេលវេលាដំណើរការ 99.9% និងការការពារ DDoS ។"
      ),
      icon: CloudIcon,
      color: "#6366F1", // Indigo
    },
    {
      title: t("Privacy by Design", "ឯកជនភាពតាមរយៈការរចនា"),
      description: t(
        "Built-in compliance with data protection regulations ensuring your user information remains private.",
        "ការអនុលោមតាមបទប្បញ្ញត្តិការពារទិន្នន័យដែលធានាថាព័ត៌មានអ្នកប្រើប្រាស់នៅតែជាឯកជន។"
      ),
      icon: ShieldCheckIcon,
      color: "#A855F7", // Purple
    },
    {
      title: t("Continuous Monitoring", "ការត្រួតពិនិត្យជាបន្តបន្ទាប់"),
      description: t(
        "24/7 security auditing and automated patch management to stay ahead of emerging threats.",
        "ការត្រួតពិនិត្យសុវត្ថិភាព 24/7 និងការគ្រប់គ្រងបំណះដោយស្វ័យប្រវត្តិ ដើម្បីការពារការគំរាមកំហែង។"
      ),
      icon: FingerPrintIcon,
      color: "#F59E0B", // Amber
    }
  ];

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-10 overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[color:var(--color-primary)]/5 rounded-full blur-3xl -mr-48 -mt-48" />
      
      <div className="relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[color:var(--bg-navbar)] border border-[color:var(--border-main)] shadow-sm mb-6"
          >
            <ShieldCheckIcon className="h-5 w-5 text-[color:var(--color-primary)]" />
            <span className="text-xs font-black text-[color:var(--text-main)] uppercase tracking-widest">{t("Secure Development", "ការអភិវឌ្ឍន៍ប្រកបដោយសុវត្ថិភាព")}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-[color:var(--text-main)] tracking-tight mb-6"
          >
            {t("Built for", "បង្កើតឡើងដើម្បី")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">{t("Security", "សុវត្ថិភាព")}</span> {t("& Trust", "& ភាពជឿជាក់")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[color:var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              "We prioritize your data's safety at every stage. From conceptual design to production deployment, security is baked into our DNA.",
              "យើងផ្តល់អាទិភាពដល់សុវត្ថិភាពទិន្នន័យរបស់អ្នកនៅគ្រប់ដំណាក់កាល។ សុវត្ថិភាពគឺជាអាទិភាពចម្បងបំផុតរបស់យើង។"
            )}
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {securityFeatures.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-[color:var(--bg-navbar)] border border-[color:var(--border-main)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative"
            >
              <div 
                className="absolute top-8 w-16 h-16 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                style={{ backgroundColor: feature.color }}
              />
              
              <div 
                className="w-16 h-16 rounded-2xl p-4 mb-6 transition-all duration-300 flex items-center justify-center relative z-10"
                style={{ backgroundColor: `${feature.color}10` }} // 10% opacity
              >
                <feature.icon 
                  className="w-full h-full transition-colors duration-300"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-lg font-bold text-[color:var(--text-main)] mb-3">{feature.title}</h3>
              <p className="text-[color:var(--text-muted)] text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
