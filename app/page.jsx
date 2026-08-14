'use client';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Required for Framer Motion

import Hero from "./components/Hero";
import ServiceCard from "./components/ServiceCard";
import ProjectCard from "./components/ProjectCard";
import Security from "./components/Security";
import PackageCard from "./components/PackageCard";
import TeamSection from "./components/TeamSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from "./context/LanguageContext";
import { packageService } from "./store/packageService";
import { projectService } from "./store/projectService";
import { useState, useEffect } from "react";
import ServiceList from "./components/ServiceList";
import OrderModal from "./components/OrderModal";

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

  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedOrderPkg, setSelectedOrderPkg] = useState(null);

  useEffect(() => {
    // Fetch Packages
    packageService.getPackages()
      .then(data => {
        if (!data || data.length === 0) {
          setPackages([]);
          return;
        }

        let displayPkgs = [];
        const recommendedIdx = data.findIndex(p => p.recommend);

        if (recommendedIdx !== -1) {
          const recommended = data[recommendedIdx];
          const others = data.filter((_, i) => i !== recommendedIdx).slice(0, 2);
          
          if (others.length === 2) {
            displayPkgs = [others[0], recommended, others[1]];
          } else {
            displayPkgs = [recommended, ...others];
          }
        } else {
          displayPkgs = data.slice(0, 3);
        }
        
        setPackages(displayPkgs);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));

    // Fetch Projects
    projectService.getProjects()
      .then(data => {
        setProjects(data.slice(0, 3)); // Show top 3
      })
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero /> {/* Hero handles its own translation */}

        {/* Services Section */}
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl font-extrabold text-[color:var(--color-text-dark)] text-center mb-12">
            {t("Our Expertise", "ជំនាញរបស់យើង")}
          </h2>
          <div className="mt-6">
            <ServiceList limit={3} />
          </div>
          <div className="text-center mt-12">
            <MotionLink
              href="/services"
              className="inline-flex items-center justify-center w-56 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t("View All Services", "មើលសេវាកម្មទាំងអស់")} <ArrowRightIcon className="ml-3 h-5 w-5" />
            </MotionLink>
          </div>
        </motion.section>

        {/* Packages Section */}
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[color:var(--color-text-dark)] mb-4">
              {t("Service Packages", "កញ្ចប់សេវាកម្ម")}
            </h2>
            <p className="text-lg text-[color:var(--color-text-muted-light)] max-w-2xl mx-auto">
              {t(
                "Transparent pricing tailored to your scale. Choose the right path for your digital journey.",
                "តម្លៃច្បាស់លាស់ស្របតាមទំហំអាជីវកម្មរបស់អ្នក។ ជ្រើសរើសផ្លូវត្រឹមត្រូវសម្រាប់ដំណើរឌីជីថលរបស់អ្នក។"
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {loadingPackages ? (
              Array(3).fill(null).map((_, i) => (
                <div key={`sk-pkg-${i}`} className="w-full h-[500px] bg-gray-100 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
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
                onOrder={(pkgToOrder) => setSelectedOrderPkg(pkgToOrder)}
              />
            ))}
          </div>

          <div className="text-center mt-12 pb-10">
            <MotionLink
              href="/packages"
              className="inline-flex items-center justify-center w-56 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t("View All Packages", "មើលកញ្ចប់ទាំងអស់")} <ArrowRightIcon className="ml-3 h-5 w-5" />
            </MotionLink>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 "
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[color:var(--color-text-dark)] mb-4">
              {t("Recent Projects", "គម្រោងថ្មីៗ")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t("Explore our latest case studies and successful client deliverables.", "ស្វែងយល់ពីស្នាដៃថ្មីៗ និងលទ្ធផលដែលទទួលបានជោគជ័យរបស់យើង។")}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="text-center mt-12">
            <MotionLink
              href="/portfolio"
              className="inline-flex items-center justify-center w-56 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t("See All Work", "មើលការងារទាំងអស់")} <ArrowRightIcon className="ml-3 h-5 w-5" />
            </MotionLink>
          </div>
        </motion.section>

        {/* Security Section */}
        <Security />

        {/* FAQ Section */}
        <FAQSection />

        {/* Team Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TeamSection />
        </section>

        <CTASection />
      </main>
      <Footer />
      <OrderModal pkg={selectedOrderPkg} onClose={() => setSelectedOrderPkg(null)} />
    </>
  );
}
