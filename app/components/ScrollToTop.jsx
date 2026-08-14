'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-[#1A2368] to-[#378ADD] text-white rounded-full shadow-2xl shadow-blue-900/40 hover:shadow-blue-900/60 transition-all duration-300 transform hover:-translate-y-2 active:scale-90 flex items-center justify-center border border-white/20 backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5 stroke-[3]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
