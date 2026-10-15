'use client';

import { motion } from 'framer-motion';
import * as HeroIcons from '@heroicons/react/24/outline'; // Import all outline icons

export default function ServiceCard({ title, description, icon, color = 'var(--color-primary)' }) {
  const IconComponent = HeroIcons[icon] || HeroIcons.CodeBracketSquareIcon;
  const isVarColor = color.startsWith('var');
  const fallbackColor = '#378ADD';
  const effectiveColor = isVarColor ? fallbackColor : color;

  return (
    <motion.div
      className="relative bg-[color:var(--bg-secondary)] p-6 rounded-3xl flex flex-col items-start h-full border border-[color:var(--border-main)] shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden z-0"
      whileHover={{ y: -6 }}
    >
      {/* Decorative Glow Blob - top right */}
      <div 
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-all duration-700 pointer-events-none -z-10 group-hover:scale-125"
        style={{ backgroundColor: effectiveColor }}
      />
      
      {/* Decorative Glow Blob - bottom left */}
      <div 
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[30px] opacity-0 group-hover:opacity-10 transition-all duration-700 pointer-events-none -z-10 group-hover:scale-125"
        style={{ backgroundColor: effectiveColor }}
      />

      {/* Subtle glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 mix-blend-overlay" />

      {/* Icon Container */}
      <div 
        className="relative flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm group-hover:shadow-md border border-transparent group-hover:border-white/10"
        style={{ 
          backgroundColor: isVarColor ? 'rgba(55, 138, 221, 0.1)' : `${color}15`,
        }} 
      >
        {/* Solid background on hover */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: effectiveColor }}
        />
        
        {/* The Icon itself */}
        <div 
          className="relative z-10 w-6 h-6 transition-colors duration-500 text-[color:var(--icon-color)] group-hover:text-white"
          style={{ '--icon-color': color }}
        >
            <IconComponent 
              className="w-full h-full" 
              strokeWidth={1.5}
            />
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex-grow flex flex-col">
        <h3 className="font-black text-2xl text-[color:var(--text-main)] uppercase tracking-tighter mb-3 transition-colors duration-300 group-hover:text-[color:var(--icon-color)]"
            style={{ '--icon-color': effectiveColor }}>
          {title}
        </h3>
        
        <p className="text-base text-[color:var(--text-muted)] leading-relaxed font-medium transition-colors duration-300 group-hover:text-[color:var(--text-main)]">
          {description}
        </p>
      </div>

      {/* Interactive Bottom line */}
      <div 
        className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{ backgroundColor: effectiveColor }}
      />
    </motion.div>
  );
}