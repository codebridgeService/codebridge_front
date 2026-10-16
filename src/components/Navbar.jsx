'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { authService } from '@/store/authService';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { getEncryptedHref, decryptRoute } from '@/lib/routeCipher';

const navItems = [
  { name: 'Home', kh: 'ទំព័រដើម', href: '/' },
  // { name: 'Services', kh: 'សេវាកម្ម', href: '/services' },
  { name: 'Portfolio', kh: 'ស្នាដៃ', href: '/portfolio' },
  { name: 'About', kh: 'អំពីយើង', href: '/about' },
  { name: 'FAQ', kh: 'សំណួរញឹកញាប់', href: '/faq' },
  { name: 'Contact', kh: 'ទំនាក់ទំនង', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const resolvedPathname = pathname?.startsWith('/e/') 
    ? decryptRoute(pathname.slice(3)) 
    : pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check authentication
    const session = authService.getSession();
    if (session && session.user) {
      setUser(session.user);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[color:var(--bg-navbar)]/85 backdrop-blur-md shadow-sm py-3 border-b border-[color:var(--border-main)]/50' 
          : 'bg-[color:var(--bg-navbar)]/75 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img 
            src="/logo/Codebridge.svg" 
            alt="Codebridge Logo" 
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-lg sm:text-xl font-black text-[color:var(--navbar-text)] tracking-tight font-sans">
            Code<span className="bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent">Bridges</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = resolvedPathname === item.href || (resolvedPathname?.startsWith(item.href) && item.href !== '/');
              const targetHref = getEncryptedHref(item.href);
              return (
                <Link 
                  key={item.name} 
                  href={targetHref}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all relative group ${lang === 'kh' ? 'text-base' : ''} ${
                    isActive 
                      ? 'text-[color:var(--navbar-text)] bg-[color:var(--navbar-text)]/10'
                      : 'text-[color:var(--navbar-text)] opacity-70 hover:opacity-100 hover:bg-[color:var(--navbar-text)]/10'
                  }`}
                >
                  {t(item.name, item.kh)}
                  <motion.span 
                    className={`absolute bottom-1 left-4 right-4 h-0.5 bg-[#378ADD] transition-transform origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                    initial={false}
                  />
                </Link>
              );
            })}
          </div>
          
          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="px-4 py-2 text-xs font-black text-white bg-[#0050C3] hover:bg-[#003da0] rounded-full transition-all uppercase tracking-widest shadow-sm"
            >
              Admin
            </Link>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10 shadow-lg backdrop-blur-sm">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                lang === 'en' 
                  ? 'bg-[color:var(--navbar-text)] text-[color:var(--bg-navbar)] shadow-md scale-105' 
                  : 'text-[color:var(--navbar-text)] opacity-40 hover:opacity-80'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('kh')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                lang === 'kh' 
                  ? 'bg-[color:var(--navbar-text)] text-[color:var(--bg-navbar)] shadow-md scale-105' 
                  : 'text-[color:var(--navbar-text)] opacity-40 hover:opacity-80 font-bold'
              } font-[family-name:var(--font-battambang)]`}
            >
              ខ្មែរ
            </button>
          </div>

          {/* Theme Toggle Button (Desktop) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[color:var(--navbar-text)]/10 border border-[color:var(--navbar-text)]/10 text-[color:var(--navbar-text)] hover:bg-[color:var(--navbar-text)]/20 transition-all shadow-lg backdrop-blur-sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
          <Link 
            href="/contact" 
            className="flex items-center justify-center py-2.5 bg-gradient-to-r from-[#0050C3] to-[#378ADD] text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all truncate px-5"
          >
            {t('Talk to us →', 'ទាក់ទងយើងខ្ញុំ →')}
          </Link>
        </div>

        {/* Mobile Menu Button Group */}
        <div className="flex items-center gap-3 md:hidden">
           {/* Mobile Language Toggle */}
           <button
             onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
             className="flex items-center gap-1.5 h-8 px-2.5 bg-[color:var(--navbar-text)]/5 hover:bg-[color:var(--navbar-text)]/10 rounded-full shadow-sm border border-[color:var(--navbar-text)]/10 active:scale-95 transition-all backdrop-blur-md"
             aria-label={lang === 'en' ? 'Switch to Khmer' : 'Switch to English'}
           >
             <img 
               src={lang === 'en' ? '/lang/en.png' : '/lang/km.png'} 
               alt="" 
               className="w-4 h-4 rounded-full object-cover shadow-sm border border-[color:var(--navbar-text)]/10"
             />
             <span className="text-[10px] font-black text-[color:var(--navbar-text)]">
               {lang === 'en' ? 'EN' : 'ខ្មែរ'}
             </span>
           </button>

           {/* Theme Toggle Button (Mobile) - To the left of hamburger */}
           <button
             onClick={toggleTheme}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-[color:var(--navbar-text)]/5 text-[color:var(--navbar-text)] border border-[color:var(--navbar-text)]/10 active:scale-95 transition-all backdrop-blur-md"
             aria-label="Toggle theme"
           >
             {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
           </button>

           <button
             onClick={() => setIsOpen(!isOpen)}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-[color:var(--navbar-text)]/5 text-[color:var(--navbar-text)] hover:bg-[color:var(--navbar-text)]/10 transition-all border border-[color:var(--navbar-text)]/10"
             aria-label="Toggle menu"
           >
             {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[color:var(--bg-navbar)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-5 gap-1">
              {navItems.map((item) => {
                const isActive = resolvedPathname === item.href || (resolvedPathname?.startsWith(item.href) && item.href !== '/');
                const targetHref = getEncryptedHref(item.href);
                return (
                  <Link
                    key={item.name}
                    href={targetHref}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 px-4 rounded-xl transition-colors group ${lang === 'kh' ? 'text-xl font-bold' : 'text-lg font-bold'} ${
                      isActive 
                        ? 'bg-[color:var(--navbar-text)]/10 text-[color:var(--navbar-text)] border border-[color:var(--navbar-text)]/10' 
                        : 'hover:bg-[color:var(--navbar-text)]/5 text-[color:var(--navbar-text)] opacity-70'
                    }`}
                  >
                    <span className="tracking-tight">{t(item.name, item.kh)}</span>
                    <ChevronRightIcon className={`h-5 w-5 transition-colors ${isActive ? 'text-[color:var(--navbar-text)]' : 'text-gray-500 group-hover:text-[color:var(--navbar-text)]'}`} />
                  </Link>
                );
              })}
              
              {user?.role === 'admin' && (
                <div className="px-2 pt-2">
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 bg-[#0050C3] hover:bg-[#003da0] text-white text-center font-bold rounded-2xl flex items-center justify-center uppercase tracking-wider text-xs shadow-md transition-colors"
                  >
                    Admin Console
                  </Link>
                </div>
              )}
              <div className="mt-2 px-2 pb-2">
                <Link
                  href={getEncryptedHref('/contact')}
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-4 bg-gradient-to-r from-[#0050C3] to-[#378ADD] text-white text-center font-black rounded-2xl shadow-xl shadow-blue-900/10 flex items-center justify-center transition-transform active:scale-[0.98] truncate px-4 ${lang === 'kh' ? 'text-base' : 'text-sm uppercase tracking-widest'}`}
                >
                  {t("Talk to us →", "សុំការដកស្រង់តម្លៃ →")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
