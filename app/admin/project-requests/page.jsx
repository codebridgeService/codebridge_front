'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BriefcaseIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  UserIcon, 
  EnvelopeIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { authService } from '../../store/authService';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const { lang } = useLanguage();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/project-requests', {
        headers: authService.getAuthHeader()
      });
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/project-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const res = await fetch(`/api/project-requests/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader()
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[color:var(--color-primary)] text-white rounded-2xl shadow-lg rotate-3 overflow-hidden">
               <BriefcaseIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-[color:var(--color-primary)] uppercase tracking-tighter">
              {t("Project Requests", "សំណើគម្រោង")}
            </h1>
          </div>
          <p className="text-sm font-bold text-[color:var(--color-primary)]/60 uppercase tracking-widest ml-12">
            {t("Manage incoming briefs and leads", "គ្រប់គ្រងសំណើនិងអតិថិជនសក្តានុពល")}
          </p>
        </div>

        <div className="relative group">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[color:var(--color-primary)] transition-colors" />
          <input 
            type="text" 
            placeholder={t("Search requests...", "ស្វែងរកសំណើ...")}
            className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl w-full md:w-80 focus:bg-white focus:ring-2 focus:ring-[color:var(--color-primary)]/5 transition-all font-bold text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Kinetic List */}
      <div className="space-y-4 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredRequests.map((request, index) => (
            <motion.div
              layout
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                expandedId === request.id ? 'border-[color:var(--color-primary)] shadow-2xl shadow-[color:var(--color-primary)]/5 ring-1 ring-[color:var(--color-primary)]' : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200'
              }`}
            >
              <div 
                className="p-6 cursor-pointer flex items-center justify-between gap-4"
                onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <UserIcon className="w-6 h-6 text-gray-400" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[color:var(--color-primary)] text-base truncate uppercase tracking-tight">{request.name}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-gray-400 truncate">{request.email}</p>
                        {request.phoneNumber && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                            <p className="text-xs font-bold text-[color:var(--color-primary)] truncate">{request.phoneNumber}</p>
                          </>
                        )}
                      </div>
                   </div>

                   <div className="hidden md:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business</p>
                      <p className="font-black text-[color:var(--color-primary)] text-xs truncate">{request.businessName || 'N/A'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                   </div>
                   <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedId === request.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {expandedId === request.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-50 bg-gray-50/30"
                  >
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                       <div className="space-y-8">
                           <div>
                              <h5 className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-[0.2em] mb-4">Project Brief</h5>
                              <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                                 <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Primary Goals</p>
                                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{request.websiteGoals || 'No goals specified'}</p>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div>
                                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Pages Needed</p>
                                       <p className="text-xs font-black text-[color:var(--color-primary)]">{request.pagesNeeded || 'N/A'}</p>
                                    </div>
                                    <div>
                                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Design Style</p>
                                       <p className="text-xs font-black text-[color:var(--color-primary)]">{request.designPreference || 'N/A'}</p>
                                    </div>
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-4 mb-1">Competitors</p>
                                    <p className="text-xs font-medium text-gray-600">{request.competitors || 'None mentioned'}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-wrap gap-3">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mark Status:</span>
                              {['pending', 'reviewed', 'in_progress', 'completed'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateStatus(request.id, s)}
                                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                    request.status === s 
                                      ? 'bg-[color:var(--color-primary)] text-white shadow-lg' 
                                      : 'bg-white text-gray-400 hover:text-[color:var(--color-primary)] border border-gray-100'
                                  }`}
                                >
                                  {s.replace('_', ' ')}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* Meta & Actions */}
                        <div className="space-y-8 lg:border-l lg:border-gray-100 lg:pl-12">
                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                                  <p className="font-black text-xs text-[color:var(--color-primary)]">{request.phoneNumber || 'Not provided'}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Submitted On</p>
                                  <p className="font-black text-xs text-[color:var(--color-primary)]">{new Date(request.createdAt).toLocaleString()}</p>
                               </div>
                            </div>

                            <div className="space-y-4">
                              <a 
                                href={`mailto:${request.email}`}
                                className="w-full py-4 bg-[color:var(--color-primary)] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-blue-900 flex items-center justify-center gap-3 shadow-xl shadow-[color:var(--color-primary)]/10"
                              >
                                 <EnvelopeIcon className="w-4 h-4" /> Reply via Email
                              </a>
                              {request.phoneNumber && (
                                <a 
                                  href={`https://t.me/${request.phoneNumber.replace('+', '').replace(/\s/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-blue-600 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10"
                                >
                                   <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.64-.35-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2s-.21-.05-.3-.03c-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.73-3.32 3.68-1.52 4.44-1.78 4.94-1.79.11 0 .35.03.5.16.13.11.17.26.18.37 0 .01 0 .01 0 .02z"/>
                                   </svg>
                                   Contact via Telegram
                                </a>
                              )}
                              <button
                                onClick={() => deleteRequest(request.id)}
                                className="w-full py-4 text-red-500 bg-red-50 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-red-100 flex items-center justify-center gap-3"
                              >
                                 <TrashIcon className="w-4 h-4" /> Delete Request
                              </button>
                            </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {!loading && filteredRequests.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-gray-300" />
               </div>
               <p className="text-gray-400 font-bold uppercase tracking-widest">{t("No requests found.", "មិនមានសំណើត្រូវបានរកឃើញទេ។")}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
