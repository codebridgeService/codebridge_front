'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as HeroIcons from '@heroicons/react/24/outline';
import { CpuChipIcon, CommandLineIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getEncryptedHref } from '@/lib/routeCipher';

export default function ServiceCard({ 
  title, 
  description, 
  icon, 
  color = 'var(--color-primary)',
  tags = [],
  metric = '',
  slug = 'web-development'
}) {
  const router = useRouter();
  const IconComponent = HeroIcons[icon] || HeroIcons.CodeBracketSquareIcon;
  const isVarColor = color.startsWith('var');
  const fallbackColor = '#378ADD';
  const effectiveColor = isVarColor ? fallbackColor : color;

  const handleClick = () => {
    if (slug) {
      router.push(getEncryptedHref(`/services/${slug}`));
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative bg-transparent p-5 rounded-2xl flex flex-col justify-between h-full border border-[color:var(--border-main)]/80 shadow-xs hover:shadow-lg hover:border-[color:var(--color-primary)]/50 transition-all duration-500 group overflow-hidden z-0 cursor-pointer"
      whileHover={{ y: -4 }}
    >
      {/* Decorative Glow Blob - top right */}
      <div 
        className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[35px] opacity-0 group-hover:opacity-15 transition-all duration-700 pointer-events-none -z-10 group-hover:scale-110"
        style={{ backgroundColor: effectiveColor }}
      />
      
      {/* Decorative Glow Blob - bottom left */}
      <div 
        className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full blur-[25px] opacity-0 group-hover:opacity-10 transition-all duration-700 pointer-events-none -z-10 group-hover:scale-110"
        style={{ backgroundColor: effectiveColor }}
      />

      {/* Cyber Grid Corner Accent (Top Left) */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70" />
      {/* Cyber Grid Corner Accent (Bottom Right) */}
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70" />

      <div>
        {/* Top Header: Icon + Tech Metric Badge */}
        <div className="flex items-center justify-between mb-3.5">
          {/* Icon Container */}
          <div 
            className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 group-hover:scale-105 shadow-sm border border-transparent group-hover:border-white/10"
            style={{ 
              backgroundColor: isVarColor ? 'rgba(55, 138, 221, 0.1)' : `${color}15`,
            }} 
          >
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: effectiveColor }}
            />
            <div 
              className="relative z-10 w-5 h-5 transition-colors duration-500 text-[color:var(--icon-color)] group-hover:text-white"
              style={{ '--icon-color': color }}
            >
              <IconComponent 
                className="w-full h-full" 
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* High-Tech Metric Chip */}
          {metric && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-transparent border border-[color:var(--border-main)]/60 shadow-xs">
              <CpuChipIcon className="w-3 h-3 text-[color:var(--color-primary)] shrink-0" />
              <span className="text-[9px] font-mono font-bold text-[color:var(--text-muted)] uppercase tracking-wider">
                {metric}
              </span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex-grow flex flex-col mb-4">
          <h3 className="font-black text-lg text-[color:var(--text-main)] uppercase tracking-tight mb-2 transition-colors duration-300 group-hover:text-[color:var(--icon-color)]"
              style={{ '--icon-color': effectiveColor }}>
            {title}
          </h3>
          
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed font-medium transition-colors duration-300 group-hover:text-[color:var(--text-main)]">
            {description}
          </p>
        </div>
      </div>

      {/* Technology Stack Tags */}
      {tags && tags.length > 0 && (
        <div className="pt-3 border-t border-[color:var(--border-main)]/60 flex flex-wrap items-center gap-1.5 z-10">
          <CommandLineIcon className="w-3 h-3 text-[color:var(--color-primary)] opacity-70 shrink-0 mr-0.5" />
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-transparent text-[color:var(--text-secondary)] border border-[color:var(--border-main)]/60 shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Explore Link */}
      <div className="mt-3.5 pt-2.5 border-t border-[color:var(--border-main)]/50 flex items-center justify-between text-[10px] font-mono font-bold text-[color:var(--text-muted)] group-hover:text-[color:var(--color-primary)] transition-colors z-10">
        <span className="uppercase tracking-wider">Explore Architecture & Process</span>
        <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Interactive Bottom line */}
      <div 
        className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{ backgroundColor: effectiveColor }}
      />
    </motion.div>
  );
}