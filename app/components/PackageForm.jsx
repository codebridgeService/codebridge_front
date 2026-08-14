'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { packageService } from '../store/packageService';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeftIcon, 
  CheckIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PackageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [formData, setFormData] = useState({
    name: '',
    kh_name: '',
    price: '',
    description: '',
    kh_description: '',
    features: [''],
    kh_features: [''],
    recommend: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    setFetching(true);
    try {
      const pkg = await packageService.getPackage(id);
      setFormData({
        name: pkg.name || '',
        kh_name: pkg.kh_name || '',
        price: pkg.price || '',
        description: pkg.description || '',
        kh_description: pkg.kh_description || '',
        features: pkg.features.length ? pkg.features : [''],
        kh_features: pkg.kh_features && pkg.kh_features.length ? pkg.kh_features : [''],
        recommend: pkg.recommend ? true : false,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch package');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // filter out empty features
    const cleanFormData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      kh_features: formData.kh_features.filter(f => f.trim() !== '')
    };

    setLoading(true);
    try {
      if (id) {
        await packageService.updatePackage(id, cleanFormData);
      } else {
        await packageService.createPackage(cleanFormData);
      }
      router.push('/admin/packages');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (index, value, isKh = false) => {
    const key = isKh ? 'kh_features' : 'features';
    const newFeatures = [...formData[key]];
    newFeatures[index] = value;
    setFormData({ ...formData, [key]: newFeatures });
  };

  const addFeature = (isKh = false) => {
    const key = isKh ? 'kh_features' : 'features';
    setFormData({ ...formData, [key]: [...formData[key], ''] });
  };

  const removeFeature = (index, isKh = false) => {
    const key = isKh ? 'kh_features' : 'features';
    const newFeatures = formData[key].filter((_, i) => i !== index);
    if(newFeatures.length === 0) newFeatures.push(''); // ensure at least one input
    setFormData({ ...formData, [key]: newFeatures });
  };

  if (fetching) return <div className="p-20 text-center font-bold text-gray-400">Loading package data...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <Link 
          href="/admin/packages"
          className="flex items-center gap-2 text-gray-500 hover:text-[color:var(--color-primary)] transition-all font-bold text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t('Back to Packages', 'ត្រឡប់ទៅកញ្ចប់')}
        </Link>
        <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase">
          {id ? t('Edit Package', 'កែសម្រួលកញ្ចប់') : t('Add New Package', 'បន្ថែម​កញ្ចប់​ថ្មី')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 sm:p-12 shadow-xl space-y-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gradient-to-r from-[color:var(--color-primary)]/5 to-transparent rounded-3xl border border-[color:var(--color-primary)]/10">
             <div>
               <h3 className="font-black text-[color:var(--color-primary)] text-base uppercase tracking-widest mb-1.5">{t('Most Popular / Recommended', 'ពេញនិយម​បំផុត / លេចធ្លោ')}</h3>
               <p className="text-xs font-bold text-[color:var(--color-primary)]/60 uppercase tracking-widest">{t('Highlight this package on the pricing table.', 'ដាក់កញ្ចប់នេះឱ្យលេចធ្លោនៅលើតារាងតម្លៃ។')}</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input 
                 type="checkbox" 
                 className="sr-only peer" 
                 checked={formData.recommend}
                 onChange={(e) => setFormData({...formData, recommend: e.target.checked})}
               />
               <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-[color:var(--color-primary)] hover:scale-105 transition-transform"></div>
             </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">{t('Package Name (EN)', 'ឈ្មោះកញ្ចប់ (EN)')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Premium Plan"
                  className="w-full px-6 py-5 bg-white border border-gray-100 shadow-sm rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">{t('Price String', 'តម្លៃ')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. $999"
                  className="w-full px-6 py-5 bg-white border border-gray-100 shadow-sm rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-black text-[color:var(--color-primary)] text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">{t('Description (EN)', 'ការពិពណ៌នា (EN)')}</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Short description..."
                  className="w-full px-6 py-5 bg-white border border-gray-100 shadow-sm rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-base resize-none"
                />
              </div>

              {/* EN Features List */}
              <div className="space-y-4 pt-6 border-t border-[color:var(--color-primary)]/10">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2 flex justify-between items-center">
                  <span>{t('Features (EN)', 'លក្ខណៈពិសេស (EN)')}</span>
                  <button type="button" onClick={() => addFeature(false)} className="text-[color:var(--color-primary)] hover:underline flex items-center gap-1">
                    <PlusIcon className="w-3 h-3" /> Add Feature
                  </button>
                </label>
                
                <AnimatePresence>
                  {formData.features.map((feature, index) => (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      key={`en-${index}`} 
                      className="flex items-center gap-3"
                    >
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value, false)}
                        placeholder="Feature description"
                        className="w-full px-5 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-gray-700 text-sm"
                      />
                      <button type="button" onClick={() => removeFeature(index, false)} className="p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 bg-gray-50">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>

            <div className="space-y-6 pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-[color:var(--color-primary)]/10 md:pl-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">{t('Package Name (KH)', 'ឈ្មោះកញ្ចប់ (KH)')}</label>
                <input 
                  type="text" 
                  value={formData.kh_name}
                  onChange={(e) => setFormData({...formData, kh_name: e.target.value})}
                  placeholder="ឧទាហរណ៍៖ កញ្ចប់ពិសេស"
                  className="w-full px-6 py-5 bg-white border border-gray-100 shadow-sm rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-base font-battambang"
                />
              </div>
              <div className="space-y-3 opacity-0 select-none pointer-events-none hidden md:block">
                <label className="text-[11px] uppercase tracking-widest px-2">Spacer</label>
                <input type="text" className="w-full px-6 py-5 border-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">{t('Description (KH)', 'ការពិពណ៌នា (KH)')}</label>
                <textarea 
                  rows="3"
                  value={formData.kh_description}
                  onChange={(e) => setFormData({...formData, kh_description: e.target.value})}
                  placeholder="ការពិពណ៌នាខ្លីៗ..."
                  className="w-full px-6 py-5 bg-white border border-gray-100 shadow-sm rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-base resize-none font-battambang"
                />
              </div>

              {/* KH Features List */}
              <div className="space-y-4 pt-6 border-t border-[color:var(--color-primary)]/10">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2 flex justify-between items-center">
                  <span>{t('Features (KH)', 'លក្ខណៈពិសេស (KH)')}</span>
                  <button type="button" onClick={() => addFeature(true)} className="text-[color:var(--color-primary)] hover:underline flex items-center gap-1 font-battambang">
                    <PlusIcon className="w-3 h-3" /> បន្ថែម
                  </button>
                </label>
                
                <AnimatePresence>
                  {formData.kh_features.map((feature, index) => (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      key={`kh-${index}`} 
                      className="flex items-center gap-3"
                    >
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value, true)}
                        placeholder="ការពិពណ៌នាពីលក្ខណៈពិសេស"
                        className="w-full px-5 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-gray-700 text-sm font-battambang"
                      />
                      <button type="button" onClick={() => removeFeature(index, true)} className="p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 bg-gray-50">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button 
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[color:var(--color-primary)] text-white rounded-3xl font-black text-lg shadow-xl shadow-[color:var(--color-primary)]/20 hover:translate-y-[-4px] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : (
                <>
                  <CheckIcon className="w-6 h-6" />
                  {id ? t('Update Package', 'ធ្វើបច្ចុប្បន្នភាពកញ្ចប់') : t('Create Package', 'បង្កើតកញ្ចប់')}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
