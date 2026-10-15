'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { authService } from '@/store/authService';
import { apiFetch } from '@/lib/api';
import { AppHeader } from '@/components/admin/AppHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [blockedIpCount, setBlockedIpCount] = useState(0);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
    const session = authService.getSession();
    if (!session || !session.token || !session.user || session.user.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(session.user);
    setIsAuthorized(true);
    fetchCounts();
  }, [router, pathname]);

  const fetchCounts = async () => {
    try {
      const [msgRes, reqRes, secRes] = await Promise.all([
        apiFetch('/admin/messages/count').catch(() => null),
        apiFetch('/admin/project-requests/count').catch(() => null),
        apiFetch('/admin/security-stats').catch(() => null),
      ]);

      if (msgRes && msgRes.ok) {
        const msgData = await msgRes.json();
        setUnreadCount(msgData.count || 0);
      }
      if (reqRes && reqRes.ok) {
        const reqData = await reqRes.json();
        setRequestCount(reqData.count || 0);
      }
      if (secRes && secRes.ok) {
        const secData = await secRes.json();
        setBlockedIpCount(secData.totalActiveBlocks || 0);
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[color:var(--color-primary)] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Verifying Admin Access</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Restricting access strictly to authorized CodeBridges administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col antialiased ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
      {/* Top Header */}
      <AppHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Workspace: Sidebar + Scrollable Viewport */}
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          unreadCount={unreadCount}
          requestCount={requestCount}
          blockedIpCount={blockedIpCount}
        />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-slate-50/60 p-3 sm:p-4 lg:p-5">
          <div className="max-w-7xl mx-auto space-y-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
