'use client';

import ProjectCard from '@/components/ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { projectService } from '@/store/projectService';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects()
      .then(data => {
        const active = (data || []).filter(p => p.isActive !== false);
        setProjects(active);
      })
      .catch(err => {
        console.error(err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] mb-3 text-center tracking-tight uppercase transition-colors duration-300">
          {t("Our Masterpieces", "ស្នាដៃឯករបស់យើង")}
        </h1>
        <p className="text-[10px] sm:text-xs font-black text-[color:var(--color-primary)] uppercase tracking-[0.3em] text-center mb-4">
          {t("Where Innovation Meets Craft", "ទីដែលការច្នៃប្រឌិតជួបនឹងសិល្បៈ")}
        </p>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xl mx-auto text-center mb-8 leading-relaxed font-medium transition-colors duration-300">
          {t(
            "Explore our collection of high-impact digital solutions, engineered to push boundaries and define the future of modern business.",
            "ស្វែងយល់ពីកម្រងដំណោះស្រាយឌីជីថលដែលមានឥទ្ធិពលខ្ពស់របស់យើង ដែលត្រូវបានបង្កើតឡើងដើម្បីពង្រីកព្រំដែន និងកំណត់អនាគតនៃអាជីវកម្មទំនើប។"
          )}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <motion.div 
                key={`sk-${i}`}
                variants={itemVariants}
                className="w-full h-[280px] bg-[color:var(--bg-secondary)] rounded-2xl animate-pulse border border-[color:var(--border-main)] flex flex-col p-5 items-center justify-center gap-3"
              >
                  <div className="w-12 h-12 rounded-full bg-[color:var(--text-main)]/5" />
                  <div className="w-1/2 h-3.5 bg-[color:var(--text-main)]/5 rounded-full" />
                  <div className="w-1/3 h-2.5 bg-[color:var(--text-main)]/5 rounded-full" />
              </motion.div>
            ))
          ) : projects.length > 0 ? (
            projects.map((p) => (
              <motion.div key={p.id} variants={itemVariants} layout>
                <ProjectCard project={p} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
               <p className="text-[color:var(--text-muted)] font-bold uppercase tracking-widest">{t("No projects found yet.", "មិនទាន់មានគម្រោងត្រូវបានរកឃើញនៅឡើយទេ។")}</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
