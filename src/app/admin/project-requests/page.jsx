'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Trash2, 
  User, 
  Mail, 
  ChevronDown, 
  Search, 
  Clock, 
  Phone, 
  Send,
  Building,
  RotateCw
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { lang } = useLanguage();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/project-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch project requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`/project-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm(t('Are you sure you want to delete this project request?', 'តើអ្នកប្រាកដជាចង់លុបសំណើគម្រោងនេះទេ?'))) return;
    try {
      const res = await apiFetch(`/project-requests/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const counts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      reviewed: requests.filter(r => r.status === 'reviewed').length,
      in_progress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const name = r.name || '';
      const email = r.email || '';
      const business = r.businessName || '';
      const phone = r.phoneNumber || '';

      const matchesSearch = 
        name.toLowerCase().includes(search.toLowerCase()) || 
        email.toLowerCase().includes(search.toLowerCase()) ||
        business.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search);

      const matchesStatus = 
        statusFilter === 'ALL' || 
        r.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': 
        return { label: t('Pending', 'រង់ចាំ'), bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'reviewed': 
        return { label: t('Reviewed', 'បានពិនិត្យ'), bg: 'bg-blue-50 text-[#0050C3] border-blue-200' };
      case 'in_progress': 
        return { label: t('In Progress', 'កំពុងដំណើរការ'), bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'completed': 
        return { label: t('Completed', 'បានបញ្ចប់'), bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default: 
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-3.5 pb-10">
      {/* 1. Header Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xs rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sticky top-4 z-40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050C3] to-[#0088FE] flex items-center justify-center text-white shadow-2xs shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('Project Requests', 'សំណើគម្រោង')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {requests.length} {t('Total Inquiries', 'សំណើសរុប')} • {counts.pending} {t('Pending', 'រង់ចាំ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search requests...', 'ស្វែងរកសំណើ...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-48 sm:w-60"
            />
          </div>

          <button 
            type="button"
            onClick={fetchRequests}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 transition-all shadow-2xs cursor-pointer"
            title={t('Refresh', 'ផ្ទុកឡើងវិញ')}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* 2. Metrics & Status Filters */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">{t('Pipeline:', 'ដំណាក់កាល:')}</span>
          <span className="text-amber-700 font-bold">{counts.pending} {t('Pending', 'រង់ចាំ')}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#0050C3] font-bold">{counts.reviewed} {t('Reviewed', 'បានពិនិត្យ')}</span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-700 font-bold">{counts.in_progress} {t('In Progress', 'ដំណើរការ')}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">{counts.completed} {t('Done', 'បញ្ចប់')}</span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'ALL', label: t('All', 'ទាំងអស់'), count: counts.all },
            { id: 'pending', label: t('Pending', 'រង់ចាំ'), count: counts.pending },
            { id: 'reviewed', label: t('Reviewed', 'បានពិនិត្យ'), count: counts.reviewed },
            { id: 'in_progress', label: t('In Progress', 'ដំណើរការ'), count: counts.in_progress },
            { id: 'completed', label: t('Done', 'បញ្ចប់'), count: counts.completed },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStatusFilter(pill.id)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === pill.id
                  ? 'bg-white text-[#0050C3] shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* 3. Requests List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('Loading Project Requests...', 'កំពុងទាញយកសំណើគម្រោង...')}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs font-bold">{t('No project requests found matching your filter.', 'មិនមានសំណើគម្រោងត្រូវគ្នានឹងការស្វែងរកទេ។')}</p>
            </div>
          ) : (
            filteredRequests.map((request, index) => {
              const badge = getStatusBadge(request.status);
              const isExpanded = expandedId === request.id;

              return (
                <motion.div
                  layout
                  key={request.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.02 }}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isExpanded 
                      ? 'border-[#0050C3] shadow-md ring-1 ring-[#0050C3]/20' 
                      : 'border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div 
                    className="p-3.5 cursor-pointer flex items-center justify-between gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0050C3] border border-blue-200/60 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{request.name}</h4>
                          <span className={`px-2 py-0.2 rounded-full border text-[9px] font-extrabold uppercase ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
                          <span className="truncate">{request.email}</span>
                          {request.phoneNumber && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="font-semibold text-slate-700 truncate">{request.phoneNumber}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-end pr-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>Business</span>
                        </div>
                        <p className="font-semibold text-slate-700 text-xs truncate max-w-[150px]">{request.businessName || 'Personal'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        {new Date(request.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Brief Details */}
                          <div className="lg:col-span-7 space-y-3.5">
                            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('Primary Goals', 'គោលដៅចម្បង')}</p>
                                <p className="text-xs font-medium text-slate-700 leading-relaxed">{request.websiteGoals || t('No goals specified', 'មិនបានបញ្ជាក់គោលដៅ')}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t('Pages Needed', 'ទំព័រដែលត្រូវការ')}</p>
                                  <p className="text-xs font-bold text-slate-900">{request.pagesNeeded || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t('Design Style', 'រចនាប័ទ្មរចនា')}</p>
                                  <p className="text-xs font-bold text-slate-900">{request.designPreference || 'N/A'}</p>
                                </div>
                              </div>
                              {request.competitors && (
                                <div className="pt-2.5 border-t border-slate-100">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t('Competitors / References', 'ឯកសារយោង / ដៃគូប្រកួត')}</p>
                                  <p className="text-xs font-medium text-slate-600">{request.competitors}</p>
                                </div>
                              )}
                            </div>

                            {/* Status Change Strip */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">{t('Update Status:', 'ប្តូរស្ថានភាព:')}</span>
                              {['pending', 'reviewed', 'in_progress', 'completed'].map(s => (
                                <button
                                  key={s}
                                  type="button"
                                  disabled={updatingId === request.id}
                                  onClick={() => updateStatus(request.id, s)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    request.status === s 
                                      ? 'bg-[#0050C3] text-white shadow-2xs font-extrabold' 
                                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100'
                                  }`}
                                >
                                  {s.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Contact & Actions */}
                          <div className="lg:col-span-5 space-y-3 lg:border-l lg:border-slate-200/80 lg:pl-5 flex flex-col justify-between">
                            <div className="space-y-2.5">
                              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Phone Number', 'លេខទូរស័ព្ទ')}</span>
                                  <span className="font-semibold text-slate-900">{request.phoneNumber || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Submitted', 'កាលបរិច្ឆេទ')}</span>
                                  <span className="font-mono text-slate-700 text-[11px]">{new Date(request.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <a 
                                href={`mailto:${request.email}`}
                                className="w-full py-2 px-3 bg-[#0050C3] hover:bg-[#003da0] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5" /> 
                                <span>{t('Reply via Email', 'ឆ្លើយតបតាម Email')}</span>
                              </a>

                              {request.phoneNumber && (
                                <a 
                                  href={`https://t.me/${request.phoneNumber.replace('+', '').replace(/\s/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{t('Contact via Telegram', 'ទាក់ទងតាម Telegram')}</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => deleteRequest(request.id)}
                                className="w-full py-2 px-3 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> 
                                <span>{t('Delete Request', 'លុបសំណើ')}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
