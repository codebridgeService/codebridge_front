'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workStepService } from '@/store/workStepService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  RotateCw, 
  Workflow, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Search
} from 'lucide-react';

export default function WorkflowManagementPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Section Visibility State
  const [showHowWeWorkSection, setShowHowWeWorkSection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingStepId, setTogglingStepId] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stepToDelete, setStepToDelete] = useState(null);

  // Form state
  const [form, setForm] = useState({
    stepNumber: '01',
    title: '',
    titleKh: '',
    description: '',
    descriptionKh: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchSteps();
    siteSettingService.getSettings()
      .then(settings => {
        if (settings) {
          setShowHowWeWorkSection(settings.showHowWeWork !== false);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const fetchSteps = async () => {
    setLoading(true);
    try {
      const data = await workStepService.getSteps();
      setSteps(data || []);
    } catch (err) {
      console.error('Failed to load work steps:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeStepsCount = useMemo(
    () => steps.filter(s => s.isActive !== false).length,
    [steps]
  );
  const hiddenStepsCount = useMemo(
    () => steps.filter(s => s.isActive === false).length,
    [steps]
  );

  const filteredSteps = useMemo(() => {
    return steps.filter(step => {
      const title = step.title || '';
      const titleKh = step.titleKh || '';
      const desc = step.description || '';
      const descKh = step.descriptionKh || '';

      const matchSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        titleKh.includes(search) ||
        desc.toLowerCase().includes(search.toLowerCase()) ||
        descKh.includes(search);

      const isStepActive = step.isActive !== false;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isStepActive) ||
        (statusFilter === 'HIDDEN' && !isStepActive);

      return matchSearch && matchStatus;
    });
  }, [steps, search, statusFilter]);

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newStatus = !showHowWeWorkSection;
      await siteSettingService.updateSettings({ showHowWeWork: newStatus });
      setShowHowWeWorkSection(newStatus);
    } catch (err) {
      console.error('Failed to update workflow section visibility:', err);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleToggleStepActive = async (id, currentStatus) => {
    setTogglingStepId(id);
    const newStatus = !currentStatus;
    // Optimistic update
    setSteps(prev => prev.map(s => s.id === id ? { ...s, isActive: newStatus } : s));

    try {
      await workStepService.updateStep(id, { isActive: newStatus });
    } catch (err) {
      // Revert on error
      setSteps(prev => prev.map(s => s.id === id ? { ...s, isActive: currentStatus } : s));
      console.error('Failed to update step visibility:', err);
    } finally {
      setTogglingStepId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingStep(null);
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    setForm({
      stepNumber: nextNum,
      title: '',
      titleKh: '',
      description: '',
      descriptionKh: '',
      order: steps.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (step) => {
    setEditingStep(step);
    setForm({
      stepNumber: step.stepNumber || '01',
      title: step.title || '',
      titleKh: step.titleKh || '',
      description: step.description || '',
      descriptionKh: step.descriptionKh || '',
      order: step.order || 0,
      isActive: step.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStep) {
        await workStepService.updateStep(editingStep.id, form);
      } else {
        await workStepService.createStep(form);
      }
      setShowModal(false);
      fetchSteps();
    } catch (err) {
      alert(err.message || 'Failed to save step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!stepToDelete) return;
    try {
      await workStepService.deleteStep(stepToDelete.id);
      setShowDeleteModal(false);
      setStepToDelete(null);
      fetchSteps();
    } catch (err) {
      alert(err.message || 'Failed to delete step');
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
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('"How We Work" Workflow Steps', 'ដំណាក់កាលការងារ "How We Work"')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {steps.length} {t('Total Steps', 'ដំណាក់កាលសរុប')} • {activeStepsCount} {t('Live', 'ផ្សាយ')} • {hiddenStepsCount} {t('Hidden', 'លាក់')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search steps...', 'ស្វែងរកដំណាក់កាល...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={fetchSteps}
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
            <span>{t('Add Step', 'បន្ថែមដំណាក់កាល')}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. Section Visibility & Visibility Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Homepage Section Visibility Banner */}
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
            showHowWeWorkSection
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                showHowWeWorkSection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {showHowWeWorkSection ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('Homepage "How We Work" Section', 'ផ្នែក "How We Work" លើទំព័រដើម')}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    showHowWeWorkSection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {showHowWeWorkSection ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {showHowWeWorkSection
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
            ) : showHowWeWorkSection ? (
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
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('Workflow Visibility Breakdown', 'ស្ថានភាពដំណាក់កាល')}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold">
                <span className="text-emerald-700 font-bold">{activeStepsCount} {t('Live', 'ផ្សាយ')}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold">{hiddenStepsCount} {t('Hidden', 'លាក់')}</span>
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
              {t('All', 'ទាំងអស់')} ({steps.length})
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
              {t('Live', 'ផ្សាយ')} ({activeStepsCount})
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
              {t('Hidden', 'លាក់')} ({hiddenStepsCount})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Steps Grid Display */}
      {loading ? (
        <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Loading steps...', 'កំពុងផ្ទុកដំណាក់កាល...')}
        </div>
      ) : filteredSteps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <Workflow className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-500">{t('No workflow steps found', 'រកមិនឃើញដំណាក់កាលការងារឡើយ')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSteps.map((step) => {
            const isStepActive = step.isActive !== false;

            return (
              <motion.div
                key={step.id}
                layout
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-2xs ${
                  isStepActive 
                    ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs' 
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-[#0050C3]">
                      {step.stepNumber}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Active/Hidden Status Badge */}
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isStepActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}>
                        {isStepActive ? t('Live', 'ផ្សាយ') : t('Hidden', 'លាក់')}
                      </span>

                      {/* Instant Hide/Show Toggle */}
                      <button
                        type="button"
                        title={isStepActive ? t('Hide step', 'លាក់ដំណាក់កាល') : t('Show step', 'បង្ហាញដំណាក់កាល')}
                        onClick={() => handleToggleStepActive(step.id, isStepActive)}
                        disabled={togglingStepId === step.id}
                        className={`p-1.5 rounded-lg transition-all shadow-2xs border cursor-pointer ${
                          isStepActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {togglingStepId === step.id ? (
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        ) : isStepActive ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(step)}
                        className="p-1.5 rounded-lg text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#0050C3] border border-slate-200/60 transition-all cursor-pointer shadow-2xs"
                        title={t('Edit', 'កែប្រែ')}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setStepToDelete(step);
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
                    {step.title}
                  </h3>
                  {step.titleKh && (
                    <p className="text-xs font-semibold text-[#0050C3] font-battambang mt-0.5">
                      {step.titleKh}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                  {step.descriptionKh && (
                    <p className="text-[11px] text-slate-400 font-battambang mt-0.5">
                      {step.descriptionKh}
                    </p>
                  )}
                </div>

                <div className="pt-2 mt-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  Order: {step.order}
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
                  {editingStep ? t('Edit Workflow Step', 'កែប្រែដំណាក់កាល') : t('Create Workflow Step', 'បង្កើតដំណាក់កាលថ្មី')}
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
                    <p className="text-[10px] text-slate-500">{t('Show or hide this step on the public "How We Work" section.', 'បង្ហាញ ឬលាក់ដំណាក់កាលនេះពីគេហទំព័រសាធារណៈ។')}</p>
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
                      {t('Step Number', 'លេខដំណាក់កាល')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01, 02"
                      value={form.stepNumber}
                      onChange={(e) => setForm({ ...form, stepNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-mono font-bold"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Title (English)', 'ចំណងជើង (ភាសាអង់គ្លេស)')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Discovery & Architecture"
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
                    placeholder="ឧទាហរណ៍៖ ការស្រាវជ្រាវ និងស្ថាបត្យកម្ម"
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
                    placeholder="Brief description of this phase..."
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
                    placeholder="ការពិពណ៌នាសង្ខេបអំពីដំណាក់កាលនេះ..."
                    value={form.descriptionKh}
                    onChange={(e) => setForm({ ...form, descriptionKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-battambang"
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
                    {isSubmitting ? t('Saving...', 'កំពុងរក្សាទុក...') : editingStep ? t('Save Changes', 'រក្សាទុកការកែប្រែ') : t('Create Step', 'បង្កើតដំណាក់កាល')}
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
                {t('Delete Step?', 'លុបដំណាក់កាលនេះឬ?')}
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {t('Are you sure you want to delete this workflow step? This action cannot be undone.', 'តើអ្នកប្រាកដជាចង់លុបដំណាក់កាលការងារនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។')}
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
