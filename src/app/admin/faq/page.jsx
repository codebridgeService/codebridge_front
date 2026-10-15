'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqService } from '@/store/faqService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Edit3,
  Search,
  HelpCircle,
  X,
  Check,
  RotateCw,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function FaqManagementPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, HIDDEN

  // Section Visibility State
  const [showFaqSection, setShowFaqSection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingFaqId, setTogglingFaqId] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  // Form state
  const [form, setForm] = useState({
    question: '',
    questionKh: '',
    answer: '',
    answerKh: '',
    category: 'General',
    categoryKh: 'ទូទៅ',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFaqs();
    siteSettingService.getSettings()
      .then(settings => {
        if (settings) {
          setShowFaqSection(settings.showFaq !== false);
        }
      })
      .catch(err => console.error('Failed to load site settings:', err));
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const data = await faqService.getFaqs();
      setFaqs(data || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeFaqsCount = useMemo(
    () => faqs.filter(f => f.isActive !== false).length,
    [faqs]
  );
  const hiddenFaqsCount = useMemo(
    () => faqs.filter(f => f.isActive === false).length,
    [faqs]
  );

  const categories = useMemo(() => {
    const cats = ['All'];
    faqs.forEach(f => {
      if (f.category && !cats.includes(f.category)) {
        cats.push(f.category);
      }
    });
    return cats;
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchSearch =
        (f.question?.toLowerCase().includes(search.toLowerCase())) ||
        (f.questionKh?.includes(search)) ||
        (f.answer?.toLowerCase().includes(search.toLowerCase())) ||
        (f.answerKh?.includes(search));
      
      const matchCat = activeCategory === 'All' || f.category === activeCategory;

      const isFaqActive = f.isActive !== false;
      const matchStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isFaqActive) ||
        (statusFilter === 'HIDDEN' && !isFaqActive);

      return matchSearch && matchCat && matchStatus;
    });
  }, [faqs, search, activeCategory, statusFilter]);

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newStatus = !showFaqSection;
      await siteSettingService.updateSettings({ showFaq: newStatus });
      setShowFaqSection(newStatus);
    } catch (err) {
      console.error('Failed to update FAQ section visibility:', err);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleToggleFaqActive = async (id, currentStatus) => {
    setTogglingFaqId(id);
    const newStatus = !currentStatus;
    // Optimistic update
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, isActive: newStatus } : f));

    try {
      await faqService.updateFaq(id, { isActive: newStatus });
    } catch (err) {
      // Revert on error
      setFaqs(prev => prev.map(f => f.id === id ? { ...f, isActive: currentStatus } : f));
      console.error('Failed to update FAQ visibility:', err);
    } finally {
      setTogglingFaqId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setForm({
      question: '',
      questionKh: '',
      answer: '',
      answerKh: '',
      category: activeCategory !== 'All' ? activeCategory : 'General',
      categoryKh: activeCategory === 'Technical' ? 'បច្ចេកទេស' : 'ទូទៅ',
      order: faqs.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setForm({
      question: faq.question || '',
      questionKh: faq.questionKh || '',
      answer: faq.answer || '',
      answerKh: faq.answerKh || '',
      category: faq.category || 'General',
      categoryKh: faq.categoryKh || 'ទូទៅ',
      order: faq.order || 0,
      isActive: faq.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFaq) {
        await faqService.updateFaq(editingFaq.id, form);
      } else {
        await faqService.createFaq(form);
      }
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      console.error('Failed to save FAQ:', err);
      alert(err.message || 'Failed to save FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      await faqService.deleteFaq(faqToDelete.id);
      setShowDeleteModal(false);
      setFaqToDelete(null);
      fetchFaqs();
    } catch (err) {
      alert(err.message || 'Failed to delete FAQ');
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
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('FAQ Management', 'គ្រប់គ្រងសំណួរញឹកញាប់')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {faqs.length} {t('Total FAQs', 'សំណួរសរុប')} • {activeFaqsCount} {t('Live', 'ផ្សាយ')} • {hiddenFaqsCount} {t('Hidden', 'លាក់')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search questions...', 'ស្វែងរកសំណួរ...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={fetchFaqs}
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
            <span>{t('Add New FAQ', 'បន្ថែមសំណួរថ្មី')}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. Section Visibility & Visibility Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Homepage Section Visibility Banner */}
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
            showFaqSection
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                showFaqSection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {showFaqSection ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('Homepage FAQ Section', 'ផ្នែកសំណួរញឹកញាប់លើទំព័រដើម')}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    showFaqSection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {showFaqSection ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {showFaqSection
                  ? t('FAQ section is visible on public website', 'ផ្នែកសំណួរកំពុងបង្ហាញជាសាធារណៈ')
                  : t('FAQ section is hidden from public website', 'ផ្នែកសំណួរត្រូវបានលាក់ពីគេហទំព័រសាធារណៈ')}
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
            ) : showFaqSection ? (
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
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('FAQ Visibility Breakdown', 'ស្ថានភាពសំណួរ')}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold">
                <span className="text-emerald-700 font-bold">{activeFaqsCount} {t('Live', 'ផ្សាយ')}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold">{hiddenFaqsCount} {t('Hidden', 'លាក់')}</span>
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
              {t('All', 'ទាំងអស់')} ({faqs.length})
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
              {t('Live', 'ផ្សាយ')} ({activeFaqsCount})
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
              {t('Hidden', 'លាក់')} ({hiddenFaqsCount})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">{t('Category:', 'ប្រភេទ:')}</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#0050C3] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. FAQ Items Grid */}
      {loading ? (
        <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Loading FAQs...', 'កំពុងផ្ទុកសំណួរ...')}
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-500">{t('No FAQs found', 'រកមិនឃើញសំណួរឡើយ')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredFaqs.map((faq) => {
            const isFaqActive = faq.isActive !== false;

            return (
              <motion.div
                key={faq.id}
                layout
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all shadow-2xs ${
                  isFaqActive 
                    ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs' 
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0050C3] border border-blue-200/60 text-[10px] font-bold">
                        {faq.category} {faq.categoryKh ? `(${faq.categoryKh})` : ''}
                      </span>
                      
                      {/* Live / Hidden Badge */}
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isFaqActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}>
                        {isFaqActive ? t('Live', 'ផ្សាយ') : t('Hidden', 'លាក់')}
                      </span>

                      <span className="text-[9px] font-mono text-slate-400">
                        Order: {faq.order}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {faq.question}
                      </h3>
                      {faq.questionKh && (
                        <p className="text-xs font-medium text-slate-600 font-battambang mt-0.5">
                          {faq.questionKh}
                        </p>
                      )}
                    </div>

                    <div className="pt-1 text-xs text-slate-500 leading-relaxed space-y-0.5">
                      <p>{faq.answer}</p>
                      {faq.answerKh && (
                        <p className="text-[11px] text-slate-400 font-battambang">
                          {faq.answerKh}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 border-l border-slate-100 pl-2.5">
                    {/* Instant Hide/Show Toggle */}
                    <button
                      type="button"
                      title={isFaqActive ? t('Hide FAQ', 'លាក់សំណួរ') : t('Show FAQ', 'បង្ហាញសំណួរ')}
                      onClick={() => handleToggleFaqActive(faq.id, isFaqActive)}
                      disabled={togglingFaqId === faq.id}
                      className={`p-1.5 rounded-lg transition-all shadow-2xs border cursor-pointer ${
                        isFaqActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {togglingFaqId === faq.id ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isFaqActive ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(faq)}
                      className="p-1.5 rounded-lg text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#0050C3] border border-slate-200/60 transition-all cursor-pointer shadow-2xs"
                      title={t('Edit', 'កែប្រែ')}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFaqToDelete(faq);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                      title={t('Delete', 'លុប')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 5. Create / Edit Modal (Crisp Light Enterprise) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-2xl p-5 shadow-xl border border-slate-200/80 my-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                  {editingFaq ? t('Edit FAQ', 'កែប្រែសំណួរ') : t('Create New FAQ', 'បង្កើតសំណួរថ្មី')}
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
                {/* Visibility Toggle Inside Modal */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t('Visible on Website', 'បង្ហាញលើគេហទំព័រ')}</h4>
                    <p className="text-[10px] text-slate-500">{t('Show or hide this question from the public site FAQ section.', 'បង្ហាញ ឬលាក់សំណួរនេះពីគេហទំព័រសាធារណៈ។')}</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t('Category (English)', 'ប្រភេទ (ភាសាអង់គ្លេស)')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. General, Technical, Pricing"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t('Category (Khmer)', 'ប្រភេទ (ភាសាខ្មែរ)')}
                    </label>
                    <input
                      type="text"
                      placeholder="ឧទាហរណ៍៖ ទូទៅ, បច្ចេកទេស, តម្លៃ"
                      value={form.categoryKh}
                      onChange={(e) => setForm({ ...form, categoryKh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-battambang"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Question (English)', 'សំណួរ (ភាសាអង់គ្លេស)')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter question in English..."
                    value={form.question}
                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Question (Khmer)', 'សំណួរ (ភាសាខ្មែរ)')}
                  </label>
                  <input
                    type="text"
                    placeholder="បញ្ចូលសំណួរជាភាសាខ្មែរ..."
                    value={form.questionKh}
                    onChange={(e) => setForm({ ...form, questionKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-battambang"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Answer (English)', 'ចម្លើយ (ភាសាអង់គ្លេស)')} *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Detailed explanation in English..."
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Answer (Khmer)', 'ចម្លើយ (ភាសាខ្មែរ)')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ការពន្យល់លម្អិតជាភាសាខ្មែរ..."
                    value={form.answerKh}
                    onChange={(e) => setForm({ ...form, answerKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white font-battambang"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('Sort Order', 'លំដាប់បង្ហាញ')}
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
                    {isSubmitting ? t('Saving...', 'កំពុងរក្សាទុក...') : editingFaq ? t('Save Changes', 'រក្សាទុកការកែប្រែ') : t('Create FAQ', 'បង្កើតសំណួរ')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Delete Confirmation Modal */}
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
                {t('Delete FAQ?', 'លុបសំណួរនេះឬ?')}
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {t('Are you sure you want to delete this FAQ entry? This action cannot be undone.', 'តើអ្នកប្រាកដជាចង់លុបសំណួរនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។')}
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
