'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { packageService } from '@/store/packageService';
import { useLanguage } from '@/context/LanguageContext';
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
    isActive: true,
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
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
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
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-4 flex items-center justify-between">
        <Link 
          href="/admin/packages"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          {t('Back to Packages', 'ត្រឡប់ទៅកញ្ចប់')}
        </Link>
        <h1 className="text-base font-bold text-[#0050C3] tracking-tight uppercase">
          {id ? t('Edit Package', 'កែសម្រួលកញ្ចប់') : t('Add New Package', 'បន្ថែម​កញ្ចប់​ថ្មី')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Active Visibility Status Toggle */}
            <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t('Visible on Website', 'បង្ហាញលើគេហទំព័រ')}</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
                    {formData.isActive ? t('Live', 'ផ្សាយផ្ទាល់') : t('Hidden', 'លាក់')}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{t('Control if this package shows on public pricing.', 'គ្រប់គ្រងការបង្ហាញកញ្ចប់នេះលើគេហទំព័រ។')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Popular / Recommended Toggle */}
            <div className="flex items-center justify-between gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
              <div>
                <h3 className="font-bold text-[#0050C3] text-xs uppercase tracking-wider mb-0.5">{t('Most Popular', 'ពេញនិយម​បំផុត')}</h3>
                <p className="text-[10px] font-medium text-slate-500">{t('Highlight with a popular badge.', 'ដាក់កញ្ចប់នេះឱ្យលេចធ្លោលើតារាងតម្លៃ។')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.recommend}
                  onChange={(e) => setFormData({...formData, recommend: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0050C3]"></div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">{t('Package Name (EN)', 'ឈ្មោះកញ្ចប់ (EN)')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Premium Plan"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-bold text-[color:var(--color-primary)] text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">{t('Price String', 'តម្លៃ')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. $999"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-black text-[color:var(--color-primary)] text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">{t('Description (EN)', 'ការពិពណ៌នា (EN)')}</label>
                <textarea 
                  required
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Short description..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium text-[color:var(--color-primary)] text-xs resize-none"
                />
              </div>

              {/* EN Features List */}
              <div className="space-y-2 pt-3 border-t border-[color:var(--color-primary)]/10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1 flex justify-between items-center">
                  <span>{t('Features (EN)', 'លក្ខណៈពិសេស (EN)')}</span>
                  <button type="button" onClick={() => addFeature(false)} className="text-[color:var(--color-primary)] hover:underline flex items-center gap-1 text-[11px] font-bold">
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
                      className="flex items-center gap-2"
                    >
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value, false)}
                        placeholder="Feature description"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)]/10 transition-all font-medium text-gray-700 text-xs"
                      />
                      <button type="button" onClick={() => removeFeature(index, false)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 bg-gray-50">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>

            <div className="space-y-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">{t('Package Name (KH)', 'ឈ្មោះកញ្ចប់ (KH)')}</label>
                <input 
                  type="text" 
                  value={formData.kh_name}
                  onChange={(e) => setFormData({...formData, kh_name: e.target.value})}
                  placeholder="ឧទាហរណ៍៖ កញ្ចប់ពិសេស"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-bold text-[color:var(--color-primary)] text-xs font-battambang"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">{t('Description (KH)', 'ការពិពណ៌នា (KH)')}</label>
                <textarea 
                  rows="2"
                  value={formData.kh_description}
                  onChange={(e) => setFormData({...formData, kh_description: e.target.value})}
                  placeholder="ការពិពណ៌នាខ្លីៗ..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] transition-all font-medium text-[color:var(--color-primary)] text-xs resize-none font-battambang"
                />
              </div>

              {/* KH Features List */}
              <div className="space-y-2 pt-3 border-t border-[color:var(--color-primary)]/10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1 flex justify-between items-center">
                  <span>{t('Features (KH)', 'លក្ខណៈពិសេស (KH)')}</span>
                  <button type="button" onClick={() => addFeature(true)} className="text-[color:var(--color-primary)] hover:underline flex items-center gap-1 text-[11px] font-bold font-battambang">
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
                      className="flex items-center gap-2"
                    >
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value, true)}
                        placeholder="ការពិពណ៌នាពីលក្ខណៈពិសេស"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)]/10 transition-all font-medium text-gray-700 text-xs font-battambang"
                      />
                      <button type="button" onClick={() => removeFeature(index, true)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 bg-gray-50">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button 
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[color:var(--color-primary)] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : (
                <>
                  <CheckIcon className="w-4 h-4" />
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
