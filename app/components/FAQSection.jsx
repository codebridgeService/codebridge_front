'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const faqData = [
  {
    category: "General",
    categoryKh: "ទូទៅ",
    questions: [
      {
        q: "What services does Codebridge provide?",
        qKh: "តើ Codebridge ផ្តល់សេវាកម្មអ្វីខ្លះ?",
        a: "We specialize in full-stack web development, mobile applications, custom software solutions, and comprehensive system refactoring using modern technologies like Next.js, Laravel, and MongoDB.",
        aKh: "យើងជំនាញក្នុងការបង្កើតគេហទំព័រពេញលេញ (full-stack), កម្មវិធីទូរស័ព្ទ, ដំណោះស្រាយកម្មវិធីតាមតម្រូវការ និងការកែសម្រួលប្រព័ន្ធប្រកបដោយប្រសិទ្ធភាពដោយប្រើបច្ចេកវិទ្យាទំនើបៗដូចជា Next.js, Laravel និង MongoDB។"
      },
      {
        q: "How long does a typical project take?",
        qKh: "តើគម្រោងមួយជាធម្មតាប្រើរយៈពេលប៉ុន្មាន?",
        a: "Timeline depends on complexity. Small websites typically take 2-4 weeks, while complex full-stack applications may take 3-6 months. We provide detailed estimates after the initial discovery phase.",
        aKh: "រយៈពេលអាស្រ័យលើភាពស្មុគស្មាញ។ គេហទំព័រតូចៗជាធម្មតាប្រើពេល ២-៤ សប្តាហ៍ ខណៈពេលដែលកម្មវិធីស្មុគស្មាញអាចចំណាយពេល ៣-៦ ខែ។ យើងផ្តល់ការប៉ាន់ស្មានលម្អិតបន្ទាប់ពីដំណាក់កាលសិក្សាដំបូង។"
      }
    ]
  },
  {
    category: "Technical",
    categoryKh: "បច្ចេកទេស",
    questions: [
      {
        q: "Which programming languages do you use?",
        qKh: "តើអ្នកប្រើភាសាកម្មវិធីអ្វីខ្លះ?",
        a: "Our core stack includes JavaScript/TypeScript (React, Next.js, Node.js), PHP (Laravel), Python, and various database systems including MySQL and MongoDB.",
        aKh: "ភាសាចម្បងរបស់យើងរួមមាន JavaScript/TypeScript (React, Next.js, Node.js), PHP (Laravel), Python និងប្រព័ន្ធមូលដ្ឋានទិន្នន័យផ្សេងៗរួមមាន MySQL និង MongoDB។"
      }
    ]
  }
];

const FAQItem = ({ question, answer, isOpen, onClick, lang }) => {
  return (
    <motion.div 
      initial={false}
      className={`group border-l-2 transition-all duration-500 ${isOpen ? 'border-[color:var(--color-primary)] bg-[color:var(--bg-secondary)]/30' : 'border-[color:var(--border-main)] hover:border-[color:var(--color-primary)]/30'}`}
    >
      <button
        onClick={onClick}
        className="w-full px-8 py-7 flex items-center justify-between text-left"
      >
        <span className={`font-black tracking-tight text-[color:var(--text-main)] group-hover:text-[color:var(--color-primary)] transition-colors duration-500 ${lang === 'kh' ? 'text-xl' : 'text-lg'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors duration-500 ${isOpen ? 'bg-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary)]/20' : 'bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)]'}`}
        >
          <ChevronDownIcon className="w-5 h-5 stroke-[3]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-8 pb-8 pt-2">
              <p className={`text-[color:var(--color-text-muted-light)] leading-relaxed font-medium max-w-3xl ${lang === 'kh' ? 'text-base' : 'text-[15px]'}`}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection({ items = faqData }) {
  const [openIndex, setOpenIndex] = useState("0-0");
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Decorative Background Watermark */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 text-[20rem] font-black text-[color:var(--text-main)]/5 select-none pointer-events-none uppercase tracking-tighter">
        FAQ
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-1.5 bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <QuestionMarkCircleIcon className="w-4 h-4" />
            {t("Support Center", "មជ្ឈមណ្ឌលគាំទ្រ")}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-black text-[color:var(--text-main)] uppercase tracking-tighter mb-6 leading-none"
          >
            {t("Common", "សំណួរ")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">
              {t("Questions", "ដែលសួរញឹកញាប់")}
            </span>
          </motion.h2>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            className="h-1.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] rounded-full"
          />
        </div>

        <div className="space-y-16">
          {items.map((category, catIdx) => (
            <motion.div 
              key={catIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] whitespace-nowrap">
                  {t(category.category, category.categoryKh)}
                </h3>
                <div className="h-px bg-[color:var(--border-main)] flex-grow" />
              </div>

              <div className="divide-y divide-[color:var(--border-main)] border-y border-[color:var(--border-main)]">
                {category.questions.map((item, qIdx) => {
                  const globalIdx = `${catIdx}-${qIdx}`;
                  return (
                    <FAQItem
                      key={globalIdx}
                      question={t(item.q, item.qKh)}
                      answer={t(item.a, item.aKh)}
                      isOpen={openIndex === globalIdx}
                      onClick={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                      lang={lang}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
