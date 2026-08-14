'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  BriefcaseIcon, 
  LightBulbIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { authService } from '../store/authService';

export default function OrderForm({ packageId }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    websiteGoals: '',
    pagesNeeded: '',
    designPreference: '',
    competitors: '',
    packageId: packageId || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const session = authService.getSession();
    if (session && session.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        phoneNumber: session.user.phoneNumber || ''
      }));
    }
  }, []);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const steps = [
    { id: 1, title: 'Contact', icon: UserIcon },
    { id: 2, title: 'Business', icon: BriefcaseIcon },
    { id: 3, title: 'Brief', icon: LightBulbIcon }
  ];

  const validateStep = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.phoneNumber.trim() !== '';
    }
    if (step === 2) {
      return formData.businessName.trim() !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 3));
      setErrorMsg(null);
    } else {
      setErrorMsg('Please fill in all required fields to continue.');
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-[color:var(--bg-secondary)] rounded-[2rem] shadow-2xl border border-[color:var(--border-main)] max-w-2xl mx-auto transition-colors duration-500"
      >
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[color:var(--text-main)] mb-2 uppercase tracking-tight transition-colors duration-300">Project Initiated!</h2>
        <p className="text-[color:var(--text-muted)] mb-6 font-medium text-sm transition-colors duration-300">
          Thank you for choosing us. We have received your brief and our team will review it shortly. 
          Check your email for next steps.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[color:var(--text-main)] text-[color:var(--bg-main)] rounded-full font-black uppercase tracking-widest text-xs hover:bg-[color:var(--color-primary)] hover:text-white transition-all shadow-xl shadow-[color:var(--color-primary)]/10"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Stepper with Kinetic Feedback */}
      <div className="flex items-center justify-between mb-10 px-4 relative">
        {/* Connecting line background */}
        <div className="absolute top-7 left-10 right-10 h-[2px] bg-[color:var(--border-main)] -z-10 rounded-full transition-colors duration-500" />
        
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center group relative z-10">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 relative backdrop-blur-md ${
                step > s.id 
                  ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary)]/40' 
                  : step === s.id
                    ? 'bg-[color:var(--text-main)] border-[color:var(--text-main)] text-[color:var(--bg-main)] shadow-2xl rotate-3'
                    : 'bg-[color:var(--bg-secondary)] border-[color:var(--border-main)] text-[color:var(--text-muted)] -rotate-3 hover:border-[color:var(--color-primary)]/50'
              }`}
            >
               {step === s.id && (
                 <motion.div 
                   layoutId="activeGlow"
                   className="absolute -inset-2 bg-[color:var(--color-primary)]/20 blur-xl rounded-full -z-10"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                 />
               )}
               {step > s.id ? <CheckCircleIcon className="w-7 h-7" /> : <s.icon className="w-6 h-6" />}
            </motion.div>
            <span className={`mt-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${step >= s.id ? 'text-[color:var(--text-main)]' : 'text-[color:var(--text-muted)]'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Custom Premium Alert */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-8 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 shadow-xl shadow-red-500/5 transition-colors duration-500"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 transition-colors duration-500">
              <XMarkIcon className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-wider leading-relaxed text-red-500">{errorMsg}</p>
            <button 
              onClick={() => setErrorMsg(null)}
              className="ml-auto p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Full Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Email Address</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] transition-colors duration-300">Phone Number</label>
                    <span className="text-[10px] font-bold text-[color:var(--color-primary)] uppercase tracking-wider bg-[color:var(--color-primary)]/10 px-2 py-0.5 rounded-md">Telegram Preferred</span>
                  </div>
                  <input 
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                    placeholder="+855 XX XXX XXX"
                  />
                  <p className="text-[9px] text-[color:var(--text-muted)] font-bold ml-1 italic opacity-80 transition-colors duration-300">* Better for quick project updates and coordination via Telegram.</p>
                </div>
              </div>
              <div className="pt-8 flex justify-end">
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-4 bg-[color:var(--text-main)] text-[color:var(--bg-main)] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[color:var(--color-primary)] hover:text-white transition-all shadow-xl shadow-[color:var(--color-primary)]/10 active:scale-95"
                >
                  Next Step <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Business Name</label>
                  <input 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Industry / Type</label>
                  <input 
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                    placeholder="E-commerce, SaaS, etc."
                  />
                </div>
              </div>
              <div className="pt-8 flex justify-between">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-4 text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-colors duration-300"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Go Back
                </button>
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-4 bg-[color:var(--text-main)] text-[color:var(--bg-main)] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[color:var(--color-primary)] hover:text-white transition-all shadow-xl shadow-[color:var(--color-primary)]/10 active:scale-95"
                >
                  Next Step <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Primary Goals</label>
                  <textarea 
                    name="websiteGoals"
                    value={formData.websiteGoals}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] transition-all outline-none font-bold text-[color:var(--text-main)] resize-none shadow-sm focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] placeholder-[color:var(--text-muted)]/50" 
                    placeholder="What do you want to achieve? (Sales, Leads, Brand Awareness)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Pages Needed</label>
                      <input 
                        name="pagesNeeded"
                        value={formData.pagesNeeded}
                        onChange={handleChange}
                        className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                        placeholder="Home, About, Shop, etc."
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[color:var(--text-muted)] uppercase tracking-[0.3em] ml-1 transition-colors duration-300">Design Preference</label>
                      <input 
                        name="designPreference"
                        value={formData.designPreference}
                        onChange={handleChange}
                        className="w-full px-7 py-5 bg-[color:var(--bg-main)]/50 backdrop-blur-xl rounded-2xl border border-[color:var(--border-main)] focus:border-[color:var(--color-primary)] focus:bg-[color:var(--bg-secondary)] focus:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)] transition-all outline-none font-bold text-[color:var(--text-main)] shadow-sm placeholder-[color:var(--text-muted)]/50" 
                        placeholder="Minimal, Vibrant, etc."
                      />
                    </div>
                </div>
              </div>
              <div className="pt-8 flex justify-between">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-4 text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-colors duration-300"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Go Back
                </button>
                <button 
                  disabled={isSubmitting}
                  className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 relative overflow-hidden group/btn ${
                    isSubmitting 
                      ? 'bg-[color:var(--text-muted)] opacity-50 cursor-not-allowed text-[color:var(--bg-main)]' 
                      : 'bg-[color:var(--color-primary)] text-white hover:opacity-90 shadow-xl shadow-[color:var(--color-primary)]/20 active:scale-95'
                   }`}
                >
                   {step === 3 && !isSubmitting && (
                     <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover/btn:animate-shimmer"
                     />
                   )}
                  {isSubmitting ? 'Submitting...' : 'Start My Project'} <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
