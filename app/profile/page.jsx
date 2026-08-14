'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../store/authService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { lang } = useLanguage();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (session && session.user) {
      setUser(session.user);
      fetchUserRequests(session.user.email);
    }
  }, []);

  const fetchUserRequests = async (email) => {
    try {
      const res = await fetch(`/api/project-requests?email=${email}`, {
        headers: authService.getAuthHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'reviewed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'in_progress': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (!user) return (
    <div className="w-full flex flex-col space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
      <div className="h-64 w-full bg-gray-100 rounded-3xl"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] tracking-tight transition-colors duration-300">
          {t('Account Overview', 'ទិដ្ឋភាពទូទៅនៃគណនី')}
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] font-medium transition-colors duration-300">
          {t('Manage your personal information and track your project requests.', 'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងតាមដានសំណើគម្រោងរបស់អ្នក។')}
        </p>
      </div>

      <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] rounded-[2rem] p-5 sm:p-6 transition-colors duration-500">
        <h2 className="text-lg font-bold text-[color:var(--text-main)] mb-6 flex items-center gap-2 transition-colors duration-300">
          <UserIcon className="w-5 h-5 text-[color:var(--color-primary)]" />
          {t('Personal Details', 'ព័ត៌មានផ្ទាល់ខ្លួន')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-widest transition-colors duration-300">{t('Full Name', 'ឈ្មោះពេញ')}</span>
            <p className="text-base font-bold text-[color:var(--text-main)] bg-[color:var(--bg-main)] p-3 sm:px-5 rounded-2xl border border-[color:var(--border-main)] shadow-sm transition-colors duration-300">{user.name}</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-widest transition-colors duration-300">{t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}</span>
            <p className="text-base font-bold text-[color:var(--text-main)] bg-[color:var(--bg-main)] p-3 sm:px-5 rounded-2xl border border-[color:var(--border-main)] shadow-sm flex items-center gap-3 shrink-0 truncate transition-colors duration-300">
              <EnvelopeIcon className="w-4 h-4 text-[color:var(--text-muted)] shrink-0 transition-colors duration-300" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[color:var(--border-main)] flex justify-end transition-colors duration-300">
          <Link href="/profile/edit" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black text-center rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-sm uppercase tracking-widest">
            {t('Edit Details', 'កែប្រែព័ត៌មាន')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
