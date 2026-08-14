'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { authService } from '../store/authService';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
};

export default function PackageCard({ pkg, onOrder }) {
  const router = useRouter();

  const handleChoosePackage = () => {
    if (onOrder) {
      onOrder(pkg);
    } else {
      router.push(`/order?packageId=${pkg.id}`);
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className={`relative p-8 rounded-[2rem] border transition-all duration-500 group flex flex-col h-full ${
        pkg.recommend 
          ? 'bg-[color:var(--bg-secondary)] border-[color:var(--color-primary)] shadow-2xl z-10' 
          : 'bg-[color:var(--bg-secondary)] border-[color:var(--border-main)] shadow-sm hover:shadow-xl hover:border-[color:var(--color-primary)]/30'
      }`}
    >
      {pkg.recommend && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-black text-[color:var(--text-main)] uppercase tracking-tighter mb-2 transition-colors duration-300">{pkg.name}</h3>
        <p className="text-sm text-[color:var(--text-muted)] leading-relaxed transition-colors duration-300">{pkg.description}</p>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`mt-1 p-0.5 rounded-full transition-colors duration-300 ${pkg.recommend ? 'bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]' : 'bg-[color:var(--bg-main)] text-[color:var(--text-muted)]'}`}>
              <CheckIcon className="h-4 w-4 stroke-[3]" />
            </div>
            <span className="text-sm font-medium text-[color:var(--text-muted)] leading-tight transition-colors duration-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleChoosePackage}
        className={`w-full py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5 ${
          pkg.recommend 
            ? 'bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white shadow-lg shadow-[color:var(--color-primary)]/20 hover:shadow-xl hover:shadow-[color:var(--color-primary)]/30' 
            : 'bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white shadow-md hover:shadow-lg opacity-90 hover:opacity-100'
        }`}
      >
        Choose {pkg.name}
      </button>
    </motion.div>
  );
}
