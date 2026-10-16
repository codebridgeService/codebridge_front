'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { faqService } from '@/store/faqService';

const FAQItem = ({ question, answer, isOpen, onClick, lang }) => {
  return (
    <motion.div 
      initial={false}
      className={`group border-l-2 transition-all duration-300 ${isOpen ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5' : 'border-[color:var(--border-main)] hover:border-[color:var(--color-primary)]/40 hover:bg-[color:var(--text-main)]/[0.02]'}`}
    >
      <button
        onClick={onClick}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer"
      >
        <span className={`font-bold tracking-tight text-[color:var(--text-main)] group-hover:text-[color:var(--color-primary)] transition-colors duration-300 ${lang === 'kh' ? 'text-base sm:text-lg font-battambang' : 'text-sm sm:text-base'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.05 : 1 }}
          className={`shrink-0 ml-4 p-2 rounded-full transition-colors duration-300 ${isOpen ? 'bg-[color:var(--color-primary)] text-white shadow-md' : 'bg-transparent border border-[color:var(--border-main)] text-[color:var(--text-muted)]'}`}
        >
          <ChevronDownIcon className="w-4 h-4 stroke-[2.5]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 sm:px-6 pb-4 pt-0">
              <p className={`text-[color:var(--text-muted)] leading-relaxed ${lang === 'kh' ? 'text-xs sm:text-sm font-battambang' : 'text-xs sm:text-sm'}`}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    faqService.getFaqs()
      .then(data => {
        const activeData = (data || []).filter(f => f.isActive !== false);
        if (activeData.length > 0) {
          setFaqs(activeData);
          // Auto-open first item
          setOpenItems({ [activeData[0].id]: true });
        } else {
          setFaqs([]);
        }
      })
      .catch(err => console.error("Failed to load FAQs:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = ['All'];
    faqs.forEach(f => {
      const cat = f.category || 'General';
      if (!cats.includes(cat)) cats.push(cat);
    });
    return cats;
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'All') return faqs;
    return faqs.filter(f => (f.category || 'General') === activeCategory);
  }, [faqs, activeCategory]);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
      <div className="text-center mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-transparent border border-[color:var(--border-main)] shadow-sm mb-4"
        >
          <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
          <span className="text-[10px] sm:text-xs font-bold text-[color:var(--text-main)] uppercase tracking-wider">
            {t("Common Queries", "សំណួរទូទៅ")}
          </span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-[color:var(--text-main)] tracking-tight mb-3"
        >
          {t("Frequently Asked", "សំណួរដែលសួរ")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">{t("Questions", "ញឹកញាប់")}</span>
        </motion.h2>
        
        <p className="text-[color:var(--text-muted)] text-xs sm:text-sm max-w-lg mx-auto">
          {t("Everything you need to know about our services, timelines, and development process.", "អ្វីៗទាំងអស់ដែលអ្នកត្រូវដឹងអំពីសេវាកម្ម ពេលវេលា និងដំណើរការអភិវឌ្ឍន៍របស់យើង។")}
        </p>

        {/* Categories Pills */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[color:var(--color-primary)] text-white shadow-md'
                    : 'bg-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] border border-[color:var(--border-main)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-transparent border border-[color:var(--border-main)] overflow-hidden divide-y divide-[color:var(--border-main)]">
        {filteredFaqs.map((faq, idx) => (
          <FAQItem
            key={faq.id || idx}
            question={t(faq.question, faq.questionKh)}
            answer={t(faq.answer, faq.answerKh)}
            isOpen={!!openItems[faq.id || idx]}
            onClick={() => toggleItem(faq.id || idx)}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}
