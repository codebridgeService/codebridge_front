'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { projectService } from '../../store/projectService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ComputerDesktopIcon, 
  TrashIcon, 
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckIcon,
  LinkIcon,
  Bars2Icon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [search, setSearch] = useState('');
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      (project.title?.toLowerCase().includes(search.toLowerCase())) || 
      (project.category?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [projects, search]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleReorder = (newOrder) => {
    setProjects(newOrder);
  };

  const saveNewOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orders = projects.map((project, index) => ({
        id: project.id,
        order: index
      }));
      await projectService.reorderProjects(orders);
      setResultMessage(t("Project order saved successfully!", "លំដាប់គម្រោងត្រូវបានរក្សាទុកដោយជោគជ័យ!"));
      setResultType("success");
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message);
      setResultType("error");
      setShowResultModal(true);
    } finally {
      setIsSavingOrder(false);
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
      } else {
        await projectService.deleteProject(itemToDelete.id);
        setProjects(prev => prev.filter(p => p.id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* High-Density Glass Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-40 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center text-white shadow-lg">
            <ComputerDesktopIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('Projects', 'គម្រោង')}</h1>
            <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5">
              {projects.length} {t('Case Studies', 'ស្នាដៃសរុប')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[color:var(--color-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search projects...', 'ស្វែងរក...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-5 py-2.5 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:bg-white transition-all text-xs font-bold w-56"
            />
          </div>

          <button 
            onClick={saveNewOrder}
            disabled={isSavingOrder}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-[color:var(--color-primary)] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm border border-indigo-100 disabled:opacity-50"
          >
            {isSavingOrder ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
            <span>{t('Save Order', 'រក្សាទុកលំដាប់')}</span>
          </button>

          {selectedIds.length > 0 && (
            <button 
              onClick={() => handleDeleteRequest(null, null, true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm border border-red-100"
            >
              <TrashIcon className="w-4 h-4" />
              <span>{t('Delete', 'លុប')} ({selectedIds.length})</span>
            </button>
          )}

          <Link 
            href="/admin/projects/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-[color:var(--color-primary)] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[color:var(--color-primary)]/20 hover:scale-105 transition-all"
          >
            <PlusIcon className="w-4 h-4" strokeWidth={3} />
            <span>{t('New Project', 'គម្រោងថ្មី')}</span>
          </Link>
        </div>
      </motion.div>

      {/* Reorderable List Display */}
      {loading ? (
        <div className="py-24 text-center animate-pulse text-[8px] font-black text-gray-300 uppercase tracking-widest">Compiling Showcase...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white/50 border border-white/40 rounded-[1.5rem] p-12 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
           No Projects Found
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={projects} 
          onReorder={handleReorder}
          className="space-y-2"
        >
          {projects.map((project) => (
            <Reorder.Item 
              key={project.id}
              value={project}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group bg-white/80 backdrop-blur-xl border border-white/60 p-4 pl-5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-[color:var(--color-primary)]/30 transition-all flex items-center justify-between gap-5 relative overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-5 flex-1 min-w-0">
                 {/* Drag Handle */}
                 <div className="text-gray-300 group-hover:text-[color:var(--color-primary)] transition-colors">
                   <Bars2Icon className="w-5 h-5" />
                 </div>

                 <button
                    onClick={(e) => { e.stopPropagation(); toggleSelection(project.id); }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${
                      selectedIds.includes(project.id) 
                        ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white' 
                        : 'border-gray-200 text-transparent hover:border-[color:var(--color-primary)]/50 bg-white shadow-inner'
                    }`}
                 >
                   <CheckIcon className="w-4 h-4" strokeWidth={3} />
                 </button>

                 <div className="w-16 h-16 rounded-[1rem] bg-gray-50 overflow-hidden shrink-0 shadow-inner border border-gray-100">
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-sm font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{project.title}</h3>
                       <span className="text-[9px] font-black text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 px-2 py-0.5 rounded-md uppercase tracking-widest">
                         {project.category}
                       </span>
                       <span className="text-[9px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md uppercase tracking-widest">ORDER: {projects.indexOf(project) + 1}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 leading-snug truncate max-w-lg ">
                      {project.description}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-8 pr-2">
                 <div className="hidden lg:flex items-center gap-4">
                    {project.link && (
                       <a 
                         href={project.link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-[color:var(--color-primary)] transition-colors uppercase tracking-widest"
                       >
                         <LinkIcon className="w-3.5 h-3.5" />
                         {t('Live', 'បន្តផ្ទាល់')}
                       </a>
                    )}
                    <div className="w-[1px] h-4 bg-gray-100 mx-2" />
                    <div className="flex flex-col items-end">
                       <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">PUBLISHED</p>
                       <p className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">
                         {new Date(project.createdAt).toLocaleDateString()}
                       </p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 border-l border-gray-100 pl-6 py-2">
                    <Link 
                      href={`/admin/projects/edit/${project.id}`} 
                      className="p-2.5 text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 hover:bg-[color:var(--color-primary)]/10 rounded-xl transition-all shadow-sm"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleDeleteRequest(project.id, project.title)} 
                      className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm z-10 relative"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </Reorder.Item>
          ))}
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
