'use client';

import { motion } from 'framer-motion';
import FAQSection from '../../components/FAQSection';
import { useLanguage } from '../../context/LanguageContext';
import { SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import CTASection from '../../components/CTASection';

const detailedFaqs = [
  {
    category: "Service & Process",
    categoryKh: "សេវាកម្ម និងដំណើរការ",
    questions: [
      {
        q: "What services does Codebridge provide?",
        qKh: "តើ Codebridge ផ្តល់សេវាកម្មអ្វីខ្លះ?",
        a: "We specialize in full-stack web development, mobile applications, custom software solutions, and comprehensive system refactoring. We also provide UI/UX design and SEO optimization services.",
        aKh: "យើងជំនាញក្នុងការបង្កើតគេហទំព័រពេញលេញ (full-stack), កម្មវិធីទូរស័ព្ទ, ដំណោះស្រាយកម្មវិធីតាមតម្រូវការ និងការកែសម្រួលប្រព័ន្ធប្រកបដោយប្រសិទ្ធភាព។ យើងក៏ផ្តល់សេវាកម្មរចនា UI/UX និងការធ្វើ SEO ផងដែរ។"
      },
      {
        q: "Do you offer post-launch support?",
        qKh: "តើអ្នកមានការគាំទ្របន្ទាប់ពីការដាក់ឱ្យដំណើរការដែរឬទេ?",
        a: "Yes, we offer various support and maintenance packages to ensure your platform remains secure, up-to-date, and high-performing after the initial launch.",
        aKh: "បាទ យើងផ្តល់ជូននូវកញ្ចប់គាំទ្រ និងថែទាំផ្សេងៗ ដើម្បីធានាថាប្រព័ន្ធរបស់អ្នកនៅតែមានសុវត្ថិភាព ទំនើប និងមានប្រសិទ្ធភាពខ្ពស់បន្ទាប់ពីការដាក់ឱ្យដំណើរការដំបូង។"
      }
    ]
  },
  {
    category: "Technical & Security",
    categoryKh: "បច្ចេកទេស និងសុវត្ថិភាព",
    questions: [
      {
        q: "Which tech stack do you recommend?",
        qKh: "តើអ្នកណែនាំបច្គេកវិទ្យាអ្វីខ្លះ?",
        a: "For most web projects, we recommend Next.js for its speed and SEO benefits, combined with Laravel or Node.js backends. We adapt our stack based on your specific scalability needs.",
        aKh: "សម្រាប់គម្រោងគេហទំព័រភាគច្រើន យើងសូមណែនាំ Next.js សម្រាប់ល្បឿន និងអត្ថប្រយោជន៍ SEO រួមផ្សំជាមួយ Laravel ឬ Node.js។ យើងជ្រើសរើសបច្ចេកវិទ្យាតាមតម្រូវការជាក់ស្តែងរបស់អ្នក។"
      },
      {
        q: "How do you handle data security?",
        qKh: "តើអ្នកគ្រប់គ្រងសុវត្ថិភាពទិន្នន័យយ៉ាងដូចម្តេច?",
        a: "We implement industry-standard security protocols, including OAuth2, JWT authentication, and SSL encryption. We also perform regular security audits on the code we build.",
        aKh: "យើងអនុវត្តពិធីការសុវត្ថិភាពស្តង់ដាររួមមាន OAuth2, JWT authentication, និងការសម្គាល់កូដ SSL។ យើងក៏ធ្វើការត្រួតពិនិត្យសុវត្ថិភាពជាប្រចាំលើកូដដែលយើងបង្កើតផងដែរ។"
      }
    ]
  }
];

export default function FAQPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <div className="min-h-screen bg-[color:var(--bg-main)] transition-colors duration-500">
      {/* Premium Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(color:var(--color-primary),0.05),transparent_70%)]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[color:var(--color-primary)] opacity-[0.03] blur-[120px] rounded-full" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[color:var(--color-secondary)] opacity-[0.03] blur-[100px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-[color:var(--bg-navbar)] text-[color:var(--text-main)] border border-[color:var(--border-main)] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-xl"
            >
              <SparklesIcon className="w-4 h-4 text-yellow-400" />
              {t("Help Center", "មជ្ឈមណ្ឌលជំនួយ")}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-[color:var(--text-main)] mb-8 tracking-tighter uppercase leading-[0.9]"
            >
              {t("How can we", "តើយើងអាច")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">
                {t("Help you?", "ជួយអ្នកបាន?")}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[color:var(--text-muted)] max-w-2xl font-medium leading-relaxed"
            >
              {t(
                "Everything you need to know about our development process, security standards, and technical ecosystem.",
                "អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវដឹងអំពីដំណើរការអភិវឌ្ឍន៍ ស្តង់ដារសុវត្ថិភាព និងប្រព័ន្ធបច្ចេកវិទ្យារបស់យើង។"
              )}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-[color:var(--bg-main)]">
        <FAQSection items={detailedFaqs} />
      </div>

      {/* Refined CTA Section */}
      <CTASection />
    </div>
  );
}
