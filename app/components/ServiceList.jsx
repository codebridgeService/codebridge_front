'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServiceCard from "./ServiceCard";
import { useLanguage } from '../context/LanguageContext';
import { serviceService } from '../store/serviceService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
      delayChildren: 0
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
};

export default function ServiceList({ limit, exclude }) {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService.getServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getServiceExtras = (title = '', description = '') => {
    const t = title.toLowerCase();
    const d = description.toLowerCase();
    
    if (t.includes('web') || d.includes('web')) return { 
      color: '#3B82F6', 
      tags: ['Next.js', 'Laravel'],
      icon: 'GlobeAltIcon'
    };
    if (t.includes('mobile') || d.includes('app') || t.includes('phone')) return { 
      color: '#FACC15', 
      tags: ['Android', 'iOS'],
      icon: 'DevicePhoneMobileIcon'
    };
    if (t.includes('design') || t.includes('ui/ux') || t.includes('ui') || t.includes('ux')) return { 
      color: '#A855F7', 
      tags: ['Figma', 'Adobe XD'],
      icon: 'PaintBrushIcon'
    };
    if (t.includes('system') || t.includes('pos') || d.includes('pos') || t.includes('soft')) return { 
      color: '#22C55E', 
      tags: ['POS', 'ERP'],
      icon: 'Squares2X2Icon'
    };
    return { color: '#1A2368', tags: [], icon: 'CodeBracketSquareIcon' };
  };

  const filteredServices = exclude 
    ? services.filter(s => {
        const name = (s.title || s.name || '').toLowerCase();
        const excludeStr = exclude.toLowerCase();
        // If excluding ui/ux, check for common variations
        if (excludeStr === 'ui/ux' || excludeStr === 'ux/ui') {
          return !(name.includes('ui') || name.includes('ux') || name.includes('design'));
        }
        return !name.includes(excludeStr);
      })
    : services;

  const displayServices = limit ? filteredServices.slice(0, limit) : filteredServices;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(limit || 3).fill(null).map((_, i) => (
          <div key={`sk-svc-${i}`} className="w-full h-64 bg-[color:var(--bg-navbar)] rounded-2xl animate-pulse border border-[color:var(--border-main)]" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={displayServices.length === 2 
        ? "flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl mx-auto" 
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {displayServices.map((service) => {
        const extras = getServiceExtras(service.title || service.name, service.description);
        const title = t(service.title || service.name, service.kh_title || service.kh_name) || (service.title || service.name);
        const description = t(service.description, service.kh_description) || service.description;
        
        return (
          <motion.div 
            key={service.id} 
            variants={itemVariants}
            className={displayServices.length === 2 ? "flex-1 w-full md:w-1/2" : ""}
          >
            <ServiceCard 
              title={title} 
              description={description} 
              icon={service.icon || extras.icon}
              color={service.color && service.color !== "" ? service.color : extras.color}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
