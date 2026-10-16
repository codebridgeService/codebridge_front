'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { securityService } from '@/store/securityService';
import { 
  ShieldCheckIcon, 
  ShieldExclamationIcon,
  NoSymbolIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  LockClosedIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ServerIcon,
  FireIcon,
  BoltIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Toast from '../components/Toast';

export default function SecurityManagementPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [blockedIPs, setBlockedIPs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, auto, manual, permanent

  // Action states
  const [actionLoading, setActionLoading] = useState(null); // ip string being unblocked
  const [toast, setToast] = useState(null);

  // Block Modal
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({
    ip: '',
    durationMinutes: 15,
    isPermanent: false,
    reason: 'Manual ban by administrator',
  });
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

  // Clear All Modal
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const fetchSecurityData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [ipData, statsData] = await Promise.all([
        securityService.getBlockedIPs(),
        securityService.getSecurityStats().catch(() => null),
      ]);
      setBlockedIPs(ipData.blockedIPs || []);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Error fetching security data:', err);
      if (!isSilent) {
        setToast({ type: 'error', message: err.message || 'Failed to fetch security data' });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurityData();
    // Auto-refresh every 8 seconds
    const interval = setInterval(() => {
      fetchSecurityData(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchSecurityData]);

  // Live countdown timer updater (ticks every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockedIPs((prev) =>
        prev
          .map((item) => {
            if (item.isPermanent || !item.remainingSeconds) return item;
            const updated = item.remainingSeconds - 1;
            return {
              ...item,
              remainingSeconds: updated > 0 ? updated : 0,
            };
          })
          .filter((item) => item.isPermanent || item.remainingSeconds > 0)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnblock = async (ip) => {
    setActionLoading(ip);
    try {
      await securityService.unblockIP(ip);
      setBlockedIPs((prev) => prev.filter((b) => b.ip !== ip));
      setToast({
        type: 'success',
        message: t(`IP ${ip} has been successfully unblocked.`, `អាសយដ្ឋាន IP ${ip} ត្រូវបានដោះសោជោគជ័យ។`),
      });
      fetchSecurityData(true);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to unblock IP',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearAll = async () => {
    setIsClearingAll(true);
    try {
      const res = await securityService.clearAllBlocks();
      setBlockedIPs([]);
      setShowClearAllModal(false);
      setToast({
        type: 'success',
        message: t(`All active IP bans have been removed.`, `ការហាមឃាត់ IP ទាំងអស់ត្រូវបានលុបចោល។`),
      });
      fetchSecurityData(true);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to clear IP blocks',
      });
    } finally {
      setIsClearingAll(false);
    }
  };

  const handleBlockSubmit = async (e) => {
    e.preventDefault();
    if (!blockForm.ip.trim()) {
      setToast({ type: 'error', message: 'Please enter a valid IP address' });
      return;
    }

    setIsSubmittingBlock(true);
    try {
      await securityService.blockIP({
        ip: blockForm.ip.trim(),
        durationMinutes: blockForm.isPermanent ? 0 : Number(blockForm.durationMinutes),
        reason: blockForm.reason.trim() || 'Manual ban by administrator',
        isPermanent: blockForm.isPermanent,
      });

      setShowBlockModal(false);
      setBlockForm({
        ip: '',
        durationMinutes: 15,
        isPermanent: false,
        reason: 'Manual ban by administrator',
      });
      setToast({
        type: 'success',
        message: t(`IP has been blocked successfully.`, `IP ត្រូវបានបិទខ្ទប់ដោយជោគជ័យ។`),
      });
      fetchSecurityData(true);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to block IP' });
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const formatSeconds = (seconds) => {
    if (seconds === null || seconds === undefined) return 'Permanent';
    if (seconds <= 0) return 'Expiring...';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const h = Math.floor(m / 60);
    const remainingM = m % 60;

    if (h > 0) {
      return `${h}h ${remainingM}m ${s < 10 ? '0' : ''}${s}s`;
    }
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const filteredIPs = useMemo(() => {
    return blockedIPs.filter((item) => {
      const matchesSearch =
        item.ip.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase()) ||
        (item.blockedBy && item.blockedBy.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'permanent') return item.isPermanent;
      if (filterType === 'auto') return item.blockedBy === 'SYSTEM_ATTACK_SHIELD' || item.reason.includes('attack') || item.reason.includes('flood') || item.reason.includes('attempts');
      if (filterType === 'manual') return item.blockedBy !== 'SYSTEM_ATTACK_SHIELD' && !item.reason.includes('flood') && !item.reason.includes('attack');

      return true;
    });
  }, [blockedIPs, search, filterType]);

  const presetReasons = [
    'Access Denied: Malicious attack detection',
    'High-frequency API flood attack',
    'Exceeded 5 failed login attempts',
    'Malicious bot / vulnerability scanner',
    'Credential stuffing & brute force',
    'Manual ban by administrator',
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header Glassmorphic Shield Card */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-5 sm:p-6 text-white shadow-xl border border-slate-700/50"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[color:var(--color-primary)]/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              {t('ATTACK SHIELD ONLINE & PROTECTING', 'ប្រព័ន្ធការពារកំពុងដំណើរការ')}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{t('Attack Shield & IP Security', 'ប្រព័ន្ធគ្រប់គ្រងសន្តិសុខ និង IP')}</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-xl text-xs sm:text-sm mt-2 leading-relaxed">
              {t(
                'Monitor live blocked IPs, review malicious attack detections, unblock legitimate users, and blacklist hostile attackers in real-time.',
                'ពិនិត្យមើល IP ដែលត្រូវបានបិទខ្ទប់ ដោះសោអ្នកប្រើប្រាស់ និងហាមឃាត់អ្នកវាយប្រហារដោយផ្ទាល់ភ្លាមៗ។'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchSecurityData()}
              disabled={refreshing}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{t('Refresh', 'ផ្ទុកឡើងវិញ')}</span>
            </button>

            {blockedIPs.length > 0 && (
              <button
                onClick={() => setShowClearAllModal(true)}
                className="px-4 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <TrashIcon className="w-4 h-4" />
                <span>{t('Unblock All', 'ដោះសោទាំងអស់')}</span>
              </button>
            )}

            <button
              onClick={() => setShowBlockModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              <PlusIcon className="w-4 h-4 stroke-[3]" />
              <span>{t('+ Block New IP', '+ បិទខ្ទប់ IP ថ្មី')}</span>
            </button>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">
              {t('Active Blocked IPs', 'IP កំពុងបិទខ្ទប់')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{blockedIPs.length}</span>
              <span className="text-[10px] font-bold text-slate-400">Total</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
              {t('Temporary Bans', 'ការបិទបណ្តោះអាសន្ន')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {blockedIPs.filter((b) => !b.isPermanent).length}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Auto-expires</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">
              {t('Permanent Bans', 'ការបិទរហូត')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {blockedIPs.filter((b) => b.isPermanent).length}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Fixed</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">
              {t('Neutralized Attacks', 'ការវាយប្រហារដែលបានទប់ស្កាត់')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {blockedIPs.reduce((acc, b) => acc + (b.attackCount || 1), 0)}
              </span>
              <span className="text-[10px] font-bold text-emerald-400">Hits</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('Search by IP address, reason, or blocker...', 'ស្វែងរកតាម IP, មូលហេតុ...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] text-gray-800 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('All IPs', 'ទាំងអស់'), count: blockedIPs.length },
            { 
              id: 'auto', 
              label: t('Attack Shield', 'ការពារស្វ័យប្រវត្តិ'), 
              count: blockedIPs.filter((b) => b.blockedBy === 'SYSTEM_ATTACK_SHIELD' || b.reason.includes('attack') || b.reason.includes('flood')).length 
            },
            { 
              id: 'manual', 
              label: t('Manual Bans', 'បិទដោយដៃ'), 
              count: blockedIPs.filter((b) => b.blockedBy !== 'SYSTEM_ATTACK_SHIELD' && !b.reason.includes('flood') && !b.reason.includes('attack')).length 
            },
            { 
              id: 'permanent', 
              label: t('Permanent', 'រហូត'), 
              count: blockedIPs.filter((b) => b.isPermanent).length 
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                filterType === tab.id
                  ? 'bg-[color:var(--color-primary)] text-white shadow-md shadow-[color:var(--color-primary)]/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                filterType === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Blocked IP Table / List */}
      <div className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl rounded-[2rem] overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-[color:var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {t('Loading Security Data...', 'កំពុងទាញយកទិន្នន័យសន្តិសុខ...')}
            </p>
          </div>
        ) : filteredIPs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
              <ShieldCheckIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1">
              {search || filterType !== 'all' 
                ? t('No matching blocked IPs found', 'មិនមាន IP ដែលត្រូវគ្នានោះទេ')
                : t('Zero Blocked IPs — All Systems Normal', 'គ្មាន IP ត្រូវបានបិទខ្ទប់ — ប្រព័ន្ធដំណើរការល្អ')
              }
            </h3>
            <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto">
              {search || filterType !== 'all'
                ? t('Try adjusting your search query or filter criteria.', 'សូមព្យាយាមផ្លាស់ប្តូរពាក្យស្វែងរក។')
                : t('No suspicious IP addresses are currently blocked. The Attack Shield is actively scanning traffic for threats.', 'មិនមាន IP សង្ស័យណាមួយត្រូវបានបិទខ្ទប់នោះទេ។ ប្រព័ន្ធការពារកំពុងពិនិត្យចរាចរណ៍។')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">{t('IP Address', 'អាសយដ្ឋាន IP')}</th>
                  <th className="py-4 px-6">{t('Reason / Threat Details', 'មូលហេតុ និងព័ត៌មានលម្អិត')}</th>
                  <th className="py-4 px-6">{t('Incidents', 'ចំនួនវាយប្រហារ')}</th>
                  <th className="py-4 px-6">{t('Time Remaining', 'ពេលវេលានៅសល់')}</th>
                  <th className="py-4 px-6">{t('Blocked By', 'បិទដោយ')}</th>
                  <th className="py-4 px-6 text-right">{t('Action', 'សកម្មភាព')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <AnimatePresence>
                  {filteredIPs.map((item) => (
                    <motion.tr
                      key={item.ip}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* IP Address */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-mono font-bold text-xs border border-red-100 shadow-sm">
                            <NoSymbolIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono font-black text-gray-900 block text-sm tracking-tight">
                              {item.ip}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {item.ip === '127.0.0.1' || item.ip === '::1' ? 'Localhost / Loopback' : 'IPv4 / External'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex items-center gap-2">
                          {item.reason.toLowerCase().includes('flood') ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-bold">
                              <FireIcon className="w-3.5 h-3.5 text-rose-500" />
                              {item.reason}
                            </span>
                          ) : item.reason.toLowerCase().includes('failed') ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
                              <LockClosedIcon className="w-3.5 h-3.5 text-amber-600" />
                              {item.reason}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-bold">
                              <ShieldExclamationIcon className="w-3.5 h-3.5 text-gray-500" />
                              {item.reason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Incident Count */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 font-mono font-black text-xs border border-red-100">
                          <BoltIcon className="w-3 h-3 text-red-500" />
                          {item.attackCount || 1} hits
                        </span>
                      </td>

                      {/* Remaining Time / Countdown */}
                      <td className="py-4 px-6">
                        {item.isPermanent ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider">
                            <NoSymbolIcon className="w-3.5 h-3.5 text-purple-600" />
                            {t('Permanent', 'រហូត')}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit border border-amber-100">
                            <ClockIcon className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>{formatSeconds(item.remainingSeconds)}</span>
                          </div>
                        )}
                      </td>

                      {/* Blocked By */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-gray-500 block truncate max-w-[140px]">
                          {item.blockedBy === 'SYSTEM_ATTACK_SHIELD' ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                              <BoltIcon className="w-3.5 h-3.5" />
                              Attack Shield
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                              {item.blockedBy}
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Unblock Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleUnblock(item.ip)}
                          disabled={actionLoading === item.ip}
                          className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          {actionLoading === item.ip ? (
                            <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>{t('Unblock', 'ដោះសោ')}</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Block IP Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBlockModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 border border-gray-100 z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                    <NoSymbolIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                      {t('Block / Blacklist IP', 'បិទខ្ទប់ / ហាមឃាត់ IP')}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {t('Restrict API access for malicious or hostile clients', 'ហាមឃាត់ការចូលប្រើ API សម្រាប់ IP មិនចង់បាន')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBlockSubmit} className="mt-6 space-y-4">
                {/* IP Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {t('IP Address', 'អាសយដ្ឋាន IP')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 192.168.1.100 or 203.0.113.195"
                    value={blockForm.ip}
                    onChange={(e) => setBlockForm({ ...blockForm, ip: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {t('Ban Duration', 'រយៈពេលនៃការបិទ')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { minutes: 15, label: '15 Mins' },
                      { minutes: 60, label: '1 Hour' },
                      { minutes: 1440, label: '24 Hours' },
                      { minutes: 10080, label: '7 Days' },
                      { minutes: 43200, label: '30 Days' },
                      { permanent: true, label: 'Permanent' },
                    ].map((d, i) => {
                      const isSelected = d.permanent ? blockForm.isPermanent : (!blockForm.isPermanent && blockForm.durationMinutes === d.minutes);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (d.permanent) {
                              setBlockForm({ ...blockForm, isPermanent: true });
                            } else {
                              setBlockForm({ ...blockForm, isPermanent: false, durationMinutes: d.minutes });
                            }
                          }}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reason Presets & Custom Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {t('Reason / Description', 'មូលហេតុ')}
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setBlockForm({ ...blockForm, reason: e.target.value });
                      }
                    }}
                    className="w-full mb-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{t('-- Choose a preset reason --', '-- ជ្រើសរើសមូលហេតុគំរូ --')}</option>
                    {presetReasons.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                    placeholder="Custom reason..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowBlockModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs transition-colors"
                  >
                    {t('Cancel', 'បោះបង់')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBlock}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmittingBlock && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t('Confirm & Block IP', 'បញ្ជាក់ និងបិទខ្ទប់')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearAllModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-6 border border-gray-100 z-10 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                {t('Unblock All IPs?', 'ដោះសោ IP ទាំងអស់?')}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                {t(
                  `Are you sure you want to remove bans on all ${blockedIPs.length} active blocked IPs? All previously banned clients will immediately regain access.`,
                  `តើអ្នកប្រាកដជាចង់លុបចោលការបិទខ្ទប់ IP ទាំងអស់ចំនួន ${blockedIPs.length} ដែរឬទេ?`
                )}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearAllModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs transition-colors"
                >
                  {t('Cancel', 'បោះបង់')}
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isClearingAll}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                >
                  {isClearingAll && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t('Yes, Unblock All', 'បាទ/ចាស ដោះសោទាំងអស់')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
