'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '../../../../context/LanguageContext';
import { projectService } from '../../../../store/projectService';
import { 
  ArrowLeftIcon, 
  ComputerDesktopIcon, 
  TagIcon,
  DocumentTextIcon,
  LinkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ImageUpload from '../../../../components/ImageUpload';

export default function EditProjectPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
  const params = useParams();
  const id = params.id;

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const project = await projectService.getProject(id);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        content: project.content || '',
        image: project.image || '',
        link: project.link || '',
        category: project.category || 'Web Development'
      });
    } catch (err) {
      console.error(err);
      alert(t('Failed to fetch project data.', 'ការទាញយកទិន្នន័យគម្រោងបានបរាជ័យ។'));
    } finally {
      setFetching(false);
    }
  };

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

      await projectService.updateProject(id, data);
      alert(t('Project updated successfully!', 'គម្រោងត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!'));
      router.push('/admin/projects');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/10 focus:border-[color:var(--color-primary)] focus:bg-white transition-all font-medium text-gray-900 text-sm";
  const labelClasses = "text-sm font-black text-gray-900 mb-2 ml-1 flex items-center gap-2";

  if (fetching) {
     return (
       <div className="py-24 text-center animate-pulse text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Loading Project Context...
       </div>
     );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/admin/projects" className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
               <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
               <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none mb-1.5">{t('Edit Project', 'កែសម្រួលគម្រោង')}</h1>
               <p className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">{t('Refine your showcase item details.', 'កែសម្រួលព័ត៌មានលម្អិតនៃស្នាដៃរបស់អ្នក។')}</p>
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
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-[0.2em] disabled:opacity-50 text-[10px]"
              >
                {loading ? t('Updating...', 'កំពុងបច្ចុប្បន្នភាព...') : (
                  <>
                    <CheckIcon className="w-4 h-4 stroke-[3px]" />
                    {t('Update Project', 'ធ្វើបច្ចុប្បន្នភាព')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
