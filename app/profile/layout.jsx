'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../store/authService';
import { 
  UserIcon, 
  PencilSquareIcon, 
  KeyIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfileLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    const session = authService.getSession();
    if (!session || !session.token) {
      router.push('/login');
    } else {
      setUser(session.user);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (e) {
      console.error(e);
      // Fallback
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const navItems = [
    { name: 'Profile', kh: 'ព័ត៌មានគណនី', href: '/profile', icon: UserIcon },
    { name: 'My Briefs', kh: 'សំណើគម្រោង', href: '/profile/requests', icon: BriefcaseIcon },
    { name: 'Edit Profile', kh: 'កែប្រែគណនី', href: '/profile/edit', icon: PencilSquareIcon },
    { name: 'Reset Password', kh: 'ប្តូរពាក្យសម្ងាត់', href: '/profile/reset-password', icon: KeyIcon },
    { name: 'Settings', kh: 'ការកំណត់', href: '/profile/settings', icon: Cog6ToothIcon },
  ];

  if (!user) return <div className="h-screen w-full bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row py-8 px-4 sm:px-6 lg:px-8 gap-6 md:gap-8 relative items-start">

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-64 shrink-0 gap-2 sticky top-20">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[color:var(--color-primary)]/20 to-[color:var(--color-secondary)]/20 flex items-center justify-center text-3xl font-black text-[color:var(--color-primary)] mb-4">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="text-lg font-black text-gray-900 text-center tracking-tight truncate w-full">{user.name}</h3>
              <p className="text-xs text-gray-500 font-medium truncate w-full text-center">{user.email}</p>
            </div>

            <nav className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${lang === 'kh' ? 'text-base' : 'text-sm'} ${
                      isActive 
                        ? 'bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[color:var(--color-primary)]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[color:var(--color-primary)]' : 'text-gray-400'}`} />
                    {t(item.name, item.kh)}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-gray-100"></div>

              <button 
                onClick={handleLogout}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-red-500 hover:bg-red-50 ${lang === 'kh' ? 'text-base' : 'text-sm'}`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400" />
                {t('Logout', 'ចាកចេញ')}
              </button>
            </nav>
          </aside>

          {/* Mobile Top Navigation - Refined for better space usage */}
          <div className="md:hidden w-full -mt-4 mb-6">
            <nav className="flex overflow-x-auto gap-3 pb-4 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-6 py-3 rounded-[1.25rem] transition-all font-black whitespace-nowrap snap-center shrink-0 ${lang === 'kh' ? 'text-sm' : 'text-xs tracking-wide'} ${
                      isActive 
                        ? 'bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] border-2 border-[color:var(--color-primary)]/20 shadow-sm' 
                        : 'text-gray-500 bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[color:var(--color-primary)]' : 'text-gray-400'}`} />
                    <span>{t(item.name, item.kh)}</span>
                  </Link>
                );
              })}
              <button 
                onClick={handleLogout}
                className={`flex items-center gap-2 px-6 py-3 rounded-[1.25rem] transition-all font-black whitespace-nowrap snap-center shrink-0 text-red-500 bg-white border border-red-50 hover:bg-red-50 shadow-sm ${lang === 'kh' ? 'text-sm' : 'text-xs tracking-wide'}`}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-400 shrink-0" />
                <span>{t('Logout', 'ចាកចេញ')}</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--color-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
