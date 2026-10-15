'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, EyeIcon, FlagIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { siteSettingService } from '@/store/siteSettingService';
import TeamSection from '@/components/TeamSection';
import HowWeWork from '@/components/HowWeWork';

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
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    siteSettingService.getSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error("Failed to load about page settings:", err));
  }, []);

  const storyText = t(
    settings?.aboutStory || "We are a dedicated team of innovators and problem-solvers, passionate about building meaningful digital products that empower startups and small businesses. Our focus is on delivering speed, reliability, and exceptionally clean design.",
    settings?.aboutStoryKh || "យើងគឺជាក្រុមអ្នកច្នៃប្រឌិត និងអ្នកដោះស្រាយបញ្ហា ដែលមានចំណង់ចំណូលចិត្តក្នុងការបង្កើតផលិតផលឌីជីថលលំដាប់ខ្ពស់ ដើម្បីជួយដល់អាជីវកម្មថ្មីថ្មោង និងខ្នាតតូច។ ការយកចិត្តទុកដាក់របស់យើងគឺលើការផ្តល់ជូននូវល្បឿន ភាពជឿជាក់ និងការរចនាដ៏ស្រស់ស្អាតបំផុត។"
  );

  const missionTitle = t(
    settings?.missionTitle || "Our Mission",
    settings?.missionTitleKh || "បេសកកម្មរបស់យើង"
  );

  const missionText = t(
    settings?.missionText || "To forge lasting partnerships by providing cutting-edge web, app, and system development services. We aim to translate your vision into robust, scalable, and user-centric digital solutions.",
    settings?.missionTextKh || "ដើម្បីកសាងភាពជាដៃគូយូរអង្វែងដោយផ្តល់នូវសេវាកម្មអភិវឌ្ឍន៍គេហទំព័រ កម្មវិធី និងប្រព័ន្ធទំនើបបំផុត។ យើងមានគោលបំណងប្រែក្លាយចក្ខុវិស័យរបស់អ្នកទៅជាដំណោះស្រាយឌីជីថលដ៏រឹងមាំ និងមានមាត្រដ្ឋាន។"
  );

  const visionTitle = t(
    settings?.visionTitle || "Our Vision",
    settings?.visionTitleKh || "ចក្ខុវិស័យរបស់យើង"
  );

  const visionText = t(
    settings?.visionText || "To be the leading digital agency recognized for transforming bold ideas into impactful technological realities that inspire progress and drive global business success.",
    settings?.visionTextKh || "ដើម្បីក្លាយជាភ្នាក់ងារឌីជីថលឈានមុខគេ ដែលត្រូវបានទទួលស្គាល់សម្រាប់ការផ្លាស់ប្តូរគំនិតដ៏ក្លាហាន ទៅជាការពិតប្រាកដនៃបច្ចេកវិទ្យាដែលជំរុញឱ្យមានការរីកចម្រើន និងជំរុញឱ្យអាជីវកម្មជោគជ័យ។"
  );

  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 py-16 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl sm:text-5xl font-black text-[color:var(--text-main)] mb-6 text-center tracking-tight"
        variants={itemVariants}
      >
        {t("About", "អំពី")} <span className="text-[color:var(--text-main)]">Code</span><span className="bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent">Bridges</span>
      </motion.h1>

      <motion.p 
        className="mt-6 text-base sm:text-lg text-[color:var(--text-muted)] leading-relaxed text-center max-w-3xl mx-auto"
        variants={itemVariants}
      >
        {storyText}
      </motion.p>

      {/* Grid for Mission, Vision, and Goals */}
      <div className="grid lg:grid-cols-2 gap-8 mt-16">
        
        {/* Left Column: Mission & Vision */}
        <div className="flex flex-col gap-8">
          <motion.div className="bg-[color:var(--bg-main)]/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-[color:var(--border-main)]" variants={itemVariants}>
            <h3 className="flex items-center gap-3 text-2xl font-bold text-[color:var(--text-main)] mb-4">
              <BriefcaseIcon className="h-7 w-7 text-[color:var(--color-primary)]" /> {missionTitle}
            </h3>
            <p className="text-base sm:text-lg text-[color:var(--text-muted)] leading-relaxed">
              {missionText}
            </p>
          </motion.div>

          <motion.div className="bg-[color:var(--bg-main)]/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-[color:var(--border-main)]" variants={itemVariants}>
            <h3 className="flex items-center gap-3 text-2xl font-bold text-[color:var(--text-main)] mb-4">
              <EyeIcon className="h-7 w-7 text-[color:var(--color-primary)]" /> {visionTitle}
            </h3>
            <p className="text-base sm:text-lg text-[color:var(--text-muted)] leading-relaxed">
              {visionText}
            </p>
          </motion.div>
        </div>

        {/* Right Column: Strategic Commitments */}
        <motion.div className="bg-[color:var(--bg-main)]/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-[color:var(--border-main)] flex flex-col justify-center h-full" variants={itemVariants}>
          <h3 className="flex items-center gap-3 text-2xl font-bold text-[color:var(--text-main)] mb-6">
            <FlagIcon className="h-7 w-7 text-[color:var(--color-primary)]" /> {t("Our Strategic Goals", "គោលដៅយុទ្ធសាស្ត្ររបស់យើង")}
          </h3>
          <ul className="space-y-4">
            {[
              { en: "Deliver high-speed, enterprise-grade software for every client", kh: "ផ្តល់ជូននូវសូហ្វវែរដែលមានល្បឿនលឿនកម្រិតសហគ្រាសសម្រាប់គ្រប់អតិថិជន" },
              { en: "Serve startups, SMEs, and international enterprises", kh: "បម្រើអាជីវកម្មថ្មីថ្មោង សហគ្រាសធុនតូច និងមធ្យម និងអន្តរជាតិ" },
              { en: "Maintain 100% transparent communication and delivery sprints", kh: "រក្សាការទំនាក់ទំនងប្រកបដោយតម្លាភាព ១០០% និងការផ្តល់ជូនទាន់ពេលវេលា" },
              { en: "Pioneer modern web and mobile tech in Southeast Asia", kh: "ត្រួសត្រាយបច្ចេកវិទ្យាគេហទំព័រ និងទូរស័ព្ទទំនើបនៅអាស៊ីអាគ្នេយ៍" }
            ].map((goal, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <div className="mt-2.5 shrink-0 w-2 h-2 rounded-full bg-[color:var(--color-secondary)] group-hover:scale-150 group-hover:bg-[color:var(--color-primary)] transition-all" />
                <span className="text-base sm:text-lg text-[color:var(--text-muted)] leading-relaxed group-hover:text-[color:var(--text-main)] transition-colors">{t(goal.en, goal.kh)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {settings?.showHowWeWork !== false && <HowWeWork />}

      {/* Team Section Component */}
      {settings?.showTeam !== false && <TeamSection />}
    </motion.section>
  );
}