'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiFlutter,
  SiDocker,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiVercel,
  SiCloudflare,
  SiGo,
  SiLaravel,
} from 'react-icons/si';

const TECH_ITEMS = [
  {
    name: 'Next.js 15',
    category: 'Full-Stack',
    categoryKh: 'ប្រព័ន្ធពេញលេញ',
    icon: SiNextdotjs,
    color: '#000000',
    darkColor: '#FFFFFF',
    borderHover: 'hover:border-slate-400',
  },
  {
    name: 'React 19',
    category: 'UI Library',
    categoryKh: 'បណ្ណាល័យ UI',
    icon: SiReact,
    color: '#61DAFB',
    darkColor: '#61DAFB',
    borderHover: 'hover:border-cyan-400',
  },
  {
    name: 'TypeScript',
    category: 'Type Safety',
    categoryKh: 'សុវត្ថិភាពកូដ',
    icon: SiTypescript,
    color: '#3178C6',
    darkColor: '#3178C6',
    borderHover: 'hover:border-blue-500',
  },
  {
    name: 'Node.js',
    category: 'Runtime',
    categoryKh: 'ប្រព័ន្ធដំណើរការ',
    icon: SiNodedotjs,
    color: '#5FA04E',
    darkColor: '#5FA04E',
    borderHover: 'hover:border-green-500',
  },
  {
    name: 'Python',
    category: 'AI & Data',
    categoryKh: 'AI & ទិន្នន័យ',
    icon: SiPython,
    color: '#3776AB',
    darkColor: '#38BDF8',
    borderHover: 'hover:border-sky-400',
  },
  {
    name: 'Flutter',
    category: 'Mobile iOS/Android',
    categoryKh: 'ទូរស័ព្ទ iOS/Android',
    icon: SiFlutter,
    color: '#02569B',
    darkColor: '#38BDF8',
    borderHover: 'hover:border-sky-500',
  },
  {
    name: 'Docker',
    category: 'Containers',
    categoryKh: 'កុងតឺន័រ',
    icon: SiDocker,
    color: '#2496ED',
    darkColor: '#60A5FA',
    borderHover: 'hover:border-blue-400',
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    categoryKh: 'មូលដ្ឋានទិន្នន័យ',
    icon: SiPostgresql,
    color: '#4169E1',
    darkColor: '#818CF8',
    borderHover: 'hover:border-indigo-400',
  },
  {
    name: 'Redis',
    category: 'Cache & Queue',
    categoryKh: 'អង្គចងចាំ & ជួរ',
    icon: SiRedis,
    color: '#DC382D',
    darkColor: '#F87171',
    borderHover: 'hover:border-rose-400',
  },
  {
    name: 'Cloudflare',
    category: 'Edge & Security',
    categoryKh: 'សុវត្ថិភាព Edge',
    icon: SiCloudflare,
    color: '#F38020',
    darkColor: '#FB923C',
    borderHover: 'hover:border-orange-400',
  },
  {
    name: 'Go',
    category: 'Microservices',
    categoryKh: 'សេវាកម្មរហ័ស',
    icon: SiGo,
    color: '#00ADD8',
    darkColor: '#38BDF8',
    borderHover: 'hover:border-cyan-400',
  },
  {
    name: 'Laravel',
    category: 'PHP Framework',
    categoryKh: 'គ្រោង PHP',
    icon: SiLaravel,
    color: '#FF2D20',
    darkColor: '#F87171',
    borderHover: 'hover:border-red-400',
  },
  {
    name: 'Tailwind CSS',
    category: 'Design System',
    categoryKh: 'ប្រព័ន្ធរចនា',
    icon: SiTailwindcss,
    color: '#06B6D4',
    darkColor: '#22D3EE',
    borderHover: 'hover:border-cyan-300',
  },
  {
    name: 'Vercel',
    category: 'Serverless Edge',
    categoryKh: 'ពពក Serverless',
    icon: SiVercel,
    color: '#000000',
    darkColor: '#FFFFFF',
    borderHover: 'hover:border-slate-300',
  },
];

export default function TechMarquee() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? (kh || en) : en);

  // Duplicating the list once to ensure 100% seamless, uninterrupted loop
  const duplicatedItems = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <section className="relative w-full py-6 sm:py-8 overflow-hidden z-10 border-y border-[color:var(--border-main)]/30 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[color:var(--text-muted)]">
            {t('Production-Grade Technology Stack', 'បច្ចេកវិទ្យាស្នូលកម្រិតសហគ្រាស')}
          </p>
        </div>
        <span className="text-[9px] font-mono text-[color:var(--text-muted)]/70 uppercase tracking-widest hidden md:inline-block">
          MODERN // SCALABLE // SECURE
        </span>
      </div>

      {/* Marquee Track Container with gradient fade edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left gradient mask */}
        <div 
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[color:var(--bg-main)] to-transparent opacity-80" 
          aria-hidden="true"
        />
        
        {/* Right gradient mask */}
        <div 
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[color:var(--bg-main)] to-transparent opacity-80" 
          aria-hidden="true"
        />

        {/* Marquee Scroller */}
        <div className="animate-marquee py-1.5 flex gap-3 sm:gap-4 items-center">
          {duplicatedItems.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`${tech.name}-${idx}`}
                className={`group flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-transparent border border-[color:var(--border-main)]/60 shadow-xs transition-all duration-300 ${tech.borderHover} hover:bg-[color:var(--text-main)]/5 hover:border-[color:var(--color-primary)]/60 hover:shadow-md hover:-translate-y-0.5 cursor-default select-none shrink-0`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Icon 
                    className="w-4 h-4 text-[color:var(--text-main)] group-hover:text-[color:var(--color-primary)] transition-colors"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] sm:text-xs font-black text-[color:var(--text-main)] tracking-tight whitespace-nowrap leading-tight">
                    {tech.name}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-medium text-[color:var(--text-muted)] tracking-wider whitespace-nowrap leading-none mt-0.5">
                    {t(tech.category, tech.categoryKh)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
