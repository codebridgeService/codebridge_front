'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function OrderModal({ pkg, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });

  if (!pkg) return null;

  const handleNext = () => {
    if (step === 1 && !formData.name) return;
    if (step === 2 && !formData.email) return;
    
    if (step === 2) {
      // Simulate form submission
      console.log('Order submitted:', { package: pkg.name, ...formData });
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[color:var(--bg-navbar)] rounded-[2rem] shadow-2xl border border-[color:var(--border-main)] overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-[color:var(--text-main)]/10 transition-colors z-10"
          >
            <XMarkIcon className="w-5 h-5 text-[color:var(--text-main)]" />
          </button>

          {/* Progress Bar */}
          {step < 3 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[color:var(--border-main)]">
              <motion.div 
                className="h-full bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)]"
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          )}

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="text-2xl font-black text-[color:var(--text-main)] mb-1.5">Great choice!</h2>
                    <p className="text-[color:var(--text-muted)] text-base">
                      You're choosing the <strong className="text-[color:var(--color-primary)]">{pkg.name}</strong>. Let's get started—what's your name?
                    </p>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Your Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[color:var(--bg-main)] border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 outline-none transition-all text-base text-[color:var(--text-main)]"
                    autoFocus
                  />

                  <button 
                    onClick={handleNext}
                    disabled={!formData.name}
                    className="mt-2 w-full py-3.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Next <ArrowRightIcon className="w-4 h-4 stroke-2" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="text-2xl font-black text-[color:var(--text-main)] mb-1.5">Nice to meet you, {formData.name.split(' ')[0]}!</h2>
                    <p className="text-[color:var(--text-muted)] text-base">
                      How can we reach you, and do you have any quick notes about your project?
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <input 
                      type="email" 
                      placeholder="Your Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[color:var(--bg-main)] border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 outline-none transition-all text-base text-[color:var(--text-main)]"
                      autoFocus
                    />
                    <textarea 
                      placeholder="Project details (optional)" 
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[color:var(--bg-main)] border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 outline-none transition-all text-base resize-none h-28 text-[color:var(--text-main)]"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button 
                      onClick={handleBack}
                      className="px-5 py-3.5 rounded-2xl font-bold text-[color:var(--text-muted)] hover:bg-[color:var(--bg-main)] transition-all text-sm"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={!formData.email}
                      className="flex-1 py-3.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Complete Request <CheckCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-5 py-6"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-1">
                    <CheckCircleIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[color:var(--text-main)] mb-2">You're all set!</h2>
                    <p className="text-[color:var(--text-muted)] text-base leading-relaxed">
                      Thanks for reaching out, {formData.name.split(' ')[0]}. We've received your request for the <strong className="text-[color:var(--color-primary)]">{pkg.name}</strong> and will be in touch shortly.
                    </p>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="mt-4 px-8 py-3.5 bg-[color:var(--bg-main)] text-[color:var(--text-main)] font-bold rounded-2xl shadow-sm hover:shadow-md border border-[color:var(--border-main)] transition-all text-sm"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
