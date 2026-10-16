'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // Required for Framer Motion

import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import ProjectCard from '@/components/ProjectCard';
import Security from '@/components/Security';
import PackageCard from '@/components/PackageCard';
import TeamSection from '@/components/TeamSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { packageService } from '@/store/packageService';
import { projectService } from '@/store/projectService';
import { siteSettingService } from '@/store/siteSettingService';
import { useState, useEffect } from "react";
import ServiceList from '@/components/ServiceList';
import OrderModal from '@/components/OrderModal';
import { getEncryptedHref } from '@/lib/routeCipher';
import TechMarquee from '@/components/TechMarquee';

// Motion variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
};

// Motion-enabled Link
const MotionLink = motion.create(Link);

export default function Home() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [settings, setSettings] = useState(null);
  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedOrderPkg, setSelectedOrderPkg] = useState(null);

  useEffect(() => {
    // Fetch Site Settings for visibility toggles
    siteSettingService.getSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error("Failed to load settings:", err));

    // Fetch Packages
    packageService.getPackages()
      .then(data => {
        const activeData = (data || []).filter(p => p.isActive !== false);
        if (activeData.length === 0) {
          setPackages([]);
          return;
        }

        let displayPkgs = [];
        const recommendedIdx = activeData.findIndex(p => p.recommend);

        if (recommendedIdx !== -1) {
          const recommended = activeData[recommendedIdx];
          const others = activeData.filter((_, i) => i !== recommendedIdx).slice(0, 2);
          
          if (others.length === 2) {
            displayPkgs = [others[0], recommended, others[1]];
          } else {
            displayPkgs = [recommended, ...others];
          }
        } else {
          displayPkgs = activeData.slice(0, 3);
        }
        
        setPackages(displayPkgs);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));

    // Fetch Projects
    projectService.getProjects()
      .then(data => {
        const active = (data || []).filter(p => p.isActive !== false);
        setProjects(active.slice(0, 3)); // Show top 3 active
      })
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-14 sm:pt-16">
        {/* Hero Section */}
        {settings?.showHero !== false && <Hero />}

        {/* Tech Stack Marquee Section */}
        <div className="my-6 sm:my-8">
          <TechMarquee />
        </div>

        {/* Services Section */}
        {settings?.showServices !== false && (
          <motion.section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] text-center mb-6 tracking-tight">
              {t("Our", "ជំនាញ")} <span className="text-gradient-brand">{t("Expertise", "របស់យើង")}</span>
            </h2>
            <div className="mt-4">
              <ServiceList limit={3} />
            </div>
            <div className="text-center mt-8">
              <MotionLink
                href="/services"
                className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("View All Services", "មើលសេវាកម្មទាំងអស់")} <ArrowRightIcon className="ml-2 h-4 w-4" />
              </MotionLink>
            </div>
          </motion.section>
        )}

        {/* Packages Section */}
        {settings?.showPackages !== false && (
          <motion.section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] mb-2 tracking-tight">
                {t("Service", "កញ្ចប់")} <span className="text-gradient-brand">{t("Packages", "សេវាកម្ម")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xl mx-auto leading-relaxed font-medium">
                {t(
                  "Scalable architecture blueprints tailored to your business scale. Every project has unique requirements—we consult directly to craft your custom solution.",
                  "ប្លង់ស្ថាបត្យកម្មប្រព័ន្ធដែលអាចពង្រីកបានស្របតាមទំហំអាជីវកម្មរបស់អ្នក។ គម្រោងនីមួយៗមានតម្រូវការជាក់ស្ដែងរៀងៗខ្លួន—យើងពិគ្រោះយោបល់ផ្ទាល់ដើម្បីបង្កើតដំណោះស្រាយស័ក្តិសមបំផុត។"
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {loadingPackages ? (
                Array(3).fill(null).map((_, i) => (
                  <div key={`sk-pkg-${i}`} className="w-full h-[440px] bg-[color:var(--bg-main)]/40 border border-[color:var(--border-main)]/60 rounded-2xl animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[color:var(--text-main)]/5 to-transparent" />
                  </div>
                ))
              ) : packages.slice(0, 3).map((pkg) => (
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
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 pb-4">
              <a
                href={settings?.telegramUrl || "https://t.me/codebridgee"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaTelegramPlane className="w-3.5 h-3.5" />
                {t("Discuss With Engineers", "ពិភាក្សាផ្ទាល់ជាមួយក្រុមការងារ")}
              </a>
              <MotionLink
                href="/packages"
                className="inline-flex items-center justify-center px-6 py-2 border border-[color:var(--border-main)]/80 bg-transparent text-[color:var(--text-main)] font-bold text-xs sm:text-sm rounded-full shadow-xs hover:border-[color:var(--color-primary)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("View All Blueprints", "មើលកញ្ចប់ទាំងអស់")} <ArrowRightIcon className="ml-2 h-4 w-4" />
              </MotionLink>
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {settings?.showProjects !== false && (
          <motion.section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] mb-2 tracking-tight">
                {t("Recent", "ស្នាដៃ")} <span className="text-gradient-brand">{t("Projects", "ថ្មីៗ")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
                {t("Explore our latest case studies and successful client deliverables.", "ស្វែងយល់ពីស្នាដៃថ្មីៗ និងលទ្ធផលដែលទទួលបានជោគជ័យរបស់យើង។")}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loadingProjects ? (
                Array(3).fill(null).map((_, i) => (
                  <div key={`sk-proj-${i}`} className="w-full h-80 bg-gray-100 rounded-3xl animate-pulse relative overflow-hidden" />
                ))
              ) : projects.map((project) => (
                <motion.div key={project.id} variants={cardItemVariants}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <MotionLink
                href={getEncryptedHref('/portfolio')}
                className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("See All Work", "មើលការងារទាំងអស់")} <ArrowRightIcon className="ml-2 h-4 w-4" />
              </MotionLink>
            </div>
          </motion.section>
        )}

        {/* Security Section */}
        {settings?.showSecurity !== false && <Security />}

        {/* FAQ Section */}
        {settings?.showFaq !== false && <FAQSection />}

        {/* Team Section */}
        {settings?.showTeam !== false && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <TeamSection />
          </section>
        )}

        {/* CTA Section */}
        {settings?.showCta !== false && <CTASection />}
      </main>
      <Footer />
      <OrderModal pkg={selectedOrderPkg} onClose={() => setSelectedOrderPkg(null)} />
    </>
  );
}
