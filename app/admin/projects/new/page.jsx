'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { projectService } from '../../../store/projectService';
import { 
  ArrowLeftIcon, 
  ComputerDesktopIcon, 
  CloudArrowUpIcon,
  LinkIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ImageUpload from '../../../components/ImageUpload';
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
    category: 'Web Development'
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

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] focus:bg-white transition-all font-medium text-[color:var(--color-primary)] text-sm";
  const labelClasses = "text-sm font-black text-[color:var(--color-primary)] mb-2 ml-1 flex items-center gap-2";

  return (
    <div className="space-y-8 pb-20">
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/admin/projects" className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-[color:var(--color-primary)]/5 transition-all shadow-sm">
               <ArrowLeftIcon className="w-5 h-5 text-[color:var(--color-primary)]" />
            </Link>
            <div>
               <h1 className="text-2xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none mb-1.5">{t('New Project', 'បង្កើតគម្រោងថ្មី')}</h1>
               <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest">{t('Add a new showcase to your portfolio.', 'បន្ថែមស្នាដៃថ្មីទៅកាន់បញ្ជីស្នាដៃរបស់អ្នក។')}</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClasses}>
                  <ComputerDesktopIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
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
                  <TagIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
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

            <div className="border-t border-gray-50 pt-8">
               <ImageUpload 
                 label={t('Project Display Image', 'រូបភាពបង្ហាញគម្រោង')}
                 description={t('Best size: 1920x1080px', 'ទំហំល្អបំផុត: 1920x1080px')}
                 value={formData.image}
                 onChange={(file) => setImageFile(file)}
               />
            </div>

            <div className="border-t border-gray-50 pt-8">
              <label className={labelClasses}>
                <DocumentTextIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
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

            <div className="border-t border-gray-50 pt-8">
              <label className={labelClasses}>
                <DocumentTextIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
                {t('Full Content / Case Study', 'អត្ថបទលម្អិត')}
              </label>
              <textarea 
                rows="10"
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write the full story here (Markdown supported)..."
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm space-y-6">
            <div>
              <label className={labelClasses}>
                <LinkIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
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

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-[0.2em] disabled:opacity-50 text-[10px]"
              >
                {loading ? t('Publishing...', 'កំពុងផ្សព្វផ្សាយ...') : t('Publish Project', 'ផ្សព្វផ្សាយគម្រោង')}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[color:var(--color-primary)] to-blue-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-all" />
             <h4 className="font-black mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-blue-200">
               <span className="w-2 h-2 rounded-full bg-blue-300 block animate-pulse" />
               Performance Tip
             </h4>
             <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest leading-relaxed">
               ImageKit will automatically optimize and CDN-cache your project images for lightning-fast loading across all devices.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
