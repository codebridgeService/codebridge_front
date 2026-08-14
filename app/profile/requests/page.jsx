'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../store/authService';
import { 
  BriefcaseIcon, 
  ClockIcon, 
  ChevronDownIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { lang } = useLanguage();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (session && session.user) {
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase">
          {t('My Project Briefs', 'សំណើគម្រោងរបស់ខ្ញុំ')}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {t('Track the status and details of your project initiation requests.', 'តាមដានស្ថានភាព និងព័ត៌មានលម្អិតនៃសំណើចាប់ផ្តើមគម្រោងរបស់អ្នក។')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {requests.length} {t('Submissions Found', 'បានរកឃើញការដាក់ស្នើ')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="h-32 bg-gray-50 rounded-3xl animate-pulse flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Briefs...</div>
          ) : requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.id} className={`group bg-white rounded-3xl border transition-all duration-500 overflow-hidden ${
                expandedId === req.id ? 'border-gray-950 shadow-2xl' : 'border-gray-100 hover:border-gray-300 shadow-sm'
              }`}>
                <div 
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10"
                  onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${expandedId === req.id ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-400'}`}>
                      <DocumentMagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-gray-950 text-sm uppercase tracking-tight">{req.businessName || 'Project Initiation'}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(req.createdAt).toLocaleDateString()}</p>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <p className="text-[10px] font-bold text-[color:var(--color-primary)] uppercase tracking-wider">{req.businessType || 'General'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] ${getStatusColor(req.status)}`}>
                      {req.status.replace('_', ' ')}
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === req.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === req.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-50 bg-gray-50/30"
                    >
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Primary Goals</h5>
                            <p className="text-xs font-medium text-gray-700 bg-white p-4 rounded-xl border border-gray-100/50 shadow-sm leading-relaxed italic">
                              "{req.websiteGoals || 'No goals specified'}"
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Pages</h5>
                              <p className="text-[10px] font-bold text-gray-900 bg-white p-3 rounded-xl border border-gray-100/50 shadow-sm">{req.pagesNeeded || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Design</h5>
                              <p className="text-[10px] font-bold text-gray-900 bg-white p-3 rounded-xl border border-gray-100/50 shadow-sm">{req.designPreference || 'N/A'}</p>
                            </div>
                            <div className="col-span-2 space-y-2">
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">ID Reference</h5>
                              <p className="text-[9px] font-mono text-gray-400 bg-white/50 p-2 rounded-lg border border-gray-100/50 truncate tracking-tight">{req.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
              <ClockIcon className="w-10 h-10 text-gray-200 mx-auto mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('No project requests yet.', 'មិនទាន់មានសំណើគម្រោងនៅឡើយទេ។')}</p>
              <Link href="/services" className="mt-6 inline-block text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest hover:underline">
                {t('View Service Packages', 'មើលកញ្ចប់សេវាកម្ម')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
