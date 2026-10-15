'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { serviceService } from '@/store/serviceService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeftIcon, 
  CheckIcon,
  Cog6ToothIcon,
  CodeBracketSquareIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  ChartBarIcon,
  CloudIcon,
  ShieldCheckIcon,
  CommandLineIcon,
  CpuChipIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const icons = [
  { name: 'Cog6ToothIcon', icon: Cog6ToothIcon },
  { name: 'CodeBracketSquareIcon', icon: CodeBracketSquareIcon },
  { name: 'DevicePhoneMobileIcon', icon: DevicePhoneMobileIcon },
  { name: 'PaintBrushIcon', icon: PaintBrushIcon },
  { name: 'ChartBarIcon', icon: ChartBarIcon },
  { name: 'CloudIcon', icon: CloudIcon },
  { name: 'ShieldCheckIcon', icon: ShieldCheckIcon },
  { name: 'CommandLineIcon', icon: CommandLineIcon },
  { name: 'CpuChipIcon', icon: CpuChipIcon },
  { name: 'CircleStackIcon', icon: CircleStackIcon },
];

function ServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [formData, setFormData] = useState({
    name: '',
    kh_name: '',
    description: '',
    kh_description: '',
    icon: 'Cog6ToothIcon',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    setFetching(true);
    try {
      const service = await serviceService.getService(id);
      setFormData({
        name: service.name || service.title || '',
        kh_name: service.kh_name || service.kh_title || '',
        description: service.description || '',
        kh_description: service.kh_description || '',
        icon: service.icon || 'Cog6ToothIcon',
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch service');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await serviceService.updateService(id, formData);
      } else {
        await serviceService.createService(formData);
      }
      router.push('/admin/services');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center font-bold text-slate-400">Loading service data...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-4 flex items-center justify-between">
        <Link 
          href="/admin/services"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          {t('Back to Services', 'ត្រឡប់ទៅសេវាកម្ម')}
        </Link>
        <h1 className="text-base font-bold text-[#0050C3] tracking-tight uppercase">
          {id ? t('Edit Service', 'កែសម្រួលសេវាកម្ម') : t('Add New Service', 'បន្ថែមសេវាកម្មថ្មី')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          
          {/* Active Status Visibility Toggle */}
          <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t('Visible on Website', 'បង្ហាញលើគេហទំព័រ')}</h3>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
                  {formData.isActive ? t('Live', 'ផ្សាយផ្ទាល់') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">{t('Control if this service appears on the public website catalog.', 'គ្រប់គ្រងការបង្ហាញសេវាកម្មនេះលើកាតាឡុកគេហទំព័រ។')}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">{t('Service Title (EN)', 'ចំណងជើងសេវាកម្ម (EN)')}</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Web Development"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all font-bold text-slate-900 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">{t('Service Title (KH)', 'ចំណងជើងសេវាកម្ម (KH)')}</label>
              <input 
                type="text" 
                value={formData.kh_name}
                onChange={(e) => setFormData({...formData, kh_name: e.target.value})}
                placeholder="ឧទាហរណ៍៖ ការអភិវឌ្ឍន៍គេហទំព័រ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all font-bold text-slate-900 text-xs font-battambang"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">{t('Select Icon', 'ជ្រើសរើសរូបតំណាង')}</label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              {icons.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({...formData, icon: item.name})}
                    className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-[#0050C3] text-white shadow-2xs scale-105' 
                        : 'bg-white text-slate-500 hover:text-[#0050C3] hover:scale-105 border border-slate-200/60'
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">{t('Description (EN)', 'ការពិពណ៌នា (EN)')}</label>
            <textarea 
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this service is about..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all font-medium text-slate-700 text-xs resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">{t('Description (KH)', 'ការពិពណ៌នា (KH)')}</label>
            <textarea 
              rows="2"
              value={formData.kh_description}
              onChange={(e) => setFormData({...formData, kh_description: e.target.value})}
              placeholder="រៀបរាប់អំពីសេវាកម្មនេះ..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all font-medium text-slate-700 text-xs resize-none font-battambang"
            />
          </div>

          <div className="pt-2">
            <button 
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0050C3] to-[#0088FE] hover:opacity-95 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  {id ? t('Update Service', 'ធ្វើបច្ចុប្បន្នភាពសេវាកម្ម') : t('Create Service', 'បង្កើតសេវាកម្ម')}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewServicePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-slate-400">Loading form...</div>}>
      <ServiceForm />
    </Suspense>
  );
}
