'use client';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../context/LanguageContext';

export default function DeleteModal({ isOpen, onClose, onConfirm, isDeleting, itemName }) {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={() => !isDeleting && onClose()}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center shadow-4xl"
      >
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon className="w-10 h-10 text-rose-500" />
        </div>
        
        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
          {t('Are you absolutely sure?', 'តើអ្នកពិតជាចង់លុបមែនទេ?')}
        </h3>
        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
          {t(`You are about to delete "${itemName}". This action cannot be undone, so please proceed with caution.`, `អ្នកកំពុងរៀបទំលុប "${itemName}"។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ សូមប្រុងប្រយ័ត្ន។`)}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[13px] shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <TrashIcon className="w-4 h-4" />
            )}
            {isDeleting ? t('Deleting...', 'កំពុងលុប...') : t('Yes, delete this', 'បាទ/ចាស លុបឥឡូវនេះ')}
          </button>
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-4 text-gray-500 rounded-2xl font-black text-[13px] hover:bg-gray-100 transition-all"
          >
            {t('No, keep it', 'មិនលុបទេ')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
