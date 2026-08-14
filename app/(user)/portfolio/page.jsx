'use client';

import ProjectCard from "../../components/ProjectCard";
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { projectService } from '../../store/projectService';
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
        setProjects(data || []);
      })
      .catch(err => {
        console.error(err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-black text-[color:var(--text-main)] mb-8 text-center tracking-tight uppercase transition-colors duration-300">
          {t("Our Masterpieces", "ស្នាដៃឯករបស់យើង")}
        </h1>
        <p className="text-sm font-black text-[color:var(--color-primary)] uppercase tracking-[0.3em] text-center mb-16">
          {t("Where Innovation Meets Craft", "ទីដែលការច្នៃប្រឌិតជួបនឹងសិល្បៈ")}
        </p>
        <p className="text-lg text-[color:var(--text-muted)] max-w-3xl mx-auto text-center mb-24 leading-relaxed font-medium transition-colors duration-300">
          {t(
            "Explore our collection of high-impact digital solutions, engineered to push boundaries and define the future of modern business.",
            "ស្វែងយល់ពីកម្រងដំណោះស្រាយឌីជីថលដែលមានឥទ្ធិពលខ្ពស់របស់យើង ដែលត្រូវបានបង្កើតឡើងដើម្បីពង្រីកព្រំដែន និងកំណត់អនាគតនៃអាជីវកម្មទំនើប។"
          )}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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
                className="w-full h-[400px] bg-[color:var(--bg-secondary)] rounded-[2.5rem] animate-pulse border border-[color:var(--border-main)] flex flex-col p-6 items-center justify-center gap-4"
              >
                  <div className="w-16 h-16 rounded-full bg-[color:var(--text-main)]/5" />
                  <div className="w-1/2 h-4 bg-[color:var(--text-main)]/5 rounded-full" />
                  <div className="w-1/3 h-3 bg-[color:var(--text-main)]/5 rounded-full" />
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
