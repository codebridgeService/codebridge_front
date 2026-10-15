'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { securityFeatureService } from '@/store/securityFeatureService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  RotateCw, 
  ShieldCheck, 
  Lock, 
  Cloud, 
  Fingerprint, 
  Key, 
  Server,
  Eye,
  EyeOff,
  AlertTriangle,
  Search
} from 'lucide-react';

const ICON_MAP = {
  ShieldCheckIcon: ShieldCheck,
  LockClosedIcon: Lock,
  CloudIcon: Cloud,
  FingerPrintIcon: Fingerprint,
  KeyIcon: Key,
  ServerIcon: Server,
};

const AVAILABLE_ICONS = [
  'ShieldCheckIcon',
  'LockClosedIcon',
  'CloudIcon',
  'FingerPrintIcon',
  'KeyIcon',
  'ServerIcon'
];

export default function SecurityFeaturesPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Section Visibility State
  const [showSecuritySection, setShowSecuritySection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingFeatureId, setTogglingFeatureId] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    titleKh: '',
    description: '',
    descriptionKh: '',
    icon: 'ShieldCheckIcon',
    color: '#0050C3',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFeatures();
    siteSettingService.getSettings()
      .then(settings => {
        if (settings) {
          setShowSecuritySection(settings.showSecurity !== false);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const data = await securityFeatureService.getFeatures();
      setFeatures(data || []);
    } catch (err) {
      console.error('Failed to load security features:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeFeaturesCount = useMemo(
    () => features.filter(f => f.isActive !== false).length,
    [features]
  );
  const hiddenFeaturesCount = useMemo(
    () => features.filter(f => f.isActive === false).length,
    [features]
  );

  const filteredFeatures = useMemo(() => {
    return features.filter(item => {
      const title = item.title || '';
      const titleKh = item.titleKh || '';
      const desc = item.description || '';
      const descKh = item.descriptionKh || '';

      const matchSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        titleKh.includes(search) ||
        desc.toLowerCase().includes(search.toLowerCase()) ||
        descKh.includes(search);

      const isItemActive = item.isActive !== false;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isItemActive) ||
        (statusFilter === 'HIDDEN' && !isItemActive);

      return matchSearch && matchStatus;
    });
  }, [features, search, statusFilter]);

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newStatus = !showSecuritySection;
      await siteSettingService.updateSettings({ showSecurity: newStatus });
      setShowSecuritySection(newStatus);
    } catch (err) {
      console.error('Failed to update security section visibility:', err);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleToggleFeatureActive = async (id, currentStatus) => {
    setTogglingFeatureId(id);
    const newStatus = !currentStatus;
    // Optimistic update
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, isActive: newStatus } : f));

    try {
      await securityFeatureService.updateFeature(id, { isActive: newStatus });
    } catch (err) {
      // Revert on error
      setFeatures(prev => prev.map(f => f.id === id ? { ...f, isActive: currentStatus } : f));
      console.error('Failed to update feature visibility:', err);
    } finally {
      setTogglingFeatureId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingFeature(null);
    setForm({
      title: '',
      titleKh: '',
      description: '',
      descriptionKh: '',
      icon: 'ShieldCheckIcon',
      color: '#0050C3',
      order: features.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (feature) => {
    setEditingFeature(feature);
    setForm({
      title: feature.title || '',
      titleKh: feature.titleKh || '',
      description: feature.description || '',
      descriptionKh: feature.descriptionKh || '',
      icon: feature.icon || 'ShieldCheckIcon',
      color: feature.color || '#0050C3',
      order: feature.order || 0,
      isActive: feature.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFeature) {
        await securityFeatureService.updateFeature(editingFeature.id, form);
      } else {
        await securityFeatureService.createFeature(form);
      }
      setShowModal(false);
      fetchFeatures();
    } catch (err) {
      alert(err.message || 'Failed to save security feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!featureToDelete) return;
    try {
      await securityFeatureService.deleteFeature(featureToDelete.id);
      setShowDeleteModal(false);
      setFeatureToDelete(null);
      fetchFeatures();
    } catch (err) {
      alert(err.message || 'Failed to delete feature');
    }
  };

  return (
    <div className="space-y-3.5 pb-10">
      {/* 1. Header Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xs rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sticky top-4 z-40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050C3] to-[#0088FE] flex items-center justify-center text-white shadow-2xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('Security Guarantee Features', 'មុខងារធានាសុវត្ថិភាព Security')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {features.length} {t('Total Badges', 'មុខងារសរុប')} • {activeFeaturesCount} {t('Live', 'ផ្សាយ')} • {hiddenFeaturesCount} {t('Hidden', 'លាក់')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search features...', 'ស្វែងរកមុខងារ...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={fetchFeatures}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 transition-all shadow-2xs cursor-pointer"
            title={t('Refresh', 'ផ្ទុកឡើងវិញ')}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#0050C3] to-[#0088FE] text-white rounded-xl font-bold text-xs shadow-xs hover:brightness-105 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('Add Feature', 'បន្ថែមមុខងារ')}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. Section Visibility & Visibility Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Homepage Section Visibility Banner */}
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
            showSecuritySection
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                showSecuritySection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {showSecuritySection ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('Homepage Security Section', 'ផ្នែកសុវត្ថិភាពលើទំព័រដើម')}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    showSecuritySection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {showSecuritySection ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {showSecuritySection
                  ? t('Section is currently visible to all visitors', 'ផ្នែកនេះកំពុងបង្ហាញជាសាធារណៈដល់អ្នកទស្សនា')
                  : t('Section is hidden from public website', 'ផ្នែកនេះត្រូវបានលាក់ពីគេហទំព័រសាធារណៈ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVisibility}
            disabled={isTogglingVisibility}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 transition-all shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isTogglingVisibility ? (
              <RotateCw className="w-3 h-3 animate-spin" />
            ) : showSecuritySection ? (
              t('Hide Section', 'លាក់ផ្នែកនេះ')
            ) : (
              t('Show Section', 'បង្ហាញផ្នែកនេះ')
            )}
          </button>
        </div>

        {/* Filter Status Breakdown Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0050C3] border border-blue-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('Security Visibility Breakdown', 'ស្ថានភាពមុខងារ')}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold">
                <span className="text-emerald-700 font-bold">{activeFeaturesCount} {t('Live', 'ផ្សាយ')}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold">{hiddenFeaturesCount} {t('Hidden', 'លាក់')}</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('All', 'ទាំងអស់')} ({features.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              {t('Live', 'ផ្សាយ')} ({activeFeaturesCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('HIDDEN')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'HIDDEN'
                  ? 'bg-slate-700 text-white shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('Hidden', 'លាក់')} ({hiddenFeaturesCount})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Features Grid */}
      {loading ? (
        <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Loading security features...', 'កំពុងផ្ទុកមុខងារសុវត្ថិភាព...')}
        </div>
      ) : filteredFeatures.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-500">{t('No security features found', 'រកមិនឃើញមុខងារសុវត្ថិភាពឡើយ')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFeatures.map((item) => {
            const IconComp = ICON_MAP[item.icon] || ShieldCheck;
            const isItemActive = item.isActive !== false;

            return (
              <motion.div
                key={item.id}
                layout
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-2xs ${
                  isItemActive 
                    ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs' 
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-2xs"
                      style={{ backgroundColor: item.color || '#0050C3' }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Active/Hidden Status Badge */}
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isItemActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}>
                        {isItemActive ? t('Live', 'ផ្សាយ') : t('Hidden', 'លាក់')}
                      </span>

                      {/* Instant Hide/Show Toggle */}
                      <button
                        type="button"
                        title={isItemActive ? t('Hide feature', 'លាក់មុខងារ') : t('Show feature', 'បង្ហាញមុខងារ')}
                        onClick={() => handleToggleFeatureActive(item.id, isItemActive)}
                        disabled={togglingFeatureId === item.id}
                        className={`p-1.5 rounded-lg transition-all shadow-2xs border cursor-pointer ${
                          isItemActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {togglingFeatureId === item.id ? (
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        ) : isItemActive ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#0050C3] border border-slate-200/60 transition-all cursor-pointer shadow-2xs"
                        title={t('Edit', 'កែប្រែ')}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFeatureToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                        title={t('Delete', 'លុប')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900">
                    {item.title}
                  </h3>
                  {item.titleKh && (
                    <p className="text-xs font-semibold text-[#0050C3] font-battambang mt-0.5">
                      {item.titleKh}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  {item.descriptionKh && (
                    <p className="text-[11px] text-slate-400 font-battambang mt-0.5">
                      {item.descriptionKh}
                    </p>
                  )}
                </div>

                <div className="pt-2 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Icon: {item.icon}</span>
                  <span>Order: {item.order}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-xl border border-slate-200/80"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                  {editingFeature ? t('Edit Security Feature', 'កែប្រែមុខងារសុវត្ថិភាព') : t('Create Security Feature', 'បង្កើតមុខងារសុវត្ថិភាពថ្មី')}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Active Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t('Visible on Website', 'បង្ហាញលើគេហទំព័រ')}</h4>
                    <p className="text-[10px] text-slate-500">{t('Show or hide this badge on the public homepage security card.', 'បង្ហាញ ឬលាក់ប័ណ្ណនេះពីគេហទំព័រដើម។')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={form.isActive}
                      onChange={(e) => setForm({...form, isActive: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t('Icon', 'រូបតំណាង')}
                    </label>
                    <select
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic} value={ic}>{ic.replace('Icon', '')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t('Color', 'ពណ៌')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Title (English)', 'ចំណងជើង (ភាសាអង់គ្លេស)')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. End-to-End Encryption"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Title (Khmer)', 'ចំណងជើង (ភាសាខ្មែរ)')}
                  </label>
                  <input
                    type="text"
                    placeholder="ឧទាហរណ៍៖ ការអ៊ិនគ្រីបពីចុងម្ខាងទៅចុងម្ខាង"
                    value={form.titleKh}
                    onChange={(e) => setForm({ ...form, titleKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-battambang font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Description (English)', 'ការពិពណ៌នា (ភាសាអង់គ្លេស)')} *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief explanation of security assurance..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Description (Khmer)', 'ការពិពណ៌នា (ភាសាខ្មែរ)')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ការពិពណ៌នាសង្ខេបអំពីសុវត្ថិភាព..."
                    value={form.descriptionKh}
                    onChange={(e) => setForm({ ...form, descriptionKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-battambang"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Sort Order', 'លំដាប់')}
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-28 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {t('Cancel', 'បោះបង់')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0050C3] to-[#0088FE] text-white text-xs font-bold shadow-xs hover:brightness-105 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? t('Saving...', 'កំពុងរក្សាទុក...') : editingFeature ? t('Save Changes', 'រក្សាទុកការកែប្រែ') : t('Create Feature', 'បង្កើតមុខងារ')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-slate-200/80 text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t('Delete Feature?', 'លុបមុខងារនេះឬ?')}
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {t('Are you sure you want to delete this security feature badge? This action cannot be undone.', 'តើអ្នកប្រាកដជាចង់លុបមុខងារសុវត្ថិភាពនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។')}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {t('Cancel', 'បោះបង់')}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs cursor-pointer"
                >
                  {t('Delete', 'លុប')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
