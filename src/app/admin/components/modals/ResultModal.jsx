'use client';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';

export default function ResultModal({ isOpen, onClose, type = 'success', message }) {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 text-center"
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
          type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
          type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
        }`}>
          {type === 'success' && <CheckCircleIcon className="w-6 h-6" />}
          {type === 'error' && <ExclamationCircleIcon className="w-6 h-6" />}
          {type === 'info' && <InformationCircleIcon className="w-6 h-6" />}
        </div>
        
        <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">
          {type === 'success' ? t('All Done!', 'នាំចូលបានជោគជ័យ') : 
           type === 'error' ? t('Oops! Something went wrong', 'នាំចូលបានបរាជ័យ') : t('Just a heads up', 'ការជូនដំណឹង')}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
          {message}
        </p>

        <button 
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${
            type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700' :
            type === 'error' ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600' :
            'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'
          }`}
        >
          {t('Got it, thanks!', 'យល់ព្រម')}
        </button>
      </motion.div>
    </div>
  );
}
