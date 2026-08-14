'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  UserGroupIcon, 
  BriefcaseIcon,
  CircleStackIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckBadgeIcon,
  LinkIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  ChevronRightIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { authService } from '../store/authService';

import { apiFetch } from '../lib/api';
import { securityService } from '../store/securityService';

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const [data, setData] = useState({ stats: null, recentUsers: [], recentMessages: [] });
  const [securityStats, setSecurityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [res, sec] = await Promise.all([
        apiFetch('/admin/stats'),
        securityService.getSecurityStats().catch(() => null),
      ]);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
      if (sec) {
        setSecurityStats(sec);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      name: 'Users', 
      kh: 'អ្នកប្រើប្រាស់', 
      value: data?.users || 0, 
      icon: UsersIcon, 
      color: 'text-[color:var(--color-primary)]', 
      bg: 'bg-[color:var(--color-primary)]/5',
      link: '/admin/users',
      trend: '+12%'
    },
    { 
      name: 'Messages', 
      kh: 'សារសាកសួរ', 
      value: data?.contactMessages || 0, 
      icon: EnvelopeIcon, 
      color: 'text-[color:var(--color-primary)]', 
      bg: 'bg-[color:var(--color-primary)]/5',
      link: '/admin/messages',
      trend: 'New'
    },
    { 
      name: 'Services', 
      kh: 'សេវាកម្ម', 
      value: data?.services || 0, 
      icon: BriefcaseIcon, 
      color: 'text-[color:var(--color-primary)]', 
      bg: 'bg-[color:var(--color-primary)]/5',
      link: '/admin/services',
      trend: 'Live'
    },
    { 
      name: 'Portfolio', 
      kh: 'ស្នាដៃ', 
      value: data?.packages || 0, 
      icon: SparklesIcon, 
      color: 'text-[color:var(--color-primary)]', 
      bg: 'bg-[color:var(--color-primary)]/5',
      link: '/admin/packages',
      trend: 'Active'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Widget (Condensed) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-[color:var(--color-primary)] p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-[color:var(--color-secondary)]">
               <ShieldCheckIcon className="w-3 h-3" />
               {t('ADMIN DASHBOARD SECURED', 'ការចូលប្រើប្រាស់ត្រូវបានធានា')}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black mb-4 tracking-tighter leading-none text-white">
               {t('Welcome back,', 'សូមស្វាគមន៍មកវិញ')} <br/>
               <span className="text-[color:var(--color-secondary)] bg-gradient-to-r from-[color:var(--color-secondary)] to-[color:var(--color-primary)] bg-clip-text text-transparent">Codebridge</span>
            </h1>
            <p className="text-gray-400 font-medium max-w-sm text-xs lg:text-sm leading-relaxed opacity-80 uppercase tracking-widest">
               {t('Everything is running smoothly! Check your messages and manage your services.', 'ប្រព័ន្ធដំណើរការបានល្អ។ ពិនិត្យសារ និងគ្រប់គ្រងសេវាកម្មរបស់អ្នក។')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10 group">
                <p className="text-[10px] font-black text-[color:var(--color-secondary)] opacity-60 uppercase tracking-[0.2em] mb-1">{t('Customer Satisfaction', 'ការពេញចិត្តរបស់អតិថិជន')}</p>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black text-white">{data?.customerSatisfaction ?? 100}%</span>
                   <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-[color:var(--color-secondary)] transition-all duration-1000" style={{ width: `${data?.customerSatisfaction ?? 100}%` }} />
                </div>
             </div>
             <div className="p-6 rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10">
                <p className="text-[10px] font-black text-[color:var(--color-secondary)] opacity-60 uppercase tracking-[0.2em] mb-1">{t('Avg Response Time', 'ពេលវេលាឆ្លើយតប')}</p>
                <span className="text-2xl font-black text-white">{data?.avgResponseTimeHours ?? 0} hrs</span>
                <p className={`text-[10px] font-black mt-2 tracking-widest ${(data?.avgResponseTimeHours || 0) < 12 ? 'text-emerald-400' : 'text-amber-400'}`}>
                   {(data?.avgResponseTimeHours || 0) < 12 ? 'EXCELLENT' : 'NEEDS IMPROVEMENT'}
                </p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Condensed Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative p-6 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                 <div className={`w-12 h-12 flex items-center justify-center rounded-[1rem] ${stat.bg} ${stat.color} shadow-inner`}>
                   <Icon className="w-6 h-6" />
                 </div>
                 <div className="text-[10px] uppercase font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full tracking-widest">
                   {stat.trend}
                 </div>
              </div>
              <div>
                 <h3 className="text-gray-400 font-black tracking-[0.1em] uppercase text-[11px] mb-2">{t(stat.name, stat.kh)}</h3>
                 <span className="text-4xl font-black text-[color:var(--color-primary)] tracking-tighter">
                   {loading ? '...' : stat.value}
                 </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* System Analytics Graph */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-lg overflow-hidden flex flex-col p-8">
               <div className="flex items-center justify-between mb-10">
                   <div>
                    <h3 className="text-xl font-black text-[color:var(--color-primary)] uppercase leading-none">{t('Website Visitors', 'ចំនួនអ្នកចូលមើលគេហទំព័រ')}</h3>
                    <p className="text-[11px] text-[color:var(--color-primary)] font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">ACTIVITY THIS WEEK</p>
                  </div>
                  <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                     <button className="px-5 py-2.5 rounded-lg text-[10px] font-black bg-[color:var(--color-primary)] text-white uppercase tracking-widest shadow-sm">Week</button>
                   <button className="px-5 py-2.5 rounded-lg text-[10px] font-black bg-transparent text-gray-400 uppercase tracking-widest hover:text-[color:var(--color-primary)] transition-colors">Month</button>
                  </div>
               </div>
               
               {/* Pure CSS Bar Chart */}
               <div className="h-72 flex items-end justify-between gap-3 mt-auto">
                  {[40, 65, 45, 90, 60, 85, 100].map((height, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                        <div className="w-full flex-1 flex items-end relative">
                           <motion.div 
                             initial={{ height: 0 }} 
                             animate={{ height: `${height}%` }}
                             transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                             className={`w-full rounded-2xl transition-all ${i === 6 ? 'bg-[color:var(--color-primary)] shadow-xl shadow-[color:var(--color-primary)]/30 scale-100' : 'bg-gray-100 group-hover:bg-[color:var(--color-secondary)]/10 group-hover:scale-105'} flex flex-col justify-start items-center p-2`} 
                           >
                              {i === 6 && <div className="w-2.5 h-2.5 bg-white rounded-full mt-2 shadow-sm" />}
                           </motion.div>
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${i === 6 ? 'text-[color:var(--color-primary)]' : 'text-gray-400'}`}>
                          {['MON','TUE','WED','THU','FRI','SAT','SUN'][i]}
                        </span>
                     </div>
                  ))}
               </div>
          </div>
        </div>

        {/* Small Sidebars */}
        <div className="space-y-6">
            {/* Attack Shield Security Widget */}
            <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] rounded-[2rem] p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t('SHIELD ACTIVE', 'ប្រព័ន្ធការពារសកម្ម')}
                     </div>
                     <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                  </div>

                  <h4 className="text-sm font-black text-white mb-1">
                    {t('Attack Shield & IP Defense', 'ការការពារ និងបិទខ្ទប់ IP')}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mb-4">
                    {t('Malicious bot and flood attack monitoring', 'ទប់ស្កាត់ការវាយប្រហារ និង Bot')}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                     <div>
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider block">{t('Blocked IPs', 'IP បិទខ្ទប់')}</span>
                        <span className="text-xl font-black text-white">{securityStats?.totalActiveBlocks || 0}</span>
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider block">{t('Threats Blocked', 'ការទប់ស្កាត់')}</span>
                        <span className="text-xl font-black text-white">{securityStats?.totalAttacksDefended || 0}</span>
                     </div>
                  </div>

                  <Link 
                    href="/admin/security"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all group/btn"
                  >
                    <span>{t('Manage IP Bans', 'គ្រប់គ្រងការបិទ IP')}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>

            <div className="bg-[color:var(--color-primary)] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{t('New Messages', 'កំណើន')}</h3>
                     <div className="h-10 flex items-end gap-1.5">
                        {[30, 70, 40, 90, 60].map((h, i) => (
                          <div key={i} className="w-2.5 bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-2xl font-black tracking-tighter">+{data?.contactMessages || 0}</span>
                     <span className="text-[11px] font-black text-emerald-400">+12%</span>
                  </div>
               </div>
            </div>

           <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3 mb-4">{t('Quick Links', 'ផ្លូវកាត់')}</h3>
              <div className="grid grid-cols-2 gap-2">
                 <Link href="/admin/settings" className="p-4 bg-gray-50 rounded-[1.25rem] hover:bg-[color:var(--color-primary)] hover:text-white transition-all text-center">
                    <BoltIcon className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{t('Settings', 'ការកំណត់')}</span>
                 </Link>
                 <Link href="/admin/services/new" className="p-4 bg-gray-50 rounded-[1.25rem] hover:bg-[color:var(--color-primary)] hover:text-white transition-all text-center">
                    <PlusCircleIcon className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{t('Add Service', 'បន្ថែម')}</span>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PlusCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
