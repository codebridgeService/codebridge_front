'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { projectService } from '@/store/projectService';
import { 
  ArrowLeftIcon, 
  ComputerDesktopIcon, 
  CloudArrowUpIcon,
  LinkIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import Toast from '../../components/Toast';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    link: '',
    category: 'Web Development',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const { lang } = useLanguage();
  const router = useRouter();

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('link', formData.link);
      data.append('isActive', formData.isActive ? 'true' : 'false');
      
      if (imageFile) {
        data.append('image', imageFile);
      } else {
        data.append('image', formData.image);
      }

      await projectService.createProject(data);
      setToast({ show: true, message: t('Project created successfully!', 'គម្រោងត្រូវបានបង្កើតឡើងដោយជោគជ័យ!'), type: 'success' });
      
      setTimeout(() => {
        router.push('/admin/projects');
      }, 2000);
    } catch (err) {
      setToast({ show: true, message: err.message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:border-[color:var(--color-primary)] focus:bg-white transition-all font-medium text-[color:var(--color-primary)] text-xs";
  const labelClasses = "text-xs font-black text-[color:var(--color-primary)] mb-1.5 ml-0.5 flex items-center gap-1.5";

  return (
    <div className="space-y-4 pb-8">
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Link href="/admin/projects" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-[color:var(--color-primary)]/5 transition-all shadow-xs">
               <ArrowLeftIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
            </Link>
            <div>
               <h1 className="text-lg font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none mb-1">{t('New Project', 'បង្កើតគម្រោងថ្មី')}</h1>
               <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest">{t('Add a new showcase to your portfolio.', 'បន្ថែមស្នាដៃថ្មីទៅកាន់បញ្ជីស្នាដៃរបស់អ្នក។')}</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  <ComputerDesktopIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                  {t('Project Title', 'ចំណងជើងគម្រោង')}
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Codebridge Corporate Identity"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <TagIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                  {t('Category', 'ប្រភេទ')}
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={inputClasses}
                >
                  <option>Web Development</option>
                  <option>Mobile App</option>
                  <option>System Development</option>
                  <option>Graphic Design</option>
                  <option>UI/UX Design</option>
                  <option>Digital Marketing</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-3">
               <ImageUpload 
                 label={t('Project Display Image', 'រូបភាពបង្ហាញគម្រោង')}
                 description={t('Best size: 1920x1080px', 'ទំហំល្អបំផុត: 1920x1080px')}
                 value={formData.image}
                 onChange={(file) => setImageFile(file)}
               />
            </div>

            <div className="border-t border-gray-50 pt-3">
              <label className={labelClasses}>
                <DocumentTextIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                {t('Short Description', 'ការពិពណ៌នាខ្លី')}
              </label>
              <textarea 
                rows="2"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="A brief overview of the project..."
                className={inputClasses}
              />
            </div>

            <div className="border-t border-gray-50 pt-3">
              <label className={labelClasses}>
                <DocumentTextIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                {t('Full Content / Case Study', 'អត្ថបទលម្អិត')}
              </label>
              <textarea 
                rows="8"
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write the full story here (Markdown supported)..."
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
            <div>
              <label className={labelClasses}>
                <LinkIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                {t('Live Project Link', 'តំណភ្ជាប់គម្រោង')}
              </label>
              <input 
                type="url" 
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                placeholder="https://..."
                className={inputClasses}
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className={labelClasses}>
                <ComputerDesktopIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                {t('Visibility Status', 'ស្ថានភាពបង្ហាញ')}
              </label>
              <label className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50/50 transition-colors">
                <input 
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0050C3] focus:ring-[#0050C3] cursor-pointer"
                />
                <div className="leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">
                    {formData.isActive ? t('Live on Website', 'បង្ហាញជាសាធារណៈ') : t('Hidden / Draft', 'លាក់មិនបង្ហាញ')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formData.isActive ? t('Visible to all visitors', 'ភ្ញៀវទាំងអស់អាចមើលឃើញ') : t('Hidden from portfolio', 'លាក់ពីទំព័រស្នាដៃ')}
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0050C3] hover:bg-[#0040A0] text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all uppercase tracking-wider disabled:opacity-50 text-[10px] cursor-pointer"
              >
                {loading ? t('Publishing...', 'កំពុងផ្សព្វផ្សាយ...') : t('Publish Project', 'ផ្សព្វផ្សាយគម្រោង')}
              </button>
            </div>
          </div>

          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 sm:p-5 text-slate-700 shadow-2xs">
             <h4 className="font-extrabold mb-1.5 flex items-center gap-1.5 text-xs text-[#0050C3]">
               <span className="w-1.5 h-1.5 rounded-full bg-[#0050C3] block animate-pulse" />
               Performance & Showcase Tip
             </h4>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
               Images are automatically optimized and cached via CDN for lightning-fast loading across mobile and desktop.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
