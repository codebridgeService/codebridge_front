'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  Mail,
  Wrench,
  Package,
  Layers,
  Users,
  HelpCircle,
  ListOrdered,
  Sparkles,
  ShieldAlert,
  UserCog,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

export function AdminSidebar({ 
  sidebarOpen, 
  unreadCount = 0, 
  requestCount = 0, 
  blockedIpCount = 0 
}) {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [expandedGroups, setExpandedGroups] = useState({
    'overview': true,
    'inquiries': true,
    'content': true,
    'system': true,
  });

  const navGroups = useMemo(() => [
    {
      id: 'overview',
      title: 'Platform Overview',
      titleKh: 'ទិដ្ឋភាពទូទៅ',
      collapsible: false,
      items: [
        { name: 'Executive Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង', href: '/admin', icon: LayoutDashboard, badge: 'Live' },
      ],
    },
    {
      id: 'inquiries',
      title: 'Client Inquiries & CRM',
      titleKh: 'សំណើ និងសារអតិថិជន',
      collapsible: true,
      items: [
        { 
          name: 'Project Requests', 
          kh: 'សំណើគម្រោង', 
          href: '/admin/project-requests', 
          icon: Inbox, 
          count: requestCount,
          countType: 'primary'
        },
        { 
          name: 'Messages Inbox', 
          kh: 'សារសាកសួរ', 
          href: '/admin/messages', 
          icon: Mail, 
          count: unreadCount,
          countType: 'alert'
        },
      ],
    },
    {
      id: 'content',
      title: 'Content Management (CMS)',
      titleKh: 'គ្រប់គ្រងមាតិកាគេហទំព័រ',
      collapsible: true,
      items: [
        { name: 'Services Catalog', kh: 'សេវាកម្ម', href: '/admin/services', icon: Wrench },
        { name: 'Pricing Packages', kh: 'កញ្ចប់តម្លៃ', href: '/admin/packages', icon: Package },
        { name: 'Portfolio Showcase', kh: 'ស្នាដៃគម្រោង', href: '/admin/projects', icon: Layers },
        { name: 'Team Roster', kh: 'សមាជិកក្រុម', href: '/admin/team', icon: Users },
        { name: 'Knowledge FAQs', kh: 'សំណួរញឹកញាប់', href: '/admin/faq', icon: HelpCircle },
        { name: 'How We Work Process', kh: 'ដំណាក់កាលការងារ', href: '/admin/workflow', icon: ListOrdered },
        { name: 'Trust & Guarantees', kh: 'ទំនុកចិត្តសុវត្ថិភាព', href: '/admin/security-features', icon: Sparkles },
      ],
    },
    {
      id: 'system',
      title: 'Security & System Ops',
      titleKh: 'ប្រព័ន្ធ និងសុវត្ថិភាព',
      collapsible: true,
      items: [
        { 
          name: 'Attack Shield & Bans', 
          kh: 'ការការពារ & IP បិទខ្ទប់', 
          href: '/admin/security', 
          icon: ShieldAlert, 
          count: blockedIpCount,
          countType: 'danger'
        },
        { name: 'User Management', kh: 'អ្នកប្រើប្រាស់', href: '/admin/users', icon: UserCog },
        { name: 'Site & Section Settings', kh: 'ការកំណត់ទូទៅ', href: '/admin/settings', icon: Settings },
      ],
    },
  ], [requestCount, unreadCount, blockedIpCount]);

  const [optimisticPath, setOptimisticPath] = useState(null);
  const [hoveredHref, setHoveredHref] = useState(null);

  // Sync optimistic path when real pathname finishes updating
  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  const activePath = optimisticPath || pathname;

  // Keep active group expanded
  useEffect(() => {
    const currentPath = optimisticPath || pathname;
    const currentGroup = navGroups.find((g) =>
      g.items.some((item) => currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(`${item.href}/`)))
    );
    if (currentGroup) {
      setExpandedGroups((prev) => ({ ...prev, [currentGroup.id]: true }));
    }
  }, [pathname, optimisticPath, navGroups]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isItemActive = (href) => {
    if (href === '/admin') return activePath === '/admin';
    return activePath === href || activePath.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`h-full bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col shrink-0 select-none z-20 ${
        sidebarOpen ? 'w-64' : 'w-[72px]'
      }`}
    >
      {/* Scrollable Navigation List */}
      <nav 
        onMouseLeave={() => setHoveredHref(null)}
        className="flex-1 px-2.5 py-3.5 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300"
      >
        {navGroups.map((group) => {
          const isCollapsible = group.collapsible !== false;
          const isExpanded = !isCollapsible ? true : (expandedGroups[group.id] ?? true);

          return (
            <div key={group.id} className="space-y-1">
              {sidebarOpen ? (
                isCollapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#0050C3] transition-colors group cursor-pointer"
                  >
                    <span className="truncate">{t(group.title, group.titleKh)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-semibold text-[#0050C3] bg-blue-50/80 px-1 rounded">
                        {group.items.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#0050C3]" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#0050C3]" />
                      )}
                    </div>
                  </button>
                ) : (
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {t(group.title, group.titleKh)}
                  </div>
                )
              ) : (
                <div className="h-px bg-slate-100 my-2 mx-1" />
              )}

              {(isExpanded || !sidebarOpen) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={!sidebarOpen ? t(item.name, item.kh) : undefined}
                        onClick={() => {
                          setOptimisticPath(item.href);
                          setHoveredHref(null);
                        }}
                        onMouseEnter={() => setHoveredHref(item.href)}
                        onMouseLeave={() => setHoveredHref((prev) => (prev === item.href ? null : prev))}
                        className={`group relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors duration-150 cursor-pointer ${
                          active
                            ? 'text-[#0050C3] font-bold'
                            : 'text-slate-600 hover:text-[#0050C3] font-medium'
                        } ${!sidebarOpen ? 'justify-center px-0 w-11 h-10 mx-auto' : ''}`}
                      >
                        {/* Real-time active background */}
                        {active && (
                          <motion.div
                            layoutId="sidebarActiveBg"
                            className="absolute inset-0 bg-blue-50/90 border border-blue-100/80 rounded-xl shadow-2xs pointer-events-none -z-10"
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        )}

                        {/* Real-time active left indicator bar */}
                        {active && sidebarOpen && (
                          <motion.span
                            layoutId="sidebarActiveBar"
                            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gradient-to-b from-[#0050C3] to-[#0088FE] rounded-r-full pointer-events-none"
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        )}

                        {/* Real-time smooth hover glow for inactive items */}
                        {!active && hoveredHref === item.href && (
                          <motion.div
                            layoutId="sidebarHoverBg"
                            className="absolute inset-0 bg-blue-50/60 border border-blue-100/40 rounded-xl pointer-events-none -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}

                        <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                          active ? 'text-[#0050C3]' : 'text-slate-400 group-hover:text-[#0050C3]'
                        }`} />
                        {sidebarOpen && (
                          <span className={`truncate tracking-tight flex-1 ${lang === 'kh' ? 'text-[12px]' : ''}`}>
                            {t(item.name, item.kh)}
                          </span>
                        )}

                        {/* Badges / Counters */}
                        {sidebarOpen && item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-auto shrink-0 transition-colors ${
                            active ? 'bg-blue-100/80 text-[#0050C3]' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
                          }`}>
                            {item.badge}
                          </span>
                        )}

                        {sidebarOpen && item.count > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-auto shrink-0 transition-colors ${
                            active
                              ? 'bg-white text-[#0050C3] shadow-2xs border border-blue-200/60'
                              : item.countType === 'danger'
                              ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                              : item.countType === 'alert'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                              : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                          }`}>
                            {item.count > 99 ? '99+' : item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer System Telemetry Status */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/70">
        {sidebarOpen ? (
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="font-semibold text-slate-500 truncate">System Online</span>
            </div>
            <span className="font-mono font-bold text-[9px] bg-blue-50 text-[#0050C3] border border-blue-200/60 px-1.5 py-0.5 rounded uppercase tracking-wider">
              Prod
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="Core Engine: Online">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
