'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../store/authService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  UserIcon, 
  LockClosedIcon, 
  LanguageIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState({ name: '', email: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (session && session.user) {
      setUser({ 
        name: session.user.name || '', 
        email: session.user.email || '',
        image: session.user.image || ''
      });
      if (session.user.image) {
        setImagePreview(session.user.image);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await authService.updateProfile(formData);
      const session = authService.getSession();
      authService.setSession(session.token, res.user);
      setStatus({ type: 'success', message: t('Profile updated successfully!', 'ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានធ្វើបច្ចុប្បន្នភាព!') });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: t('Passwords do not match.', 'ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។') });
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      setStatus({ type: 'success', message: t('Password changed successfully!', 'ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!') });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] focus:bg-white transition-all font-medium text-[color:var(--color-primary)] text-sm";
  const labelClasses = "text-sm font-black text-[color:var(--color-primary)] mb-2 ml-1 flex items-center gap-2 uppercase tracking-widest";

  return (
    <div className="space-y-6 pb-20">
      {/* High-Density Glass Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center text-white shadow-lg">
            <Cog6ToothIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('System Settings', 'ការកំណត់ប្រព័ន្ធ')}</h1>
            <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5">
              {t('Account & Localization', 'គណនី និង ភាសា')}
            </p>
          </div>
        </div>

        {status.message && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest shadow-sm border ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
            }`}
          >
            {status.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationCircleIcon className="w-4 h-4" />}
            {status.message}
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--color-primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[color:var(--color-primary)] uppercase tracking-tight">{t('Profile Details', 'ព័ត៌មានផ្ទាល់ខ្លួន')}</h3>
              <p className="text-[10px] text-[color:var(--color-primary)]/40 font-bold uppercase tracking-widest">{t('Public Identity', 'អត្តសញ្ញាណជាសាធារណៈ')}</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-6 mb-2">
              <div className="relative group cursor-pointer w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-[color:var(--color-primary)] transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">{t('Upload', 'បញ្ចូល')}</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-[color:var(--color-primary)]">{t('Profile Picture', 'រូបភាពផ្ទាល់ខ្លួន')}</h4>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{t('JPG, PNG, GIF max 2MB', 'ទំហំអតិបរមា 2MB')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t('Full Name', 'ឈ្មោះពេញ')}</label>
              <div className="relative group">
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[color:var(--color-primary)] transition-colors" />
                <input 
                  type="text" 
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className={`${inputClasses} pl-12`} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>{t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}</label>
              <div className="relative group">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[color:var(--color-primary)] transition-colors" />
                <input 
                  type="email" 
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className={`${inputClasses} pl-12`}
                />
              </div>
            </div>
            <div className="md:col-span-2 pt-6 border-t border-gray-50 flex justify-end">
              <button 
                disabled={loading}
                className="px-8 py-3.5 bg-[color:var(--color-primary)] text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[color:var(--color-primary)]/10 disabled:opacity-50 text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {t('Save Profile Update', 'រក្សាទុកការកែប្រែ')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Security Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <LockClosedIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[color:var(--color-primary)] uppercase tracking-tight">{t('Security', 'សុវត្ថិភាព')}</h3>
              <p className="text-[10px] text-[color:var(--color-primary)]/40 font-bold uppercase tracking-widest">{t('Password Manager', 'គ្រប់គ្រងពាក្យសម្ងាត់')}</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className={labelClasses}>{t('Current Password', 'ពាក្យសម្ងាត់បច្ចុប្បន្ន')}</label>
              <input 
                type="password" 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className={inputClasses} 
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-50">
              <label className={labelClasses}>{t('New Password', 'ពាក្យសម្ងាត់ថ្មី')}</label>
              <input 
                type="password" 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className={inputClasses} 
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>{t('Confirm New Password', 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី')}</label>
              <input 
                type="password" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className={inputClasses} 
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-6">
              <button 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-600/20 disabled:opacity-50 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {t('Update Access Key', 'ធ្វើបច្ចុប្បន្នភាព')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Localization Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3 bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <LanguageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[color:var(--color-primary)] uppercase tracking-tight">{t('Localization', 'ភាសា និង តំបន់')}</h3>
              <p className="text-[10px] text-[color:var(--color-primary)]/40 font-bold uppercase tracking-widest">{t('Dashboard Preferences', 'សម័យបង្ហាញ')}</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 w-full md:w-auto">
            <button 
              onClick={() => setLang('en')}
              className={`flex-1 md:w-32 py-3 rounded-xl text-xs font-black transition-all ${
                lang === 'en' ? 'bg-[color:var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ENGLISH
            </button>
            <button 
              onClick={() => setLang('kh')}
              className={`flex-1 md:w-32 py-3 rounded-xl text-xs font-black transition-all ${
                lang === 'kh' ? 'bg-[color:var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ខ្មែរ
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
