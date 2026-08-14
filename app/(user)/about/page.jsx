'use client';

import { motion } from 'framer-motion';
import { BriefcaseIcon, EyeIcon, FlagIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';



import TeamSection from '../../components/TeamSection';
import HowWeWork from '../../components/HowWeWork';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
};

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl font-extrabold text-[color:var(--text-main)] mb-6 text-center transition-colors duration-300"
        variants={itemVariants}
      >
        {t("About", "អំពី")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">Codebridge</span>
      </motion.h1>
      <motion.p 
        className="mt-6 text-lg text-[color:var(--text-muted)] leading-relaxed text-center max-w-3xl mx-auto transition-colors duration-300"
        variants={itemVariants}
      >
        {t(
          "We are a dedicated team of innovators and problem-solvers, passionate about building meaningful digital products that empower startups and small businesses. Our focus is on delivering speed, reliability, and exceptionally clean design.",
          "យើងគឺជាក្រុមអ្នកច្នៃប្រឌិត និងអ្នកដោះស្រាយបញ្ហា ដែលមានចំណង់ចំណូលចិត្តក្នុងការបង្កើតផលិតផលឌីជីថលលំដាប់ខ្ពស់ ដើម្បីជួយដល់អាជីវកម្មថ្មីថ្មោង និងខ្នាតតូច។ ការយកចិត្តទុកដាក់របស់យើងគឺលើការផ្តល់ជូននូវល្បឿន ភាពជឿជាក់ និងការរចនាដ៏ស្រស់ស្អាតបំផុត។"
        )}
      </motion.p>

      {/* Grid for Mission, Vision, and Goals */}
      <div className="grid lg:grid-cols-2 gap-8 mt-16">
        
        {/* Left Column: Mission & Vision */}
        <div className="flex flex-col gap-8">
          <motion.div className="bg-[color:var(--bg-secondary)] p-8 rounded-3xl shadow-sm border border-[color:var(--border-main)] transition-colors duration-300" variants={itemVariants}>
            <h3 className="flex items-center gap-3 text-2xl font-bold text-[color:var(--text-main)] mb-6">
              <BriefcaseIcon className="h-7 w-7 text-[color:var(--color-primary)]" /> {t("Our Mission", "បេសកកម្មរបស់យើង")}
            </h3>
            <p className="text-lg text-[color:var(--text-muted)] leading-relaxed">
              {t(
                "To forge lasting partnerships by providing cutting-edge web, app, and system development services. We aim to translate your vision into robust, scalable, and user-centric digital solutions.",
                "ដើម្បីកសាងភាពជាដៃគូយូរអង្វែងដោយផ្តល់នូវសេវាកម្មអភិវឌ្ឍន៍គេហទំព័រ កម្មវិធី និងប្រព័ន្ធទំនើបបំផុត។ យើងមានគោលបំណងប្រែក្លាយចក្ខុវិស័យរបស់អ្នកទៅជាដំណោះស្រាយឌីជីថលដ៏រឹងមាំ និងមានមាត្រដ្ឋាន។"
              )}
            </p>
          </motion.div>

          <motion.div className="bg-[color:var(--bg-secondary)] p-8 rounded-3xl shadow-sm border border-[color:var(--border-main)] transition-colors duration-300" variants={itemVariants}>
            <h3 className="flex items-center gap-3 text-2xl font-bold text-[color:var(--text-main)] mb-6">
              <EyeIcon className="h-7 w-7 text-[color:var(--color-primary)]" /> {t("Our Vision", "ចក្ខុវិស័យរបស់យើង")}
            </h3>
            <p className="text-lg text-[color:var(--text-muted)] leading-relaxed">
              {t(
                "To be the leading digital agency recognized for transforming bold ideas into impactful technological realities that inspire progress and drive global business success.",
                "ដើម្បីក្លាយជាភ្នាក់ងារឌីជីថលឈានមុខគេ ដែលត្រូវបានទទួលស្គាល់សម្រាប់ការផ្លាស់ប្តូរគំនិតដ៏ក្លាហាន ទៅជាការពិតប្រាកដនៃបច្ចេកវិទ្យាដែលជំរុញឱ្យមានការរីកចម្រើន និងជំរុញឱ្យអាជីវកម្មជោគជ័យ។"
              )}
            </p>
          </motion.div>
        </div>

        {/* Right Column: Goals */}
        <motion.div className="bg-[color:var(--bg-secondary)] p-8 rounded-3xl shadow-sm border border-[color:var(--border-main)] flex flex-col justify-center h-full transition-colors duration-300" variants={itemVariants}>
          <h3 className="flex items-center gap-3 text-2xl font-bold text-[color:var(--text-main)] mb-6">
            <FlagIcon className="h-7 w-7 text-[color:var(--color-primary)]" /> {t("2026-2027 Goals", "គោលដៅឆ្នាំ 2026-2027")}
          </h3>
          <ul className="space-y-4">
            {[
              { en: "Complete 10+ client projects in Year 1", kh: "បញ្ចប់គម្រោងអតិថិជន ១០+ ក្នុងឆ្នាំទី ១" },
              { en: "Serve 5+ international clients", kh: "បម្រើអតិថិជនអន្តរជាតិ ៥+" },
              { en: "Maintain 5-star client satisfaction rating", kh: "រក្សាចំណាត់ថ្នាក់ការពេញចិត្តរបស់អតិថិជនផ្កាយ ៥" },
              { en: "Establish Codebridge as #1 local dev agency", kh: "បង្កើត Codebridge ជាទីភ្នាក់ងារអភិវឌ្ឍន៍ក្នុងស្រុកលេខ ១" }
            ].map((goal, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <div className="mt-2.5 flex-shrink-0 w-2 h-2 rounded-full bg-[color:var(--color-secondary)] group-hover:scale-150 group-hover:bg-[color:var(--color-primary)] transition-all" />
                <span className="text-lg text-[color:var(--text-muted)] leading-relaxed group-hover:text-[color:var(--text-main)] transition-colors">{t(goal.en, goal.kh)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <HowWeWork />

      {/* Team Section Component */}
      <TeamSection />
    </motion.section>
  );
}