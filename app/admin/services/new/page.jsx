'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { serviceService } from '../../../store/serviceService';
import { useLanguage } from '../../../context/LanguageContext';
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

  if (fetching) return <div className="p-20 text-center font-bold text-gray-400">Loading service data...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <Link 
          href="/admin/services"
          className="flex items-center gap-2 text-gray-500 hover:text-[color:var(--color-primary)] transition-all font-bold text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t('Back to Services', 'ត្រឡប់ទៅសេវាកម្ម')}
        </Link>
        <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase">
          {id ? t('Edit Service', 'កែសម្រួលសេវាកម្ម') : t('Add New Service', 'បន្ថែមសេវាកម្មថ្មី')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('Service Title (EN)', 'ចំណងជើងសេវាកម្ម (EN)')}</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Web Development"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('Service Title (KH)', 'ចំណងជើងសេវាកម្ម (KH)')}</label>
              <input 
                type="text" 
                value={formData.kh_name}
                onChange={(e) => setFormData({...formData, kh_name: e.target.value})}
                placeholder="ឧទាហរណ៍៖ ការអភិវឌ្ឍន៍គេហទំព័រ"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm font-battambang"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('Select Icon', 'ជ្រើសរើសរូបតំណាង')}</label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 p-4 bg-gray-50 rounded-3xl">
              {icons.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({...formData, icon: item.name})}
                    className={`aspect-square flex items-center justify-center rounded-2xl transition-all ${
                      isSelected 
                        ? 'bg-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary)]/20 scale-110' 
                        : 'bg-white text-gray-400 hover:text-[color:var(--color-primary)] hover:scale-105'
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('Description (EN)', 'ការពិពណ៌នា (EN)')}</label>
            <textarea 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this service is about..."
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('Description (KH)', 'ការពិពណ៌នា (KH)')}</label>
            <textarea 
              rows="4"
              value={formData.kh_description}
              onChange={(e) => setFormData({...formData, kh_description: e.target.value})}
              placeholder="រៀបរាប់អំពីសេវាកម្មនេះ..."
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm resize-none font-battambang"
            />
          </div>

          <div className="pt-6">
            <button 
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[color:var(--color-primary)] text-white rounded-3xl font-black text-lg shadow-xl shadow-[color:var(--color-primary)]/20 hover:translate-y-[-4px] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : (
                <>
                  <CheckIcon className="w-6 h-6" />
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
    <Suspense fallback={<div className="p-20 text-center font-bold text-gray-400">Loading form...</div>}>
      <ServiceForm />
    </Suspense>
  );
}
