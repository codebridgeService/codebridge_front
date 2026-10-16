'use client';

import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  CpuChipIcon, 
  ServerStackIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
};

export default function PackageCard({ pkg }) {
  const isRecommended = Boolean(pkg.recommend);

  return (
    <motion.div 
      variants={itemVariants}
      className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-500 group flex flex-col h-full bg-transparent ${
        isRecommended 
          ? 'border-[color:var(--color-primary)] ring-1 ring-[color:var(--color-primary)]/40 shadow-lg shadow-[color:var(--color-primary)]/10' 
          : 'border-[color:var(--border-main)]/80 shadow-xs hover:shadow-md hover:border-[color:var(--color-primary)]/40'
      }`}
      whileHover={{ y: -4 }}
    >
      {/* Cyber Corner Accents */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70 pointer-events-none" />

      {/* Header with Recommended Pill */}
      <div className="mb-4">
        {isRecommended && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/30 text-[color:var(--color-primary)] text-[9px] font-mono font-bold uppercase tracking-wider mb-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--color-primary)]"></span>
            </span>
            <CpuChipIcon className="w-3 h-3" />
            <span>Popular Architecture</span>
          </div>
        )}

        <h3 className="text-lg font-black text-[color:var(--text-main)] uppercase tracking-tight mb-1 transition-colors duration-300">
          {pkg.name}
        </h3>
        <p className="text-xs text-[color:var(--text-muted)] leading-relaxed transition-colors duration-300">
          {pkg.description}
        </p>
      </div>

      {/* Features List */}
      <ul className="space-y-2.5 mb-4 flex-grow">
        {pkg.features?.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className={`mt-0.5 p-0.5 rounded-full shrink-0 transition-colors duration-300 ${isRecommended ? 'bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)]' : 'bg-[color:var(--text-main)]/5 text-[color:var(--text-muted)] group-hover:text-[color:var(--color-primary)]'}`}>
              <CheckIcon className="h-3 w-3 stroke-[3]" />
            </div>
            <span className="text-xs font-medium text-[color:var(--text-muted)] leading-relaxed transition-colors duration-300 group-hover:text-[color:var(--text-main)]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Engineering Architecture Guarantees */}
      <div className="mt-auto pt-3 border-t border-[color:var(--border-main)]/50 flex items-center justify-between text-[8px] sm:text-[9px] font-mono font-bold text-[color:var(--text-muted)]">
        <div className="flex items-center gap-1">
          <ServerStackIcon className="w-3 h-3 text-[color:var(--color-primary)]" />
          <span>EDGE CLOUD</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 font-semibold">
          <ShieldCheckIcon className="w-3 h-3" />
          <span>99.9% SLA</span>
        </div>
        <div className="flex items-center gap-1">
          <CpuChipIcon className="w-3 h-3 text-[color:var(--color-secondary)]" />
          <span>CI/CD</span>
        </div>
      </div>
    </motion.div>
  );
}
