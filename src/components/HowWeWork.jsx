'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { workStepService } from '@/store/workStepService';

export default function HowWeWork() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workStepService.getSteps()
      .then(data => {
        const activeData = (data || []).filter(s => s.isActive !== false);
        if (activeData && activeData.length > 0) {
          setSteps(activeData);
        } else {
          setSteps([]);
        }
      })
      .catch(err => console.error("Failed to load work steps:", err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };

  if (loading) {
    return (
      <section className="relative mt-12 py-20 z-10">
        <div className="max-w-6xl mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-[color:var(--text-main)]/5" />
                <div className="w-24 h-4 bg-[color:var(--text-main)]/5 rounded-full" />
                <div className="w-32 h-12 bg-[color:var(--text-main)]/5 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-12 py-20 z-10">
      <div className="max-w-6xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-[color:var(--text-main)] mb-6 capitalize tracking-tight"
          >
            {t("How We", "របៀបដែលយើង")} <span className="text-gradient-brand">{t("Work", "ធ្វើការ")}</span>
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-24 h-1 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] mx-auto rounded-full origin-center" 
          />
        </div>

        <div className="relative pt-4 pb-10">
          <div className="hidden lg:block absolute top-[3rem] left-[10%] right-[5%] h-1 bg-[color:var(--color-secondary)]/20 z-0" />

          <motion.div 
            className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-${Math.min(5, steps.length)} gap-12 lg:gap-4 relative z-10`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step) => (
              <motion.div key={step.id} variants={itemVariants} className="flex flex-col items-center text-center relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[color:var(--color-primary)] to-[color:var(--color-secondary)] flex justify-center items-center text-white text-2xl font-black mb-8 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 z-10 mx-auto relative cursor-default">
                  <div className="absolute inset-2 border-[1.5px] border-white/20 rounded-full" />
                  {step.stepNumber}
                </div>

                <h4 className="text-xl font-bold text-[color:var(--text-main)] mb-3">
                  {t(step.title, step.titleKh)}
                </h4>

                <p className="text-[color:var(--text-muted)] text-[14px] leading-relaxed font-medium px-2 max-w-[16rem] mx-auto">
                  {t(step.description, step.descriptionKh)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
