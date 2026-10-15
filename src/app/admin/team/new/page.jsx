'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { teamService } from '@/store/teamService';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowLeft,
  Check,
  User,
  Camera,
  Globe,
  RotateCw,
  ExternalLink,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
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
    name: '',
    kh_name: '',
    role: '',
    kh_role: '',
    bio: '',
    kh_bio: '',
    portfolio_link: '',
    order: 0,
    isActive: true,
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
        name: m.name || '',
        kh_name: m.kh_name || '',
        role: m.role || '',
        kh_role: m.kh_role || '',
        bio: m.bio || '',
        kh_bio: m.kh_bio || '',
        portfolio_link: m.portfolio_link || m.portfolio || '',
        order: m.order || 0,
        isActive: m.isActive !== false,
      });
      if (m.image) setImagePreview(m.image);
    } catch (err) {
      setToast({ show: true, message: 'Failed to load team member', type: 'error' });
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
        setToast({
          show: true,
          message: t('Team member updated successfully!', 'បានធ្វើបច្ចុប្បន្នភាពសមាជិកដោយជោគជ័យ!'),
          type: 'success',
        });
      } else {
        await teamService.createTeamMember(data);
        setToast({
          show: true,
          message: t('Team member added successfully!', 'បានបន្ថែមសមាជិកដោយជោគជ័យ!'),
          type: 'success',
        });
      }

      setTimeout(() => {
        router.push('/admin/team');
      }, 1500);
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

  if (fetching) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs max-w-2xl mx-auto my-8">
        <RotateCw className="w-5 h-5 text-[#0050C3] animate-spin mx-auto mb-2" />
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
          {t('Loading profile details...', 'កំពុងផ្ទុកព័ត៌មានសមាជិក...')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-4">
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('Back to Team', 'ត្រឡប់ទៅបញ្ជីក្រុម')}</span>
        </Link>

        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {id ? t('Edit Member Profile', 'កែសម្រួលសមាជិក') : t('Add New Member', 'បន្ថែមសមាជិកថ្មី')}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-5">
          {/* Photo & Visibility Quick Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className="relative w-20 h-20 rounded-2xl cursor-pointer overflow-hidden border border-slate-200 bg-slate-50 hover:opacity-90 transition-all shadow-2xs group shrink-0"
                onClick={() => fileInputRef.current.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100/60">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-0.5 text-white">
                  <Camera className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {t('Change', 'ប្តូរ')}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-xs font-bold text-[#0050C3] hover:underline"
                >
                  {imagePreview ? t('Upload New Picture', 'ផ្លាស់ប្ដូររូបភាព') : t('Select Profile Picture', 'ជ្រើសរូបភាព')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  PNG, JPG or WEBP (Square photo recommended)
                </p>
              </div>
            </div>

            {/* Individual Visibility Toggle */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {t('Public Visibility', 'ការបង្ហាញជាសាធារណៈ')}
                </span>
                <span className={`text-xs font-bold ${formData.isActive ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {formData.isActive ? t('Live on Website', 'បង្ហាញលើវេបសាយ') : t('Hidden from Website', 'លាក់ពីវេបសាយ')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  formData.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
                title={formData.isActive ? t('Click to hide', 'ចុចដើម្បីលាក់') : t('Click to show', 'ចុចដើម្បីបង្ហាញ')}
              >
                {formData.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dual Language Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* English Information */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                  EN
                </span>
                <span className="text-xs font-bold text-slate-800">English Information</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  {...field('name')}
                  placeholder="e.g. Vibol Sen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Role / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  {...field('role')}
                  placeholder="e.g. Lead Backend Engineer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Bio / Summary
                </label>
                <textarea
                  rows="2"
                  {...field('bio')}
                  placeholder="Brief expertise summary..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-medium text-slate-900 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Khmer Information */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-50 text-[#0050C3] uppercase">
                  KH
                </span>
                <span className="text-xs font-bold text-slate-800 font-battambang">
                  ព័ត៌មានជាភាសាខ្មែរ
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-battambang">
                  ឈ្មោះ (KH)
                </label>
                <input
                  type="text"
                  {...field('kh_name')}
                  placeholder="ឧ. វិបុល សែន"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-semibold text-slate-900 font-battambang"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-battambang">
                  តួនាទី (KH)
                </label>
                <input
                  type="text"
                  {...field('kh_role')}
                  placeholder="ឧ. ប្រធានផ្នែក Backend"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-semibold text-slate-900 font-battambang"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-battambang">
                  ជីវប្រវត្តិសង្ខេប (KH)
                </label>
                <textarea
                  rows="2"
                  {...field('kh_bio')}
                  placeholder="ជីវប្រវត្តិខ្លីៗ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-medium text-slate-900 resize-none font-battambang leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Social Links & Ordering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Portfolio / LinkedIn Link</span>
              </label>
              <input
                type="url"
                {...field('portfolio_link')}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-slate-400" />
                <span>Display Order Position</span>
              </label>
              <input
                type="number"
                min="0"
                {...field('order')}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0050C3] to-[#0088FE] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('Saving Profile...', 'កំពុងរក្សាទុក...')}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {id
                      ? t('Update Team Member', 'ធ្វើបច្ចុប្បន្នភាពសមាជិក')
                      : t('Save & Add to Roster', 'រក្សាទុក & បញ្ចូលក្នុងក្រុម')}
                  </span>
                </>
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
    <Suspense
      fallback={
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs max-w-2xl mx-auto my-8">
          <RotateCw className="w-5 h-5 text-[#0050C3] animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Loading...</p>
        </div>
      }
    >
      <TeamForm />
    </Suspense>
  );
}
