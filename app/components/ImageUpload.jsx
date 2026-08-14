'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

export default function ImageUpload({ value, onChange, label, description }) {
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
          <PhotoIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
          {label}
        </label>
      )}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-video rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden group ${
          preview 
            ? 'border-transparent shadow-xl' 
            : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[color:var(--color-primary)]/40'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <p className="text-white font-black text-[10px] uppercase tracking-[0.2em]">{t('Change Image', 'ប្តូររូបភាព')}</p>
              </div>
              <button 
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all z-10"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[color:var(--color-primary)] group-hover:scale-110 transition-all mb-4">
                <CloudArrowUpIcon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{t('Select Cover Image', 'ជ្រើសរើសរូបភាពគម្រប')}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('JPG, PNG or WEBP (Max 5MB)', 'JPG, PNG ឬ WEBP (ទំហំអតិបរមា 5MB)')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {description && !preview && (
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2">{description}</p>
      ) }
    </div>
  );
}
