'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CommandLineIcon, 
  CodeBracketIcon, 
  CpuChipIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { workStepService } from '@/store/workStepService';

const STEP_ICONS = [
  CommandLineIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon
];

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
      <section className="relative mt-6 py-10 z-10">
        <div className="max-w-6xl mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-[color:var(--text-main)]/5" />
                <div className="w-20 h-3 bg-[color:var(--text-main)]/5 rounded-full" />
                <div className="w-24 h-10 bg-[color:var(--text-main)]/5 rounded-xl" />
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
    <section className="relative mt-6 py-10 z-10">
      <div className="max-w-6xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--bg-main)]/80 backdrop-blur-sm border border-[color:var(--border-main)] shadow-sm mb-4"
          >
            <CommandLineIcon className="h-4 w-4 text-[color:var(--color-primary)]" />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[color:var(--text-main)] uppercase tracking-widest">
              {t("Agile SDLC Pipeline", "វដ្តជីវិតអភិវឌ្ឍន៍សូហ្វវែរ (SDLC)")}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[color:var(--text-main)] mb-3 capitalize tracking-tight"
          >
            {t("How We", "របៀបដែលយើង")} <span className="text-gradient-brand">{t("Engineer Solutions", "បង្កើតដំណោះស្រាយ")}</span>
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-16 h-1 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] mx-auto rounded-full origin-center" 
          />
        </div>

        <div className="relative pt-4 pb-6">
          <div className="hidden lg:block absolute top-[2.2rem] left-[10%] right-[5%] h-0.5 bg-gradient-to-r from-[color:var(--color-primary)]/20 via-[color:var(--color-secondary)]/30 to-[color:var(--color-primary)]/20 z-0 border-t border-dashed border-[color:var(--border-main)]" />

          <motion.div 
            className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-${Math.min(5, steps.length)} gap-8 lg:gap-4 relative z-10`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, idx) => {
              const StepIcon = STEP_ICONS[idx % STEP_ICONS.length];
              return (
                <motion.div key={step.id} variants={itemVariants} className="flex flex-col items-center text-center relative group p-3 rounded-2xl transition-all duration-300 hover:bg-[color:var(--bg-secondary)]/50 border border-transparent hover:border-[color:var(--border-main)]">
                  {/* Phase Number & Tech Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[color:var(--color-primary)] to-[color:var(--color-secondary)] flex justify-center items-center text-white text-base font-black mb-3 shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 z-10 mx-auto relative cursor-default">
                    <div className="absolute inset-1 border border-white/20 rounded-xl" />
                    <StepIcon className="w-6 h-6 text-white stroke-[2]" />
                  </div>

                  {/* Phase Telemetry Tag */}
                  <div className="mb-2 px-2 py-0.5 rounded bg-[color:var(--bg-main)] border border-[color:var(--border-main)] shadow-xs">
                    <span className="text-[9px] font-mono font-bold text-[color:var(--color-primary)] uppercase tracking-wider">
                      PHASE 0{step.stepNumber}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[color:var(--text-main)] mb-1.5 uppercase tracking-tight">
                    {t(step.title, step.titleKh)}
                  </h4>

                  <p className="text-[color:var(--text-muted)] text-xs leading-relaxed font-medium px-2 max-w-[15rem] mx-auto">
                    {t(step.description, step.descriptionKh)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
