'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFacebookF, FaTiktok, FaTelegramPlane, FaArrowRight, FaInstagram } from 'react-icons/fa';
import { ServerStackIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { siteSettingService } from '@/store/siteSettingService';
import { getEncryptedHref } from '@/lib/routeCipher';

export default function Footer() {
  const [year, setYear] = useState('');
  const [settings, setSettings] = useState(null);
  const { lang } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    setYear(new Date().getFullYear());
    siteSettingService.getSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error("Failed to load footer settings:", err));
  }, []);


  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const footerLinks = {
    company: [
      { name: t('About Us', 'អំពីយើង'), href: '/about' },
      { name: t('Our Team', 'ក្រុមរបស់យើង'), href: '/about#team' },
      { name: t('Documentation', 'ឯកសារបច្ចេកទេស'), href: '/docs' },
      { name: t('Contact Us', 'ទំនាក់ទំនង'), href: '/contact' },
    ],
    services: [
      { name: t('Web Development', 'ការអភិវឌ្ឍន៍គេហទំព័រ'), href: '/services/web-development' },
      { name: t('Mobile Apps', 'កម្មវិធីទូរស័ព្ទ'), href: '/services/mobile-apps' },
      { name: t('Custom Systems', 'ប្រព័ន្ធតាមតម្រូវការ'), href: '/services/custom-systems' },
    ],
    legal: [
      { name: t('Privacy Policy', 'គោលការណ៍ឯកជនភាព'), href: '/privacy' },
      { name: t('Terms of Services', 'លក្ខខណ្ឌប្រើប្រាស់'), href: '/terms' },
      { name: t('Cookie Policy', 'គោលការណ៍ឃុកឃី'), href: '/cookies' },
    ]
  };

  return (
    <footer className="bg-transparent relative text-[color:var(--text-main)] pt-8 pb-5 overflow-hidden border-t border-[color:var(--border-main)]/40 transition-colors duration-500">
      {/* Background Accent Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[color:var(--border-main)]/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-4">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <Link href="/" className="flex items-center gap-2.5 group mb-1">
              <img 
                src="/logo/Codebridge.svg" 
                alt="Codebridge Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <span className={`text-xl font-black tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Code<span className="bg-gradient-to-r from-[#0050C3] to-[#0088FE] bg-clip-text text-transparent">Bridges</span>
              </span>
            </Link>
            <p className="text-[color:var(--text-muted)] leading-relaxed max-w-xs text-xs">
              {t(
                'Empowering businesses through cutting-edge technology and innovative digital experiences. We bridge the gap between ideas and reality.',
                'ពង្រឹងអាជីវកម្មតាមរយៈបច្ចេកវិទ្យាទំនើប និងបទពិសោធន៍ឌីជីថលប្រកបដោយភាពចៃប្រឌិត។ យើងភ្ជាប់គម្លាតរវាងគំនិត និងការពិត។'
              )}
            </p>
            <div className="flex gap-2 mt-1">
              {[
                { Icon: FaFacebookF, url: settings?.facebookUrl || "https://www.facebook.com/profile.php?id=61563715387398", color: "text-[#1877F2]", hoverBg: "hover:bg-[#1877F2]/10" },
                { Icon: FaTiktok, url: settings?.tiktokUrl || "https://www.tiktok.com/@code.bridge2026", color: theme === 'dark' ? "text-white" : "text-[#000000]", hoverBg: "hover:bg-white/10" },
                { Icon: FaTelegramPlane, url: settings?.telegramUrl || "https://t.me/codebridgee", color: "text-[#26A5E4]", hoverBg: "hover:bg-[#26A5E4]/10" },
                { Icon: FaInstagram, url: settings?.instagramUrl || "https://www.instagram.com/codebrigde/", color: "text-[#E4405F]", hoverBg: "hover:bg-[#E4405F]/5" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-lg bg-[color:var(--bg-secondary)]/50 hover:bg-[color:var(--text-main)]/10 flex items-center justify-center transition-all duration-300 shadow-sm border border-[color:var(--border-main)]/60 ${social.color} ${social.hoverBg} hover:scale-105 active:scale-95`}
                >
                  <social.Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="hidden lg:block lg:col-span-1" /> {/* Spacer */}
          
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className={`font-bold uppercase tracking-wider text-[color:var(--text-muted)] opacity-70 ${lang === 'kh' ? 'text-xs' : 'text-[11px]'}`}>
              {t('Company', 'ក្រុមហ៊ុន')}
            </h3>
            <ul className={`flex flex-col gap-1.5 text-[color:var(--text-muted)] ${lang === 'kh' ? 'text-sm' : 'text-xs'}`}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={getEncryptedHref(link.href)} className="hover:text-[color:var(--color-primary)] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2.5 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><FaArrowRight className="h-2 w-2 mr-1.5" /></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-2.5">
            <h3 className={`font-bold uppercase tracking-wider text-[color:var(--text-muted)] opacity-70 ${lang === 'kh' ? 'text-xs' : 'text-[11px]'}`}>
              {t('Services', 'សេវាកម្ម')}
            </h3>
            <ul className={`flex flex-col gap-1.5 text-[color:var(--text-muted)] ${lang === 'kh' ? 'text-sm' : 'text-xs'}`}>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={getEncryptedHref(link.href)} className="hover:text-[color:var(--color-primary)] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2.5 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><FaArrowRight className="h-2 w-2 mr-1.5" /></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h3 className={`font-bold uppercase tracking-wider text-[color:var(--text-muted)] opacity-70 ${lang === 'kh' ? 'text-xs' : 'text-[11px]'}`}>
              {t('Newsletter', 'ព្រឹត្តិប័ត្រព័ត៌មាន')}
            </h3>
            <p className={`text-[color:var(--text-muted)] text-xs`}>
              {t('Stay ahead with the latest in tech.', 'បន្តឈានមុខគេជាមួយនឹងបច្ចេកវិទ្យាចុងក្រោយបំផុត។')}
            </p>
            <form className="relative group max-w-xs">
              <input
                type="email"
                placeholder={t('Email Address', 'អាសយដ្ឋានអ៊ីមែល')}
                className="w-full bg-[color:var(--bg-secondary)]/50 border border-[color:var(--border-main)]/70 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[color:var(--color-primary)] transition-all outline-none text-[color:var(--text-main)]"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-[color:var(--color-primary)] text-white rounded-md hover:bg-[color:var(--color-secondary)] transition-colors text-xs flex items-center justify-center"
                aria-label="Subscribe"
              >
                <FaArrowRight className="h-2.5 w-2.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Cloud Infrastructure Telemetry Bar */}
        <div className="mt-8 pt-4 pb-2 border-t border-[color:var(--border-main)]/40 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[color:var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-[color:var(--text-main)]">
              {t("ALL SYSTEMS OPERATIONAL", "ប្រព័ន្ធទាំងអស់ដំណើរការជាធម្មតា")}
            </span>
            <span className="opacity-40">•</span>
            <span>{t("Cluster ap-southeast-1", "កន្សោមពពក ap-southeast-1")}</span>
          </div>

          <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ServerStackIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)] shrink-0" />
              <span>Edge Cloud Network</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>TLS 1.3 Certified</span>
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-2 border-t border-[color:var(--border-main)]/20 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[color:var(--text-muted)] text-[11px] opacity-70">
            &copy; {year} CodeBridges. {t('All rights reserved.', 'រក្សាសិទ្ធិគ្រប់យ៉ាង។')}
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] text-[11px] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
