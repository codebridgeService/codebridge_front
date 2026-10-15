'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { authService } from '@/store/authService';
import { apiFetch } from '@/lib/api';
import { securityService } from '@/store/securityService';
import { siteSettingService } from '@/store/siteSettingService';
import {
  LayoutDashboard,
  Inbox,
  Mail,
  Wrench,
  Package,
  Layers,
  Users,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  BarChart3,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ListOrdered,
  Settings,
  Shield
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [securityStats, setSecurityStats] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (session?.user) {
      setUser(session.user);
    }
    loadDashboardData();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(lang === 'kh' ? 'km-KH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsRes, secRes, settingsRes, reqRes, msgRes] = await Promise.all([
        apiFetch('/admin/stats').catch(() => null),
        securityService.getSecurityStats().catch(() => null),
        siteSettingService.getSettings().catch(() => null),
        apiFetch('/project-requests').catch(() => null),
        apiFetch('/admin/messages').catch(() => null),
      ]);

      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (secRes) {
        setSecurityStats(secRes);
      }
      if (settingsRes) {
        setSiteSettings(settingsRes);
      }
      if (reqRes && reqRes.ok) {
        const reqData = await reqRes.json();
        if (Array.isArray(reqData)) {
          setRecentRequests(reqData.slice(0, 5));
        }
      }
      if (msgRes && msgRes.ok) {
        const msgData = await msgRes.json();
        if (Array.isArray(msgData)) {
          setRecentMessages(msgData.slice(0, 4));
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(t('Failed to load real-time telemetry.', 'មិនអាចទាញយកទិន្នន័យបានទេ។'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // 8 Dynamic Homepage Sections
  const sectionList = [
    { name: 'Hero Banner', kh: 'ផ្ទាំងដើម', key: 'showHero', icon: Sparkles, desc: 'Top brand intro and value proposition' },
    { name: 'Services Catalog', kh: 'សេវាកម្ម', key: 'showServices', icon: Wrench, desc: 'Professional technical solutions' },
    { name: 'Pricing Packages', kh: 'កញ្ចប់តម្លៃ', key: 'showPackages', icon: Package, desc: 'Tiered delivery estimates' },
    { name: 'Portfolio Showcase', kh: 'ស្នាដៃគម្រោង', key: 'showPortfolio', icon: Layers, desc: 'Delivered client applications' },
    { name: 'Team Roster', kh: 'សមាជិកក្រុម', key: 'showTeam', icon: Users, desc: 'Leadership and engineers' },
    { name: 'Knowledge FAQs', kh: 'សំណួរញឹកញាប់', key: 'showFAQ', icon: HelpCircle, desc: 'Frequently asked questions' },
    { name: 'How We Work', kh: 'ដំណាក់កាល', key: 'showWorkflow', icon: ListOrdered, desc: '4-step execution lifecycle' },
    { name: 'Trust & Shield', kh: 'ទំនុកចិត្ត', key: 'showSecurity', icon: Shield, desc: 'Enterprise security guarantees' },
  ];

  return (
    <div className="space-y-3.5 w-full pb-6">
      
      {/* 1. Royal Iris/Sapphire Hero Banner */}
      <div className="bg-gradient-to-r from-[color:var(--color-primary)] via-[#273499] to-[#378ADD] rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Ambient Blur Glows */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CodeBridges Cloud Platform Engine</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-[10px] text-white/90">{currentTime || '00:00:00'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('Platform Operations & Executive Cockpit', 'ផ្ទាំងបញ្ជាប្រតិបត្តិការ និងគ្រប់គ្រងជាន់ខ្ពស់')}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            {t(
              'Centralized client inquiries management, real-time Attack Shield telemetry, CMS catalog orchestration, and site settings.',
              'គ្រប់គ្រងសំណើអតិថិជន ប្រព័ន្ធការពារសុវត្ថិភាព និងមាតិកាគេហទំព័រទាំងអស់នៅកន្លែងតែមួយ។'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            type="button"
            onClick={loadDashboardData}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('Refresh Telemetry', 'ផ្ទុកឡើងវិញ')}</span>
          </button>

          <Link
            href="/admin/project-requests"
            className="px-4 py-2.5 rounded-xl bg-white text-[color:var(--color-primary)] font-extrabold text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Inbox className="w-4 h-4" />
            <span>{t('Manage Inquiries', 'គ្រប់គ្រងសំណើ')}</span>
          </Link>

          <Link
            href="/admin/services/new"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('New Service', 'សេវាកម្មថ្មី')}</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadDashboardData}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Top Navigation Tabs with Reference Styling */}
      <div className="flex border-b border-slate-200/80 gap-2 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-extrabold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#0050C3] bg-blue-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#0050C3]' : ''}`} />
          <span className={activeTab === 'overview' ? 'text-gradient-brand' : ''}>{t('Executive Overview', 'ទិដ្ឋភាពរួម')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 font-extrabold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-[#0050C3] bg-blue-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Inbox className={`w-4 h-4 ${activeTab === 'inquiries' ? 'text-[#0050C3]' : ''}`} />
          <span className={activeTab === 'inquiries' ? 'text-gradient-brand' : ''}>{t('Inquiries & CRM', 'សំណើ & អតិថិជន')}</span>
          {stats?.projectRequests > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
              {stats.projectRequests}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 font-extrabold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#0050C3] bg-blue-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <ShieldAlert className={`w-4 h-4 ${activeTab === 'security' ? 'text-[#0050C3]' : ''}`} />
          <span className={activeTab === 'security' ? 'text-gradient-brand' : ''}>{t('Security & Defense', 'ការការពារសុវត្ថិភាព')}</span>
          {securityStats?.totalActiveBlocks > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
              {securityStats.totalActiveBlocks}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 font-extrabold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sections'
              ? 'border-[#0050C3] bg-blue-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'sections' ? 'text-[#0050C3]' : ''}`} />
          <span className={activeTab === 'sections' ? 'text-gradient-brand' : ''}>{t('Homepage Sections', 'ផ្នែកគេហទំព័រ')}</span>
        </button>
      </div>

      {/* 3. Platform KPI Cards (Matching PlatformKpiCards reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Project Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between group hover:border-[color:var(--color-primary)]/40 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('Total Inquiries', 'សំណើគម្រោងសរុប')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[color:var(--color-primary)] flex items-center justify-center transition-transform group-hover:scale-110">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {isLoading ? '...' : (stats?.projectRequests ?? 0)}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Inflow
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <Link href="/admin/project-requests" className="font-bold flex items-center gap-0.5 group">
              <span className="text-gradient-brand group-hover:opacity-80">View Details</span>
              <ChevronRight className="w-3 h-3 text-[#0088FE]" />
            </Link>
            <span className="text-slate-500">Client Briefs</span>
          </div>
        </div>

        {/* Card 2: Contact Messages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between group hover:border-indigo-400/40 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('Contact Messages', 'សារទំនាក់ទំនង')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {isLoading ? '...' : (stats?.contactMessages ?? 0)}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/80">
              Inbound Inbox
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <Link href="/admin/messages" className="text-indigo-600 hover:underline font-bold flex items-center gap-0.5">
              <span>Open Inbox</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-500">Support & Quotes</span>
          </div>
        </div>

        {/* Card 3: Catalog Fleet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between group hover:border-emerald-400/40 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('Catalog Fleet', 'មាតិកាផ្សាយ')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {isLoading ? '...' : ((stats?.services || 0) + (stats?.projects || 0))}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              Published
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span className="text-emerald-700 font-bold">{stats?.services || 0} Services</span>
            <span className="text-gradient-brand font-bold">{stats?.projects || 0} Projects</span>
            <span className="text-slate-500">{stats?.packages || 0} Packages</span>
          </div>
        </div>

        {/* Card 4: Threat Defense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between group hover:border-rose-400/40 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('Threat Defense', 'ការទប់ស្កាត់ការវាយប្រហារ')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {isLoading ? '...' : (securityStats?.totalAttacksDefended ?? 0)}
            </span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/80">
              Shield Guarded
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span className="text-rose-600 font-bold">{securityStats?.totalActiveBlocks ?? 0} Blocked IPs</span>
            <Link href="/admin/security" className="text-rose-600 hover:underline font-bold flex items-center gap-0.5">
              <span>Firewall</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Tab Views with Live Dynamic Data */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (2/3 width): Recent Inquiries Table & Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Project Inquiries Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0050C3] flex items-center justify-center">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      {t('Recent Client Inquiries', 'សំណើគម្រោងថ្មីៗពីអតិថិជន')}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {t('Latest quote submissions needing review', 'សំណើសម្រង់តម្លៃដែលរង់ចាំការពិនិត្យ')}
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/project-requests"
                  className="text-xs font-bold flex items-center gap-1 group"
                >
                  <span className="text-gradient-brand group-hover:opacity-80">{t('View All', 'មើលទាំងអស់')}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#0088FE]" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">{t('Client Name', 'ឈ្មោះអតិថិជន')}</th>
                      <th className="px-5 py-3">{t('Service / Budget', 'សេវាកម្ម / ថវិកា')}</th>
                      <th className="px-5 py-3">{t('Status', 'ស្ថានភាព')}</th>
                      <th className="px-5 py-3 text-right">{t('Action', 'សកម្មភាព')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentRequests.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                          <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p className="font-bold text-xs">{t('No project inquiries received yet', 'មិនទាន់មានសំណើគម្រោងនៅឡើយទេ')}</p>
                        </td>
                      </tr>
                    ) : (
                      recentRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 leading-snug">{req.name}</p>
                            <p className="text-[11px] text-slate-500 font-normal">{req.businessName || req.email}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-slate-700">{req.serviceType || t('General Inquiry', 'ការសាកសួរទូទៅ')}</p>
                            <p className="text-[11px] font-bold text-gradient-brand">{req.budget || '-'}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(req.status)}`}>
                              {req.status ? req.status.replace('_', ' ') : 'pending'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              href="/admin/project-requests"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/60"
                            >
                              <span>{t('Open', 'បើក')}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inbound Contact Messages */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      {t('Latest Inbound Messages', 'សារទំនាក់ទំនងថ្មីៗ')}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {t('Direct contact form inquiries', 'សារសាកសួរពីគេហទំព័រ')}
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/messages"
                  className="text-xs font-bold flex items-center gap-1 group"
                >
                  <span className="text-gradient-brand group-hover:opacity-80">{t('View Inbox', 'មើលទាំងអស់')}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#0088FE]" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentMessages.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="font-bold text-xs">{t('No contact messages received yet', 'មិនទាន់មានសារទំនាក់ទំនងនៅឡើយទេ')}</p>
                  </div>
                ) : (
                  recentMessages.map((msg) => (
                    <Link
                      key={msg.id}
                      href="/admin/messages"
                      className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition-all group"
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">{msg.name}</span>
                          {msg.status === 'unread' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-700">
                              UNREAD
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-medium truncate">{msg.subject || msg.message}</p>
                        <p className="text-[11px] text-slate-500">{msg.email}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column (1/3 width): Telemetry & Section Visibility */}
          <div className="space-y-6">
            
            {/* Attack Shield & Firewall Live Widget */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>FIREWALL ACTIVE</span>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                {t('Attack Shield Defense', 'ការការពារការវាយប្រហារ')}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                {t('Automated DDoS & bot flooding mitigation', 'ទប់ស្កាត់ការវាយប្រហារបណ្តាញ និង Bot ដោយស្វ័យប្រវត្តិ')}
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                    {t('Blocked IPs', 'IP បិទខ្ទប់')}
                  </span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {securityStats?.totalActiveBlocks ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {t('Attacks Stopped', 'ទប់ស្កាត់')}
                  </span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {securityStats?.totalAttacksDefended ?? 0}
                  </span>
                </div>
              </div>

              <Link
                href="/admin/security"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/80 text-[#0050C3] font-bold text-xs flex items-center justify-center gap-2 transition-all group"
              >
                <span>{t('Manage IP Bans', 'គ្រប់គ្រងការបិទ IP')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Dynamic Section Visibility Health Monitor */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('Homepage Sections Status', 'ស្ថានភាពផ្នែកគេហទំព័រ')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {t('Dynamic toggle controlled in settings', 'កំណត់ការបង្ហាញក្នុងទំព័រ Settings')}
                  </p>
                </div>

                <Link
                  href="/admin/settings"
                  className="text-xs font-bold flex items-center gap-1 group"
                >
                  <Settings className="w-3.5 h-3.5 text-[#0088FE]" />
                  <span className="text-gradient-brand group-hover:opacity-80">{t('Edit', 'កែប្រែ')}</span>
                </Link>
              </div>

              <div className="space-y-1.5">
                {sectionList.map((sec) => {
                  const Icon = sec.icon;
                  const isVisible = siteSettings ? siteSettings[sec.key] !== false : true;

                  return (
                    <div
                      key={sec.key}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {t(sec.name, sec.kh)}
                        </span>
                      </div>

                      <div>
                        {isVisible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/80">
                            <EyeOff className="w-3 h-3 text-slate-500" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                {t('Quick Actions', 'ផ្លូវកាត់រហ័ស')}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/admin/services/new"
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors text-center group"
                >
                  <Wrench className="w-4 h-4 mx-auto mb-1 text-slate-600 group-hover:text-[color:var(--color-primary)] transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 block">{t('New Service', 'សេវាកម្ម')}</span>
                </Link>

                <Link
                  href="/admin/projects/new"
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors text-center group"
                >
                  <Layers className="w-4 h-4 mx-auto mb-1 text-slate-600 group-hover:text-[color:var(--color-primary)] transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 block">{t('New Project', 'ស្នាដៃ')}</span>
                </Link>

                <Link
                  href="/admin/team/new"
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors text-center group"
                >
                  <Users className="w-4 h-4 mx-auto mb-1 text-slate-600 group-hover:text-[color:var(--color-primary)] transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 block">{t('Add Team', 'ក្រុមការងារ')}</span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors text-center group"
                >
                  <Settings className="w-4 h-4 mx-auto mb-1 text-slate-600 group-hover:text-[color:var(--color-primary)] transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 block">{t('Site Settings', 'ការកំណត់')}</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Inquiries & CRM */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {t('Client Inquiries & Briefs CRM', 'សំណើគម្រោងពីអតិថិជន')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('Manage all project inquiries and quote submissions directly', 'គ្រប់គ្រងសំណើសម្រង់តម្លៃពីអតិថិជន')}
              </p>
            </div>
            <Link
              href="/admin/project-requests"
              className="px-4 py-2 rounded-xl bg-[color:var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Inbox className="w-4 h-4" />
              <span>{t('Open Full Inquiries Manager', 'បើកទំព័រគ្រប់គ្រងពេញលេញ')}</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{req.name}</p>
                      <p className="text-[11px] text-slate-500 font-normal">{req.email}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{req.serviceType || 'General'}</td>
                    <td className="px-5 py-4 font-bold text-gradient-brand">{req.budget || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(req.status)}`}>
                        {req.status ? req.status.replace('_', ' ') : 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href="/admin/project-requests"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/60"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Security & Defense */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Active IP Bans</span>
              <span className="text-3xl font-black text-rose-600 tabular-nums">{securityStats?.totalActiveBlocks ?? 0}</span>
              <p className="text-[11px] text-slate-500 font-medium mt-2">Currently restricted from accessing APIs</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Attacks Defended</span>
              <span className="text-3xl font-black text-emerald-600 tabular-nums">{securityStats?.totalAttacksDefended ?? 0}</span>
              <p className="text-[11px] text-slate-500 font-medium mt-2">Mitigated by automated rate limits</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Firewall Status</span>
              <span className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Active & Enforcing
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-2">DDoS flood protection enabled</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Manage Attack Shield & IP Bans</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Configure rate limit thresholds, view live request logs, and unban IPs.</p>
            </div>
            <Link
              href="/admin/security"
              className="px-4 py-2.5 rounded-xl bg-[#0050C3] hover:bg-[#0040A0] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Open Security Panel</span>
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Homepage Sections */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Dynamic Homepage Section Visibility</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Toggle whether sections appear on the public landing page in real-time.</p>
            </div>
            <Link
              href="/admin/settings"
              className="px-4 py-2 rounded-xl bg-[#0050C3] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>Modify in Settings</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectionList.map((sec) => {
              const Icon = sec.icon;
              const isVisible = siteSettings ? siteSettings[sec.key] !== false : true;

              return (
                <div
                  key={sec.key}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    {isVisible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>Visible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/80">
                        <EyeOff className="w-3 h-3 text-slate-500" />
                        <span>Hidden</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-0.5">{t(sec.name, sec.kh)}</h4>
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed">{sec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
