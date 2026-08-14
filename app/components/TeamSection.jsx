'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { teamService } from '../store/teamService';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15 
    } 
  }
};

export default function TeamSection() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    teamService.getTeamMembers()
      .then(setTeamMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (loading || teamMembers.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      handleScroll('next');
    }, 4000); 

    return () => clearInterval(interval);
  }, [loading, teamMembers, isPaused]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const cardWidth = 320 + 32; // card width + gap
      
      if (direction === 'next') {
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
      }
    }
  };

  const resolveImage = (img) => {
    if (!img) return null;
    if (img.startsWith('http') || img.startsWith('/storage')) return img;
    return img;
  };

  return (
    <section 
      className="relative py-24 group/section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative inline-block">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-8xl font-black text-[color:var(--text-main)] opacity-5 uppercase tracking-[0.2em] select-none hidden lg:block">
              {t("Experts", "អ្នកជំនាញ")}
            </span>
            <span className="relative z-10 inline-block px-5 py-2 mb-6 text-[10px] font-black tracking-[0.3em] text-[color:var(--color-primary)] uppercase bg-[color:var(--color-primary)]/5 rounded-full border border-[color:var(--color-primary)]/10">
              {t("The Visionaries", "ចក្ខុវិស័យ")}
            </span>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-7xl font-black text-[color:var(--text-main)] uppercase tracking-tighter leading-none mb-8"
          >
            {t("Meet Our", "ជួបជាមួយ")} <br className="lg:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">
              {t("Experts", "អ្នកជំនាញ")}
            </span>
          </motion.h3>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="w-24 h-2 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] mx-auto rounded-full origin-center"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[color:var(--color-primary)]/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[color:var(--color-primary)] animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Navigation Buttons */}
            <button 
              onClick={() => handleScroll('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-12 h-12 bg-[color:var(--bg-navbar)] border border-[color:var(--border-main)] rounded-full shadow-xl flex items-center justify-center text-[color:var(--text-main)] hover:bg-[color:var(--color-primary)] hover:text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex"
              aria-label="Previous expert"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleScroll('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-12 h-12 bg-[color:var(--bg-navbar)] border border-[color:var(--border-main)] rounded-full shadow-xl flex items-center justify-center text-[color:var(--text-main)] hover:bg-[color:var(--color-primary)] hover:text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex"
              aria-label="Next expert"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Horizontal Scroll Container */}
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-8 pb-12 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing px-4"
            >
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.id} 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
                >
                  <div className="relative z-10 h-full p-5 flex flex-col items-start group rounded-3xl transition-all duration-500 hover:bg-[color:var(--bg-navbar)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent hover:border-[color:var(--border-main)]">
                    {/* Image Container */}
                    <div className="relative mb-6 w-full aspect-square overflow-hidden rounded-[2rem] bg-[color:var(--navbar-text)]/5">
                      {resolveImage(member.image) ? (
                        <img 
                          src={resolveImage(member.image)} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[color:var(--text-muted)] opacity-50 text-5xl font-black">
                          {member.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info Layout */}
                    <div className="relative pl-5 border-l border-[color:var(--border-main)] w-full transition-colors duration-300">
                      <span className="block text-[9px] font-black text-[color:var(--color-primary)] uppercase tracking-[0.2em] mb-1.5">
                        {t(member.role, member.kh_role) || member.role}
                      </span>
                      <h4 className="text-xl font-black text-[color:var(--text-main)] mb-3 tracking-tight">
                        {member.name}
                      </h4>
                      <p className="text-[13px] text-[color:var(--text-muted)] leading-relaxed font-medium mb-6 line-clamp-2">
                        {t(member.bio, member.kh_bio) || member.bio}
                      </p>

                      {member.portfolio_link && (
                        <a 
                          href={member.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[color:var(--text-main)] hover:text-[color:var(--color-primary)] transition-colors group/link"
                        >
                          {t("View Portfolio", "មើលសមិទ្ធផល")}
                          <span className="w-6 h-px bg-[color:var(--text-main)] group-hover/link:w-10 group-hover/link:bg-[color:var(--color-primary)] transition-all duration-500" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
