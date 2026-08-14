'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { teamService } from '../../../store/teamService';
import { useLanguage } from '../../../context/LanguageContext';
import { ArrowLeftIcon, CheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Toast from '../../components/Toast';

function TeamForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', kh_name: '',
    role: '', kh_role: '',
    bio: '', kh_bio: '',
    portfolio_link: '',
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (id) fetchMember();
  }, [id]);

  const fetchMember = async () => {
    setFetching(true);
    try {
      const m = await teamService.getTeamMember(id);
      setFormData({
        name: m.name || '', kh_name: m.kh_name || '',
        role: m.role || '', kh_role: m.kh_role || '',
        bio: m.bio || '', kh_bio: m.kh_bio || '',
        portfolio_link: m.portfolio_link || m.portfolio || '',
        order: m.order || 0,
      });
      if (m.image) setImagePreview(m.image);
    } catch (err) {
      alert('Failed to load team member');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('image', imageFile);

      if (id) {
        await teamService.updateTeamMember(id, data);
        setToast({ show: true, message: t('Team member updated successfully!', 'បានធ្វើបច្ចុប្បន្នភាពសមាជិកដោយជោគជ័យ!'), type: 'success' });
      } else {
        await teamService.createTeamMember(data);
        setToast({ show: true, message: t('Team member added successfully!', 'បានបន្ថែមសមាជិកដោយជោគជ័យ!'), type: 'success' });
      }
      
      setTimeout(() => {
        router.push('/admin/team');
      }, 2000);
    } catch (err) {
      setToast({ show: true, message: err.message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
  });

  if (fetching) return <div className="p-20 text-center font-bold text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      
      <div className="mb-10 flex items-center justify-between">
        <Link href="/admin/team" className="flex items-center gap-2 text-gray-500 hover:text-[color:var(--color-primary)] transition-all font-bold text-sm">
          <ArrowLeftIcon className="w-4 h-4" />
          {t('Back to Team', 'ត្រឡប់ទៅក្រុម')}
        </Link>
        <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase">
          {id ? t('Edit Member', 'កែសម្រួលសមាជិក') : t('Add New Member', 'បន្ថែមសមាជិកថ្មី')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-8">

          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative w-36 h-36 rounded-full cursor-pointer overflow-hidden border-4 border-gray-100 bg-gray-50 hover:opacity-80 transition-all shadow-lg group"
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <UserCircleIcon className="w-14 h-14 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <span className="text-white text-xs font-black uppercase tracking-widest">{t('Change', 'ផ្លាស់ប្ដូរ')}</span>
              </div>
            </div>
            <button type="button" onClick={() => fileInputRef.current.click()} className="text-xs font-black text-[color:var(--color-primary)] uppercase tracking-widest hover:underline">
              {imagePreview ? t('Change Photo', 'ផ្លាស់ប្ដូររូបភាព') : t('Upload Photo', 'ផ្ទុករូបភាព')}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <p className="text-[10px] text-gray-400 font-bold">JPG, PNG, WEBP — max 2MB</p>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* EN Column */}
            <div className="space-y-5">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">🇬🇧 English</div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Name</label>
                <input required type="text" {...field('name')} placeholder="e.g. Vibol Sen"
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Role</label>
                <input required type="text" {...field('role')} placeholder="e.g. Backend Developer"
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Bio</label>
                <textarea rows="3" {...field('bio')} placeholder="Short bio..."
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm resize-none" />
              </div>
            </div>

            {/* KH Column */}
            <div className="space-y-5 pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">🇰🇭 ភាសាខ្មែរ</div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">ឈ្មោះ (KH)</label>
                <input type="text" {...field('kh_name')} placeholder="ឧ. វិបុល សែន"
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm font-battambang" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">តួនាទី (KH)</label>
                <input type="text" {...field('kh_role')} placeholder="ឧ. ការអភិវឌ្ឍន៍ Backend"
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm font-battambang" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">ជីវប្រវត្តិ (KH)</label>
                <textarea rows="3" {...field('kh_bio')} placeholder="ជីវប្រវត្តិខ្លីៗ..."
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm resize-none font-battambang" />
              </div>
            </div>
          </div>

          {/* Portfolio & Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Portfolio URL (optional)</label>
              <input type="url" {...field('portfolio_link')} placeholder="https://..."
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-medium text-gray-700 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Number to display</label>
              <input type="number" min="0" {...field('order')} placeholder="0"
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all font-bold text-[color:var(--color-primary)] text-sm" />
            </div>
          </div>

          <div className="pt-4">
            <button disabled={loading} type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[color:var(--color-primary)] text-white rounded-3xl font-black text-lg shadow-xl shadow-[color:var(--color-primary)]/20 hover:translate-y-[-4px] active:scale-[0.98] transition-all disabled:opacity-50">
              {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : (
                <><CheckIcon className="w-6 h-6" />
                {id ? t('Update Member', 'ធ្វើបច្ចុប្បន្នភាពសមាជិក') : t('Add Member', 'បន្ថែមសមាជិក')}</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewTeamMemberPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-gray-400">Loading form...</div>}>
      <TeamForm />
    </Suspense>
  );
}
