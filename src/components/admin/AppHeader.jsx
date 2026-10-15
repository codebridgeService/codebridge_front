'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Menu, 
  ExternalLink, 
  LogOut, 
  User, 
  ShieldCheck, 
  ChevronDown,
  Globe
} from 'lucide-react';

export function AppHeader({
  sidebarOpen,
  setSidebarOpen,
  user,
  handleLogout,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'A';

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200/80 bg-white z-30 select-none shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      {/* Left Header Elements */}
      <div className="flex items-center gap-3 sm:gap-4">
        {setSidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-[#0050C3] hover:bg-blue-50/70 transition-colors cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Brand Logo & Identity */}
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <img 
            src="/logo/Codebridge.svg" 
            alt="Codebridge" 
            className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform" 
          />
          <div className="leading-tight">
            <span className="font-extrabold text-base tracking-tight text-slate-900 block truncate">
              Code<span className="bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent">Bridges</span>
            </span>
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
              {t('Platform Super Admin', 'ប្រព័ន្ធគ្រប់គ្រងជាន់ខ្ពស់')}
            </span>
          </div>
        </Link>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Live Website Button */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-[#0050C3] text-xs font-semibold transition-colors border border-slate-200/80"
          title="Open Public Website in new tab"
        >
          <Globe className="w-3.5 h-3.5 text-[#0050C3]" />
          <span className="hidden sm:inline">{t('Live Site', 'គេហទំព័រ')}</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#0050C3]" />
        </Link>

        {/* Bilingual Language Switcher */}
        <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-white shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-[#0050C3]'
            }`}
          >
            <span className={lang === 'en' ? 'bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent' : ''}>
              EN
            </span>
          </button>
          <button
            type="button"
            onClick={() => setLang('kh')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
              lang === 'kh'
                ? 'bg-white shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-[#0050C3]'
            }`}
          >
            <span className={lang === 'kh' ? 'bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent' : ''}>
              KM
            </span>
          </button>
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer group"
          >
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user?.name || 'Admin'} 
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0050C3] to-[#0088FE] text-white font-black flex items-center justify-center text-xs shrink-0 shadow-2xs">
                {userInitials}
              </div>
            )}

            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Administrator'}</p>
              <span className="text-[10px] font-extrabold uppercase tracking-wider block mt-0.5 bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent">
                Super Admin
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0050C3] transition-colors hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1 flex items-center gap-2.5">
                {user?.image ? (
                  <img src={user.image} alt={user?.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#0050C3] text-white font-black flex items-center justify-center text-xs shrink-0">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 font-normal truncate">{user?.email || 'admin@codebridge.io'}</p>
                </div>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowProfileDropdown(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-blue-50/70 hover:text-[#0050C3] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-[#0050C3]" />
                <span>{t('Site & Settings', 'ការកំណត់')}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowProfileDropdown(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer mt-1 border-t border-slate-100 pt-2"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>{t('Sign Out Console', 'ចាកចេញ')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
