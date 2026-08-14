'use client';

import OrderForm from "../../components/OrderForm";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

function OrderContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');

  return (
    <div className="max-w-5xl mx-auto px-6 mb-6 min-h-screen relative z-10">
      {/* Decorative Background Elements */}
      {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[color:var(--color-primary)]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" /> */}
      {/* <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[color:var(--color-secondary)]/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" /> */}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] mb-8 shadow-sm transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-[color:var(--color-primary)] animate-pulse" />
            <span className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-widest leading-none mt-0.5 transition-colors duration-300">Project Initiation</span>
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-[color:var(--text-main)] uppercase tracking-tighter mb-8 leading-[0.9] transition-colors duration-300">
            Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]">Vision</span>
         </h1>
         <p className="text-lg text-[color:var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            Tell us about your project and business. Our team will review your brief and get back to you within 24 hours.
         </p>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 bg-[color:var(--bg-secondary)] backdrop-blur-3xl rounded-[3rem] -z-10 border border-[color:var(--border-main)] shadow-2xl transition-colors duration-500" />
        <div className="p-8 md:p-16">
          <OrderForm packageId={packageId} />
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <>
      <main className="pt-20 bg-[color:var(--bg-main)] relative overflow-hidden transition-colors duration-500">
        {/* Subtle Mesh Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-500 dark:opacity-[0.05]" style={{ backgroundImage: `radial-gradient(var(--text-main) 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
        
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-[color:var(--text-muted)]">Loading Flow...</div>}>
          <OrderContent />
        </Suspense>
      </main>
    </>
  );
}
