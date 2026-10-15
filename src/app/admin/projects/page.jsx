'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { projectService } from '@/store/projectService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Layers, 
  Trash2, 
  Edit3, 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  GripVertical, 
  RotateCw,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUpDown,
  Tag,
  CheckCircle2
} from 'lucide-react';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'LIVE' | 'HIDDEN'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Section Visibility State
  const [showProjectsSection, setShowProjectsSection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingProjectId, setTogglingProjectId] = useState(null);

  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Result State
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState('success');
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, settingsData] = await Promise.all([
        projectService.getProjects(),
        siteSettingService.getSettings().catch(() => null)
      ]);
      setProjects(projectsData || []);
      if (settingsData && typeof settingsData.showProjects === 'boolean') {
        setShowProjectsSection(settingsData.showProjects);
      }
      setHasUnsavedOrder(false);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Categories
  const categories = useMemo(() => {
    const cats = projects.map(p => p.category?.trim()).filter(Boolean);
    return ['ALL', ...Array.from(new Set(cats))];
  }, [projects]);

  const liveProjectsCount = useMemo(() => 
    projects.filter(p => p.isActive !== false).length,
    [projects]
  );

  const hiddenProjectsCount = useMemo(() => 
    projects.filter(p => p.isActive === false).length,
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = 
        (project.title?.toLowerCase().includes(search.toLowerCase())) || 
        (project.category?.toLowerCase().includes(search.toLowerCase())) ||
        (project.description?.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'LIVE' ? (project.isActive !== false) :
        (project.isActive === false);

      const matchesCategory = 
        selectedCategory === 'ALL' ? true : project.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, search, statusFilter, selectedCategory]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const handleReorder = (newOrder) => {
    setProjects(newOrder);
    setHasUnsavedOrder(true);
  };

  const saveNewOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orders = projects.map((project, index) => ({
        id: project.id,
        order: index
      }));
      await projectService.reorderProjects(orders);
      setHasUnsavedOrder(false);
      setResultMessage(t("Project order saved successfully!", "លំដាប់គម្រោងត្រូវបានរក្សាទុកដោយជោគជ័យ!"));
      setResultType("success");
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message || "Failed to save order");
      setResultType("error");
      setShowResultModal(true);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Toggle individual project visibility (hide/show)
  const handleToggleProjectActive = async (id, currentStatus) => {
    setTogglingProjectId(id);
    const newStatus = !currentStatus;

    // Optimistic Update
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, isActive: newStatus } : p))
    );

    try {
      await projectService.updateProject(id, { isActive: newStatus });
      setResultMessage(
        newStatus
          ? t("Project is now visible on the public website!", "គម្រោងត្រូវបានបង្ហាញលើគេហទំព័រសាធារណៈហើយ!")
          : t("Project is now hidden from the public website.", "គម្រោងត្រូវបានលាក់ពីគេហទំព័រសាធារណៈហើយ។")
      );
      setResultType("success");
      setShowResultModal(true);
    } catch (err) {
      // Revert optimistic update
      setProjects(prev =>
        prev.map(p => (p.id === id ? { ...p, isActive: currentStatus } : p))
      );
      setResultMessage(err.message || "Failed to update project visibility");
      setResultType("error");
      setShowResultModal(true);
    } finally {
      setTogglingProjectId(null);
    }
  };

  // Toggle entire section visibility on homepage
  const handleToggleSectionVisibility = async () => {
    setIsTogglingVisibility(true);
    const newStatus = !showProjectsSection;
    try {
      await siteSettingService.updateSettings({ showProjects: newStatus });
      setShowProjectsSection(newStatus);
      setResultMessage(
        newStatus
          ? t("Projects section is now live on the homepage!", "ផ្នែកគម្រោងត្រូវបានបង្ហាញលើទំព័រដើមហើយ!")
          : t("Projects section has been hidden from the homepage.", "ផ្នែកគម្រោងត្រូវបានលាក់ពីទំព័រដើមហើយ។")
      );
      setResultType("success");
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message || "Failed to update section visibility");
      setResultType("error");
      setShowResultModal(true);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleDeleteRequest = (id, title, isBulk = false) => {
    setItemToDelete({ id, title, isBulk });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.isBulk) {
        await Promise.all(selectedIds.map(id => projectService.deleteProject(id)));
        setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        setResultMessage(t("Selected projects deleted successfully!", "បានលុបគម្រោងដែលបានជ្រើសរើសដោយជោគជ័យ!"));
      } else {
        await projectService.deleteProject(itemToDelete.id);
        setProjects(prev => prev.filter(p => p.id !== itemToDelete.id));
        setResultMessage(t("Project deleted successfully!", "បានលុបគម្រោងដោយជោគជ័យ!"));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      setResultType("success");
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message || "Failed to delete project");
      setResultType("error");
      setShowResultModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0050C3] shadow-2xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {t('Projects Showcase', 'ស្នាដៃគម្រោង')}
              </h1>
              <span className="text-[10px] font-bold text-[#0050C3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {projects.length} {t('Items', 'គម្រោង')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {t('Manage portfolio case studies, reorder sequence, and control public visibility.', 'គ្រប់គ្រងស្នាដៃគម្រោង តម្រៀបលំដាប់ និងគ្រប់គ្រងការបង្ហាញជាសាធារណៈ។')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasUnsavedOrder && (
            <button 
              onClick={saveNewOrder}
              disabled={isSavingOrder}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-200/80 shadow-2xs disabled:opacity-50 cursor-pointer animate-pulse"
            >
              {isSavingOrder ? <RotateCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-emerald-600" />}
              <span>{t('Save New Order', 'រក្សាទុកលំដាប់')}</span>
            </button>
          )}

          {selectedIds.length > 0 && (
            <button 
              onClick={() => handleDeleteRequest(null, null, true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all border border-rose-200/80 shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('Delete Selected', 'លុប')} ({selectedIds.length})</span>
            </button>
          )}

          <Link 
            href="/admin/projects/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0050C3] hover:bg-[#0040A0] text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('New Project', 'បង្កើតគម្រោងថ្មី')}</span>
          </Link>
        </div>
      </motion.div>

      {/* Homepage Section Visibility Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
            showProjectsSection ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {showProjectsSection ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {t('Homepage Projects Section Visibility', 'ការបង្ហាញផ្នែកគម្រោងលើទំព័រដើម')}
              </h2>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                showProjectsSection 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${showProjectsSection ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {showProjectsSection ? t('LIVE ON HOMEPAGE', 'កំពុងបង្ហាញលើទំព័រដើម') : t('HIDDEN FROM HOMEPAGE', 'បានលាក់ពីទំព័រដើម')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {showProjectsSection 
                ? t('The Recent Projects showcase is currently visible to visitors on the landing page.', 'ផ្នែកស្នាដៃគម្រោងកំពុងត្រូវបានបង្ហាញដល់ភ្ញៀវនៅលើទំព័រដើម។')
                : t('The Recent Projects showcase is temporarily hidden from the landing page.', 'ផ្នែកស្នាដៃគម្រោងត្រូវបានលាក់ជាបណ្តោះអាសន្នពីទំព័រដើម។')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleSectionVisibility}
          disabled={isTogglingVisibility}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
            showProjectsSection
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200/80'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80'
          }`}
        >
          {isTogglingVisibility ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : showProjectsSection ? (
            <EyeOff className="w-4 h-4 text-amber-600" />
          ) : (
            <Eye className="w-4 h-4 text-emerald-600" />
          )}
          <span>
            {showProjectsSection 
              ? t('Hide Section on Homepage', 'លាក់ផ្នែកនេះពីទំព័រដើម') 
              : t('Show Section on Homepage', 'បង្ហាញផ្នែកនេះលើទំព័រដើម')}
          </span>
        </button>
      </motion.div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {t('Total Projects', 'គម្រោងសរុប')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {projects.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500">showcases</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            {t('Live / Visible', 'បង្ហាញជាសាធារណៈ')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">
              {liveProjectsCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {projects.length ? Math.round((liveProjectsCount / projects.length) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
            {t('Hidden / Draft', 'លាក់មិនបង្ហាញ')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-amber-600 tabular-nums">
              {hiddenProjectsCount}
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {hiddenProjectsCount > 0 ? t('Private', 'ឯកជន') : t('None', 'គ្មាន')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0050C3] block mb-1">
            {t('Categories', 'ប្រភេទគម្រោង')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-[#0050C3] tabular-nums">
              {categories.length > 1 ? categories.length - 1 : 0}
            </span>
            <span className="text-[10px] font-bold text-slate-500">distinct</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-200/60 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-white text-[#0050C3] shadow-2xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('All', 'ទាំងអស់')} ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('LIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'LIVE'
                ? 'bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200/80'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            {t('Live Only', 'បង្ហាញ')} ({liveProjectsCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('HIDDEN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'HIDDEN'
                ? 'bg-amber-50 text-amber-700 shadow-2xs border border-amber-200/80'
                : 'text-slate-500 hover:text-amber-600'
            }`}
          >
            {t('Hidden Only', 'លាក់')} ({hiddenProjectsCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={t('Search by title, category, description...', 'ស្វែងរកតាមចំណងជើង ប្រភេទ...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Select All Bar (if filtered items exist) */}
      {filteredProjects.length > 0 && (
        <div className="px-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex items-center gap-2 hover:text-[#0050C3] transition-colors cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
              selectedIds.length === filteredProjects.length && filteredProjects.length > 0
                ? 'bg-[#0050C3] border-[#0050C3] text-white'
                : 'border-slate-300 bg-white'
            }`}>
              {selectedIds.length === filteredProjects.length && filteredProjects.length > 0 && (
                <Check className="w-3 h-3 stroke-[3]" />
              )}
            </div>
            <span>
              {selectedIds.length === filteredProjects.length
                ? t('Deselect All', 'ដកការជ្រើសរើសទាំងអស់')
                : t('Select All', 'ជ្រើសរើសទាំងអស់')}
            </span>
          </button>

          <span className="text-[11px] text-slate-400 font-medium">
            {t('Tip: Drag items to reorder showcase sequence on website', 'គន្លឹះ៖ អូសដើម្បីតម្រៀបលំដាប់គម្រោងនៅលើគេហទំព័រ')}
          </span>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-blue-100 border-t-[#0050C3] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {t('Loading Showcase Projects...', 'កំពុងដំណើរការទិន្នន័យគម្រោង...')}
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            {t('No Projects Found', 'រកមិនឃើញគម្រោង')}
          </h3>
          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto mb-4">
            {search 
              ? t('Try adjusting your search criteria or filter tabs.', 'សូមព្យាយាមស្វែងរកពាក្យគន្លឹះផ្សេងទៀត។')
              : t('Start by adding your first showcase project to impress visitors.', 'ចាប់ផ្តើមបន្ថែមស្នាដៃគម្រោងដំបូងរបស់អ្នក។')}
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0050C3] hover:bg-[#0040A0] text-white rounded-xl font-bold text-xs shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Add New Project', 'បន្ថែមគម្រោងថ្មី')}</span>
          </Link>
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={projects} 
          onReorder={handleReorder}
          className="space-y-2.5"
        >
          {filteredProjects.map((project) => {
            const isLive = project.isActive !== false;
            const isSelected = selectedIds.includes(project.id);
            const isToggling = togglingProjectId === project.id;
            const projectIndex = projects.findIndex(p => p.id === project.id) + 1;

            return (
              <Reorder.Item 
                key={project.id}
                value={project}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group bg-white border rounded-2xl p-3.5 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-3 relative cursor-grab active:cursor-grabbing ${
                  isSelected ? 'border-[#0050C3] bg-blue-50/20' : 'border-slate-200/80 hover:border-[#0050C3]/40'
                }`}
              >
                {/* Left Side: Drag + Checkbox + Thumbnail + Details */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Drag Handle */}
                  <div className="text-slate-300 group-hover:text-[#0050C3] transition-colors shrink-0">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleSelection(project.id); }}
                    className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0050C3] border-[#0050C3] text-white' 
                        : 'border-slate-300 hover:border-[#0050C3] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 relative group/thumb">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">
                        IMG
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                        {project.title}
                      </h3>

                      {/* Category Pill */}
                      {project.category && (
                        <span className="text-[10px] font-bold text-[#0050C3] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                          {project.category}
                        </span>
                      )}

                      {/* Visibility Status Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        isLive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {isLive ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                      </span>

                      {/* Order Tag */}
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        #{projectIndex}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-500 leading-snug truncate max-w-xl">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right Side: External Link + Visibility Toggle + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* External Project Link */}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-[#0050C3] transition-colors px-2 py-1 rounded-lg hover:bg-blue-50/50"
                      title={t('Open Live Project', 'បើកគម្រោងផ្ទាល់')}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{t('Live Demo', 'តំណភ្ជាប់')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Individual Visibility Hide/Show Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleProjectActive(project.id, isLive);
                    }}
                    disabled={isToggling}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
                      isLive 
                        ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80' 
                        : 'bg-amber-50/80 text-amber-700 border-amber-200/80 hover:bg-amber-100/80'
                    }`}
                    title={isLive ? t('Hide from public portfolio', 'លាក់ពីគេហទំព័រសាធារណៈ') : t('Make visible on public portfolio', 'បង្ហាញលើគេហទំព័រសាធារណៈ')}
                  >
                    {isToggling ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isLive ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span className="hidden md:inline">
                      {isLive ? t('Visible', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                    </span>
                  </button>

                  <div className="w-px h-5 bg-slate-200/80 hidden sm:block" />

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-1">
                    <Link 
                      href={`/admin/projects/edit/${project.id}`} 
                      className="p-2 text-slate-500 hover:text-[#0050C3] hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                      title={t('Edit Project', 'កែសម្រួល')}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(project.id, project.title);
                      }} 
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title={t('Delete Project', 'លុប')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* Modals */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={itemToDelete?.isBulk ? t('Bulk Delete Projects', 'លុបគម្រោងជាក្រុម') : t('Delete Project', 'លុបគម្រោង')}
        itemName={itemToDelete?.isBulk ? `${selectedIds.length} projects` : itemToDelete?.title}
        loading={isDeleting}
      />

      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        type={resultType}
        message={resultMessage}
      />
    </div>
  );
}
