'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsPage() {
  const { lang, setLang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
          {t('Settings', 'ការកំណត់')}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {t('Manage your personal platform preferences.', 'គ្រប់គ្រងការកំណត់ចំណូលចិត្តផ្ទាល់ខ្លួនរបស់អ្នក។')}
        </p>
      </div>

      <div className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-5 sm:p-6 space-y-6">
        <div>
          <h2 className="text-base font-black text-gray-900 mb-4">{t('Language Preference', 'ចំណូលចិត្តភាសា')}</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setLang('en')}
              className={`flex-1 py-3.5 rounded-2xl font-black border-2 transition-all text-sm ${lang === 'en' ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 text-[color:var(--color-primary)]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('kh')}
              className={`flex-1 py-3.5 rounded-2xl font-black border-2 transition-all font-[family-name:var(--font-battambang)] text-sm ${lang === 'kh' ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 text-[color:var(--color-primary)]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
            >
              ភាសាខ្មែរ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
