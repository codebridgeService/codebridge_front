'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFacebookF, FaTiktok, FaTelegramPlane, FaArrowRight, FaInstagram } from 'react-icons/fa';

import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const [year, setYear] = useState('');
  const { lang } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const footerLinks = {
    company: [
      { name: t('About Us', 'អំពីយើង'), href: '/about' },
      { name: t('Our Team', 'ក្រុមរបស់យើង'), href: '/about#team' },
      { name: t('Contact Us', 'ទំនាក់ទំនង'), href: '/contact' },
    ],
    services: [
      { name: t('Web Development', 'ការអភិវឌ្ឍន៍គេហទំព័រ'), href: '/services#web-development' },
      { name: t('Mobile Apps', 'កម្មវិធីទូរស័ព្ទ'), href: '/services#mobile-apps' },
      { name: t('Custom Systems', 'ប្រព័ន្ធតាមតម្រូវការ'), href: '/services#custom-systems' },
    ],
    legal: [
      { name: t('Privacy Policy', 'គោលការណ៍ឯកជនភាព'), href: '/privacy' },
      { name: t('Terms of Services', 'លក្ខខណ្ឌប្រើប្រាស់'), href: '/terms' },
      { name: t('Cookie Policy', 'គោលការណ៍ឃុកឃី'), href: '/cookies' },
    ]
  };

  return (
    <footer className="bg-[color:var(--bg-main)] relative text-[color:var(--text-main)] pt-16 pb-8 overflow-hidden border-t border-[color:var(--border-main)] transition-colors duration-500">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[color:var(--border-main)] to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[color:var(--color-primary)]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[color:var(--color-secondary)]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className={`p-1 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-white' : 'bg-transparent'}`}>
                <img 
                  src="/logo/Codebridge-Photoroom.png" 
                  alt="Codebridge Logo" 
                  className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[color:var(--color-primary)]'}`}>
                Codebridge
              </span>
            </Link>
            <p className={`text-[color:var(--text-muted)] leading-relaxed max-w-sm ${lang === 'kh' ? 'text-base' : 'text-sm'}`}>
              {t(
                'Empowering businesses through cutting-edge technology and innovative digital experiences. We bridge the gap between ideas and reality.',
                'ពង្រឹងអាជីវកម្មតាមរយៈបច្ចេកវិទ្យាទំនើប និងបទពិសោធន៍ឌីជីថលប្រកបដោយភាពចៃប្រឌិត។ យើងភ្ជាប់គម្លាតរវាងគំនិត និងការពិត។'
              )}
            </p>
            <div className="flex gap-3 mt-1">
              {[
                { Icon: FaFacebookF, url: "https://www.facebook.com/profile.php?id=61563715387398", color: "text-[#1877F2]", hoverBg: "hover:bg-[#1877F2]/10" },
                { Icon: FaTiktok, url: "https://www.tiktok.com/@code.bridge2026", color: theme === 'dark' ? "text-white" : "text-[#000000]", hoverBg: "hover:bg-white/10" },
                { Icon: FaTelegramPlane, url: "https://t.me/codebridgee", color: "text-[#26A5E4]", hoverBg: "hover:bg-[#26A5E4]/10" },
                { Icon: FaInstagram, url: "https://www.instagram.com/codebrigde/", color: "text-[#E4405F]", hoverBg: "hover:bg-[#E4405F]/5" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-[color:var(--bg-navbar)] flex items-center justify-center transition-all duration-300 shadow-sm border border-[color:var(--border-main)] ${social.color} ${social.hoverBg} hover:scale-110 active:scale-95`}
                >
                  <social.Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-1" /> {/* Spacer */}
          
          <div className="lg:col-span-2 space-y-4">
            <h3 className={`font-bold uppercase tracking-widest text-[color:var(--text-muted)] opacity-70 ${lang === 'kh' ? 'text-sm' : 'text-xs'}`}>
              {t('Company', 'ក្រុមហ៊ុន')}
            </h3>
            <ul className={`flex flex-col gap-2 text-[color:var(--text-muted)] ${lang === 'kh' ? 'text-base' : 'text-sm'}`}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[color:var(--color-primary)] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><FaArrowRight className="h-2 w-2 mr-2" /></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className={`font-bold uppercase tracking-widest text-[color:var(--text-muted)] opacity-70 ${lang === 'kh' ? 'text-sm' : 'text-xs'}`}>
              {t('Services', 'សេវាកម្ម')}
            </h3>
            <ul className={`flex flex-col gap-2 text-[color:var(--text-muted)] ${lang === 'kh' ? 'text-base' : 'text-sm'}`}>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[color:var(--color-primary)] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><FaArrowRight className="h-2 w-2 mr-2" /></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className={`font-bold uppercase tracking-widest text-[color:var(--text-muted)] opacity-70 ${lang === 'kh' ? 'text-sm' : 'text-xs'}`}>
              {t('Newsletter', 'ព្រឹត្តិប័ត្រព័ត៌មាន')}
            </h3>
            <p className={`text-[color:var(--text-muted)] ${lang === 'kh' ? 'text-sm' : 'text-xs'}`}>
              {t('Stay ahead with the latest in tech.', 'បន្តឈានមុខគេជាមួយនឹងបច្ចេកវិទ្យាចុងក្រោយបំផុត។')}
            </p>
            <form className="relative group max-w-xs">
              <input
                type="email"
                placeholder={t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}
                className="w-full bg-[color:var(--bg-navbar)] border border-[color:var(--border-main)] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[color:var(--color-primary)] focus:bg-[color:var(--bg-main)] transition-all outline-none text-[color:var(--text-main)]"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[color:var(--color-primary)] text-white rounded-lg hover:bg-[color:var(--color-secondary)] transition-colors"
                aria-label="Subscribe"
              >
                <FaArrowRight className="h-3 w-3" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[color:var(--border-main)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[color:var(--text-muted)] text-xs opacity-60">
            &copy; {year} Codebridge. {t('All rights reserved.', 'រក្សាសិទ្ធិគ្រប់យ៉ាង។')}
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] text-xs transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
