'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../store/authService';
import { 
  Squares2X2Icon, 
  PlusCircleIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
  BriefcaseIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

import { apiFetch } from '../lib/api';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [blockedIpCount, setBlockedIpCount] = useState(0);
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (!session || !session.token || !session.user || session.user.role !== 'admin') {
      router.push('/login');
    } else {
      setUser(session.user);
      fetchCounts();
    }
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
      console.error("Failed to fetch counts:", error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង', href: '/admin', icon: Squares2X2Icon },
    { name: 'Requests', kh: 'សំណើគម្រោង', href: '/admin/project-requests', icon: BriefcaseIcon },
    { name: 'Messages', kh: 'សារ', href: '/admin/messages', icon: EnvelopeIcon },
    { name: 'Services', kh: 'សេវាកម្ម', href: '/admin/services', icon: Cog6ToothIcon },
    { name: 'Packages', kh: 'កញ្ចប់', href: '/admin/packages', icon: Squares2X2Icon },
    { name: 'Team', kh: 'ក្រុម', href: '/admin/team', icon: UsersIcon },
    { name: 'Projects', kh: 'គម្រោង', href: '/admin/projects', icon: ComputerDesktopIcon },
    { name: 'User Management', kh: 'គ្រប់គ្រងអ្នកប្រើប្រាស់', href: '/admin/users', icon: UsersIcon },
    { name: 'Security & IP Bans', kh: 'សុវត្ថិភាព & ការហាមឃាត់ IP', href: '/admin/security', icon: ShieldCheckIcon },
    { name: 'Settings', kh: 'ការកំណត់', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  if (!user) return <div className="h-screen w-full bg-white flex items-center justify-center font-black text-[color:var(--color-primary)] uppercase tracking-widest text-xs animate-pulse">Verifying Admin Access...</div>;

  return (
    <div className={`min-h-screen bg-white flex ${lang === 'kh' ? 'font-battambang' : 'font-poppins'}`}>
      {/* Desktop Sidebar Container */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 p-4">
        <aside className="h-full flex flex-col bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
          {/* Animated decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--color-primary)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-[color:var(--color-primary)]/20 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[color:var(--color-secondary)]/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />
          
          <div className="p-8 relative flex-1 flex flex-col min-h-0">
             <Link href="/" className="flex items-center gap-4 mb-10 group/logo">
               <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-50 group-hover/logo:scale-110 transition-transform">
                 <img src="/logo/Codebridgee.png" className="w-6 h-6 object-contain" />
               </div>
               <div>
                 <span className="text-xl font-black text-[color:var(--color-text-dark)] tracking-tighter block leading-none">Codebridge</span>
                 <span className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">{t('Admin Suite', 'ប្រព័ន្ធគ្រប់គ្រង')}</span>
               </div>
             </Link>

             <nav className="space-y-1 overflow-y-auto no-scrollbar">
               {menuItems.map((item) => {
                 const Icon = item.icon;
                 const isActive = pathname === item.href;
                 return (
                   <Link 
                     key={item.href}
                     href={item.href}
                     className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm relative overflow-hidden group/item ${
                       isActive 
                         ? 'text-white' 
                         : 'text-gray-500 hover:text-[color:var(--color-primary)]'
                     }`}
                   >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] shadow-lg shadow-[color:var(--color-primary)]/20"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className="flex items-center gap-3 flex-1 relative z-10">
                        <Icon className={`w-5 h-5 transition-transform group-item:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[color:var(--color-primary)]'}`} />
                        <span className={lang === 'kh' ? 'text-[13px] leading-tight' : 'text-sm'}>
                          {t(item.name, item.kh)}
                        </span>
                      </div>

                      {item.name === 'Messages' && unreadCount > 0 && (
                        <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white text-[color:var(--color-primary)] shadow-sm' : 'bg-red-500 text-white'
                        }`}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}

                      {item.name === 'Requests' && requestCount > 0 && (
                        <div className="relative group/badge">
                          <span className="absolute inset-0 bg-[color:var(--color-primary)] rounded-full animate-ping opacity-20" />
                          <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isActive ? 'bg-white text-[color:var(--color-primary)] shadow-sm' : 'bg-[color:var(--color-primary)] text-white'
                          }`}>
                            {requestCount > 99 ? '99+' : requestCount}
                          </span>
                        </div>
                      )}

                      {item.name === 'Security & IP Bans' && blockedIpCount > 0 && (
                        <div className="relative group/badge">
                          <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30" />
                          <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isActive ? 'bg-white text-red-600 shadow-sm' : 'bg-red-500 text-white shadow-sm'
                          }`}>
                            {blockedIpCount > 99 ? '99+' : blockedIpCount}
                          </span>
                        </div>
                      )}
                   </Link>
                 );
               })}
             </nav>
          </div>

          <div className="p-8 relative mt-auto">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 bg-red-50/50 hover:bg-red-50 border border-red-100/50 font-black transition-all text-[11px] group/logout"
             >
               <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover/logout:translate-x-1 transition-transform" />
               {t('LOGOUT SYSTEM', 'ចាកចេញពីប្រព័ន្ធ')}
             </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col relative z-0">
        {/* Floating Top Navbar */}
        <header className="sticky top-0 z-30 p-4 lg:p-6 pb-0">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl flex items-center justify-between px-6 py-3.5 transition-all">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <Bars3Icon className="w-5 h-5 text-[color:var(--color-primary)]" />
              </button>
              <div>
                <h2 className="text-[11px] font-black text-[color:var(--color-primary)] tracking-[0.1em] uppercase opacity-80">
                  {(() => {
                    const activeItem = menuItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)));
                    return activeItem ? t(activeItem.name, activeItem.kh) : t('Dashboard Overview', 'ព័ត៌មានទូទៅ');
                  })()}
                </h2>
                <div className="flex items-center gap-2 text-[9px] text-[color:var(--color-primary)] font-black uppercase tracking-widest">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                   {t('System Live', 'ប្រព័ន្ធសកម្ម')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               {/* Language Switcher */}
               <div className="hidden sm:flex p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                  <button 
                    onClick={() => setLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                      lang === 'en' ? 'bg-white text-[color:var(--color-primary)] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLang('kh')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                      lang === 'kh' ? 'bg-white text-[color:var(--color-primary)] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    KM
                  </button>
               </div>

               <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-[color:var(--color-primary)] leading-none mb-1.5">{user.name}</p>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-[color:var(--color-primary)]/10 to-[color:var(--color-secondary)]/10 text-[color:var(--color-primary)] text-[7px] font-black uppercase tracking-[0.15em] border border-[color:var(--color-primary)]/10">
                    {t('SUPER ADMIN', 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់')}
                  </div>
               </div>
               <Link href="/admin/settings" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] p-[1px] shadow-lg hover:rotate-3 transition-transform cursor-pointer block">
                  <div className="w-full h-full rounded-[15px] bg-white flex items-center justify-center text-[color:var(--color-primary)] text-base font-black overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || 'A'
                    )}
                  </div>
               </Link>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="p-4 lg:p-6 lg:pt-8 transition-all">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer (Glass Styled) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsSidebarOpen(false)}
               className="lg:hidden fixed inset-0 bg-[color:var(--color-primary)]/40 backdrop-blur-md z-40"
            />
            <motion.aside 
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               className="lg:hidden fixed inset-y-0 left-0 w-80 bg-white/90 backdrop-blur-2xl z-50 flex flex-col border-r border-white/20 shadow-3xl"
            >
               <div className="p-8 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[color:var(--color-primary)] flex items-center justify-center text-white font-black text-xl">C</div>
                        <span className="text-xl font-black text-[color:var(--color-text-dark)]">Admin Suite</span>
                     </div>
                     <button onClick={() => setIsSidebarOpen(false)} className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                       <XMarkIcon className="w-5 h-5 text-[color:var(--color-primary)]" />
                     </button>
                  </div>
                  <nav className="space-y-1 overflow-y-auto no-scrollbar pr-2 -mr-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link 
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                           className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm relative overflow-hidden ${
                            isActive 
                              ? 'bg-[color:var(--color-primary)] text-white shadow-xl shadow-[color:var(--color-primary)]/20' 
                              : 'text-gray-500 hover:bg-[color:var(--color-primary)]/5 hover:text-[color:var(--color-primary)]'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1 relative z-10">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            <span className={lang === 'kh' ? 'text-[13px]' : ''}>{t(item.name, item.kh)}</span>
                          </div>
                          {item.name === 'Messages' && unreadCount > 0 && (
                            <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive ? 'bg-white text-[color:var(--color-primary)]' : 'bg-red-500 text-white'
                            }`}>
                              {unreadCount}
                            </span>
                          )}
                          {item.name === 'Requests' && requestCount > 0 && (
                            <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive ? 'bg-white text-[color:var(--color-primary)] shadow-sm' : 'bg-[color:var(--color-primary)] text-white'
                            }`}>
                              {requestCount}
                            </span>
                          )}
                          {item.name === 'Security & IP Bans' && blockedIpCount > 0 && (
                            <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive ? 'bg-white text-red-600 shadow-sm' : 'bg-red-500 text-white'
                            }`}>
                              {blockedIpCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
               </div>
               <div className="p-8 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-colors text-xs uppercase tracking-widest"
                  >
                    <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    {t('Logout System', 'ចាកចេញ')}
                  </button>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
