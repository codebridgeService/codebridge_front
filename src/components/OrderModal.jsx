'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function OrderModal({ pkg, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!pkg) return null;

  const handleNext = async () => {
    if (step === 1 && !formData.name) return;
    if (step === 2 && !formData.email) return;
    
    if (step === 2) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch('/api/project-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            packageId: pkg.id,
            websiteGoals: formData.details || `Order for package: ${pkg.name}`,
          }),
        });

        if (res.ok) {
          setStep(3);
        } else {
          const data = await res.json().catch(() => ({}));
          setSubmitError(data.message || 'Failed to submit order request. Please try again.');
        }
      } catch (err) {
        console.error('Failed to submit order:', err);
        setSubmitError('Connection error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setSubmitError(null);
      setStep(step - 1);
    }
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
          className="relative w-full max-w-md bg-[color:var(--bg-navbar)] rounded-2xl shadow-2xl border border-[color:var(--border-main)] overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[color:var(--text-main)]/10 transition-colors z-10"
          >
            <XMarkIcon className="w-4 h-4 text-[color:var(--text-main)]" />
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

          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="text-lg font-black text-[color:var(--text-main)] mb-1">Great choice!</h2>
                    <p className="text-[color:var(--text-muted)] text-xs sm:text-sm">
                      You're choosing the <strong className="text-[color:var(--color-primary)]">{pkg.name}</strong>. Let's get started—what's your name?
                    </p>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Your Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-[color:var(--bg-main)] border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 outline-none transition-all text-xs sm:text-sm text-[color:var(--text-main)]"
                    autoFocus
                  />

                  <button 
                    onClick={handleNext}
                    disabled={!formData.name}
                    className="mt-1 w-full py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    Next <ArrowRightIcon className="w-3.5 h-3.5 stroke-2" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="text-lg font-black text-[color:var(--text-main)] mb-1">Nice to meet you, {formData.name.split(' ')[0]}!</h2>
                    <p className="text-[color:var(--text-muted)] text-xs sm:text-sm">
                      How can we reach you, and do you have any quick notes about your project?
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    <input 
                      type="email" 
                      placeholder="Your Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-[color:var(--bg-main)] border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 outline-none transition-all text-xs sm:text-sm text-[color:var(--text-main)]"
                      autoFocus
                    />
                    <textarea 
                      placeholder="Project details (optional)" 
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-[color:var(--bg-main)] border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 outline-none transition-all text-xs sm:text-sm resize-none h-20 text-[color:var(--text-main)]"
                    />
                  </div>

                  {submitError && (
                    <div className="p-2.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl text-center">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-2.5 mt-1">
                    <button 
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl font-bold text-[color:var(--text-muted)] hover:bg-[color:var(--bg-main)] transition-all text-xs disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={!formData.email || isSubmitting}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Request'} <CheckCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-4 py-4"
                >
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-1">
                    <CheckCircleIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[color:var(--text-main)] mb-1">You're all set!</h2>
                    <p className="text-[color:var(--text-muted)] text-xs sm:text-sm leading-relaxed">
                      Thanks for reaching out, {formData.name.split(' ')[0]}. We've received your request for the <strong className="text-[color:var(--color-primary)]">{pkg.name}</strong> and will be in touch shortly.
                    </p>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="mt-2 px-6 py-2 bg-[color:var(--bg-main)] text-[color:var(--text-main)] font-bold rounded-xl shadow-sm hover:shadow-md border border-[color:var(--border-main)] transition-all text-xs"
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
