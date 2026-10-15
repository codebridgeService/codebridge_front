'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { teamService } from '@/store/teamService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import {
  Users,
  Plus,
  Search,
  Trash2,
  Edit3,
  GripVertical,
  Eye,
  EyeOff,
  UploadCloud,
  Check,
  RotateCw,
  ExternalLink,
  Briefcase,
  Globe,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ImportModal from '../components/modals/ImportModal';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';

export default function TeamManagementPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamSection, setShowTeamSection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingMemberId, setTogglingMemberId] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'HIDDEN'
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [importMode, setImportMode] = useState('file');

  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Result State
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState('success');
  const [resultMessage, setResultMessage] = useState('');

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchMembers();
    siteSettingService
      .getSettings()
      .then((settings) => {
        if (settings) setShowTeamSection(settings.showTeam !== false);
      })
      .catch((err) => console.error('Failed to fetch settings for team section:', err));
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeamMembers();
      setMembers(data || []);
      setHasUnsavedOrder(false);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoading(false);
    }
  };

  // Unique roles for filter tabs
  const availableRoles = useMemo(() => {
    const roles = members.map((m) => m.role?.trim()).filter(Boolean);
    return ['ALL', ...Array.from(new Set(roles))];
  }, [members]);

  const activeMembersCount = useMemo(
    () => members.filter((m) => m.isActive !== false).length,
    [members]
  );
  const hiddenMembersCount = useMemo(
    () => members.filter((m) => m.isActive === false).length,
    [members]
  );

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        search === '' ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.kh_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.role?.toLowerCase().includes(search.toLowerCase()) ||
        m.kh_role?.toLowerCase().includes(search.toLowerCase()) ||
        m.bio?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || m.role?.trim() === roleFilter;

      const isMemberActive = m.isActive !== false;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isMemberActive) ||
        (statusFilter === 'HIDDEN' && !isMemberActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map((m) => m.id));
    }
  };

  // Toggle individual member's active/hidden visibility
  const handleToggleMemberActive = async (id, currentStatus) => {
    setTogglingMemberId(id);
    const newStatus = !currentStatus;
    // Optimistic update
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: newStatus } : m))
    );

    try {
      const formData = new FormData();
      formData.append('isActive', newStatus.toString());
      await teamService.updateTeamMember(id, formData);
      setResultMessage(
        newStatus
          ? t('Team member is now visible on the public website!', 'សមាជិកត្រូវបានបង្ហាញលើគេហទំព័រសាធារណៈហើយ!')
          : t('Team member is now hidden from the public website.', 'សមាជិកត្រូវបានលាក់ពីគេហទំព័រសាធារណៈហើយ។')
      );
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      // Revert optimistic update
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive: currentStatus } : m))
      );
      setResultMessage(err.message || 'Failed to update member visibility');
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setTogglingMemberId(null);
    }
  };

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newStatus = !showTeamSection;
      await siteSettingService.updateSettings({ showTeam: newStatus });
      setShowTeamSection(newStatus);
      setResultMessage(
        newStatus
          ? t('The Our Team section is now live on the public website!', 'ផ្នែកក្រុមការងារត្រូវបានបង្ហាញជាសាធារណៈហើយ!')
          : t('The Our Team section has been hidden from the public website.', 'ផ្នែកក្រុមការងារត្រូវបានលាក់ពីគេហទំព័រសាធារណៈហើយ។')
      );
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message || 'Failed to update visibility');
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleReorder = (newOrder) => {
    setMembers(newOrder);
    setHasUnsavedOrder(true);
  };

  const saveNewOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orders = members.map((m, index) => ({
        id: m.id,
        order: index
      }));
      await teamService.reorderTeamMembers(orders);
      setResultMessage(t('Team display order saved successfully!', 'លំដាប់ក្រុមត្រូវបានរក្សាទុកដោយជោគជ័យ!'));
      setResultType('success');
      setShowResultModal(true);
      setHasUnsavedOrder(false);
    } catch (err) {
      setResultMessage(err.message || 'Failed to save order');
      setResultType('error');
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
        await Promise.all(selectedIds.map((id) => teamService.deleteTeamMember(id)));
        setMembers((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        setSelectedIds([]);
        setResultMessage(t(`Successfully deleted ${selectedIds.length} members!`, `បានលុបសមាជិកចំនួន ${selectedIds.length} ដោយជោគជ័យ!`));
      } else {
        await teamService.deleteTeamMember(itemToDelete.id);
        setMembers((prev) => prev.filter((m) => m.id !== itemToDelete.id));
        setResultMessage(t(`Successfully deleted ${itemToDelete.title}!`, `បានលុប ${itemToDelete.title} ដោយជោគជ័យ!`));
      }
      setResultType('success');
      setShowResultModal(true);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setResultMessage(err.message || 'Failed to delete member');
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // Excel / Sheets Import helpers
  const processImportData = (wb) => {
    try {
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const rowsList = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(10, rowsList.length); i++) {
        const rowArr = rowsList[i] || [];
        const hasDataTokens = rowArr.some(
          (c) =>
            typeof c === 'string' &&
            (c.toLowerCase().trim().includes('name') || c.toLowerCase().trim().includes('role'))
        );
        if (hasDataTokens) {
          headerRowIndex = i;
          break;
        }
      }
      const data = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex });
      const getMappedValue = (row, possibleKeys, possibleSubstrings = []) => {
        for (const key of Object.keys(row)) {
          const normalizedKey = key.trim().toLowerCase();
          if (possibleKeys.includes(normalizedKey)) return row[key];
          if (possibleSubstrings.some((sub) => normalizedKey.includes(sub))) return row[key];
        }
        return '';
      };
      const mappedData = data.map((row) => {
        const nameStr = String(getMappedValue(row, ['name']) || '').trim();
        const existing = members.find(
          (m) => m.name && nameStr !== '' && String(m.name).trim().toLowerCase() === nameStr.toLowerCase()
        );
        return {
          _rawObj: row,
          name: nameStr,
          kh_name: getMappedValue(row, ['kh_name', 'kh name']),
          role: getMappedValue(row, ['role']),
          kh_role: getMappedValue(row, ['kh_role', 'kh role']),
          bio: getMappedValue(row, ['bio']),
          kh_bio: getMappedValue(row, ['kh_bio', 'kh bio']),
          image: getMappedValue(row, ['image', 'image_url', 'profile']),
          portfolio_link: getMappedValue(row, ['portfolio_link'], ['portfolio', 'link', 'url']),
          order: getMappedValue(row, ['order']) || 0,
          isActive: true,
          isDuplicate: !!existing
        };
      });
      setParsedData(mappedData);
    } catch (err) {
      alert(t(`Failed to parse data: ${err.message}`, `ការវិភាគទិន្នន័យបានបរាជ័យ: ${err.message}`));
    }
  };

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        processImportData(wb);
      } catch (err) {
        alert(t('Failed to parse Excel file.', 'ការវិភាគឯកសារ Excel បានបរាជ័យ។'));
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls'))
    ) {
      processFile(file);
    } else {
      alert(t('Please upload a valid Excel file (.xlsx or .xls)', 'សូមបញ្ចូលឯកសារ Excel ដែលត្រឹមត្រូវ (.xlsx ឬ .xls)'));
    }
  };

  const handleSheetImport = async () => {
    const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!sheetId) return alert(t('Invalid URL', 'តំណភ្ជាប់មិនត្រឹមត្រូវ'));
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`);
      if (!res.ok) throw new Error('Failed to fetch');
      const text = await res.text();
      const wb = XLSX.read(text, { type: 'string' });
      processImportData(wb);
    } catch (err) {
      alert(t('Failed to fetch Google Sheet.', 'មិនអាចទាញយកបានទេ។'));
    } finally {
      setLoading(false);
    }
  };

  const confirmImport = async () => {
    if (!parsedData || parsedData.length === 0) return;
    setLoading(true);
    let successCount = 0;
    for (const row of parsedData) {
      if (row.isDuplicate) continue;
      try {
        const formData = new FormData();
        Object.keys(row).forEach((key) => {
          if (key === 'isDuplicate' || key === '_rawObj') return;
          if (row[key]) formData.append(key, row[key]);
        });
        await teamService.createTeamMember(formData);
        successCount++;
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
    setIsImportModalOpen(false);
    fetchMembers();
    setResultMessage(t(`Import completed! Successfully imported ${successCount} members.`, `ការនាំចូលបានជោគជ័យចំនួន ${successCount} នាក់។`));
    setResultType('success');
    setShowResultModal(true);
    setParsedData(null);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header Toolbar (Compact) */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050C3] to-[#0088FE] flex items-center justify-center text-white shadow-2xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                {t('Team Management', 'គ្រប់គ្រងក្រុមការងារ')}
              </h1>
              <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-50 text-gradient-brand border border-blue-200/60">
                {members.length} {t('Members', 'សមាជិក')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {t(
                'Organize executive roster, toggle member visibility, and set display order',
                'គ្រប់គ្រងសមាជិកក្រុម កំណត់ការបង្ហាញ និងរៀបចំលំដាប់'
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {hasUnsavedOrder && (
            <button
              onClick={saveNewOrder}
              disabled={isSavingOrder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-2xs transition-all animate-pulse"
              title="Click to save drag-and-drop order adjustments"
            >
              {isSavingOrder ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{t('Save Order', 'រក្សាទុកលំដាប់')}</span>
            </button>
          )}

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Import', 'នាំចូល')}</span>
          </button>

          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0050C3] to-[#0088FE] hover:opacity-95 shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('Add Member', 'បន្ថែមសមាជិក')}</span>
          </Link>
        </div>
      </motion.div>

      {/* 2. Overview Telemetry Cards (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Public Section Card */}
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
            showTeamSection
              ? 'bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 border-emerald-200/80'
              : 'bg-gradient-to-br from-amber-50/70 to-amber-100/40 border-amber-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                showTeamSection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {showTeamSection ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('Entire Section', 'ផ្នែកទូទៅ')}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    showTeamSection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {showTeamSection ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {showTeamSection
                  ? t('Section live on public site', 'បង្ហាញលើវេបសាយ')
                  : t('Section hidden from public', 'លាក់ពីវេបសាយ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVisibility}
            disabled={isTogglingVisibility}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isTogglingVisibility ? (
              <RotateCw className="w-3 h-3 animate-spin" />
            ) : showTeamSection ? (
              t('Hide All', 'លាក់ទាំងអស់')
            ) : (
              t('Show All', 'បង្ហាញទាំងអស់')
            )}
          </button>
        </div>

        {/* Member Visibility Breakdown Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0050C3] border border-blue-200/60 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('Member Visibility', 'ការបង្ហាញសមាជិក')}
              </span>
              <p className="text-xs font-bold text-slate-900">
                <span className="text-emerald-600 font-extrabold">{activeMembersCount} {t('Live', 'បង្ហាញ')}</span>
                <span className="text-slate-300 mx-1.5">•</span>
                <span className="text-amber-600 font-extrabold">{hiddenMembersCount} {t('Hidden', 'លាក់')}</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {members.length} {t('Total', 'សរុប')}
          </span>
        </div>

        {/* Reorder Status Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('Display Sequence', 'លំដាប់តម្រៀប')}
              </span>
              <p className="text-xs font-bold text-slate-900">
                {hasUnsavedOrder ? (
                  <span className="text-amber-600 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t('Unsaved Order', 'មិនទាន់រក្សាទុក')}
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('Saved', 'បានរក្សាទុករួច')}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={saveNewOrder}
            disabled={!hasUnsavedOrder || isSavingOrder}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
              hasUnsavedOrder
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            {isSavingOrder ? t('Saving...', 'រក្សាទុក...') : t('Save', 'រក្សាទុក')}
          </button>
        </div>
      </div>

      {/* 3. Controls & Filter Bar (Compact) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('Search by name, role, bio...', 'ស្វែងរកតាមឈ្មោះ តួនាទី...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:border-[#0050C3] transition-all font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Visibility Status Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/60 self-start md:self-auto">
            {[
              { id: 'ALL', label: t('All', 'ទាំងអស់'), count: members.length },
              { id: 'ACTIVE', label: t('Live', 'បង្ហាញ'), count: activeMembersCount },
              { id: 'HIDDEN', label: t('Hidden', 'លាក់'), count: hiddenMembersCount }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 rounded-full font-mono ${
                  statusFilter === tab.id ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={t('List & Order View', 'ទម្រង់តារាង')}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{t('List', 'បញ្ជី')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={t('Cards View', 'ទម្រង់កាត')}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{t('Cards', 'កាត')}</span>
            </button>
          </div>
        </div>

        {/* Role Filters */}
        {availableRoles.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              {t('Role:', 'តួនាទី៖')}
            </span>
            {availableRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all shrink-0 cursor-pointer ${
                  roleFilter === role
                    ? 'bg-[#0050C3] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {role === 'ALL' ? t('All Roles', 'ទាំងអស់') : role}
              </button>
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-xs">
                {selectedIds.length} {t('selected', 'បានជ្រើស')}
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[#0050C3] hover:underline"
              >
                {selectedIds.length === filteredMembers.length
                  ? t('Deselect All', 'ដោះការជ្រើស')
                  : t('Select All', 'ជ្រើសទាំងអស់')}
              </button>
            </div>

            <button
              onClick={() => handleDeleteRequest(null, null, true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                {t('Delete Selected', 'លុបដែលបានជ្រើស')} ({selectedIds.length})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Display Member Content */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs">
          <RotateCw className="w-5 h-5 text-[#0050C3] animate-spin mx-auto mb-2" />
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
            {t('Loading Team Roster...', 'កំពុងផ្ទុកសមាជិកក្រុម...')}
          </p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">
            {search || roleFilter !== 'ALL' || statusFilter !== 'ALL'
              ? t('No members match your filter criteria', 'មិនមានសមាជិកត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ')
              : t('No team members added yet', 'មិនទាន់មានសមាជិកក្រុមនៅឡើយទេ')}
          </h3>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            {search || roleFilter !== 'ALL' || statusFilter !== 'ALL'
              ? t('Try adjusting your search query or clear the active filters.', 'សូមសាកល្បងកែប្រែពាក្យស្វែងរក ឬសម្អាតតម្រង។')
              : t('Start showcasing your team by creating a member profile.', 'ចាប់ផ្តើមបន្ថែមសមាជិកក្រុមរបស់អ្នកដើម្បីបង្ហាញលើគេហទំព័រ។')}
          </p>
          {(search || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>{t('Clear Filters', 'សម្អាតតម្រង')}</span>
            </button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        /* Reorderable List View (Compact) */
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className="w-5 text-center">#</span>
              <span>{t('Member Profile', 'ព័ត៌មានសមាជិក')}</span>
            </div>
            <div className="flex items-center gap-8 pr-2">
              <span className="hidden md:inline">{t('Visibility & Role', 'ការបង្ហាញ & តួនាទី')}</span>
              <span>{t('Actions', 'សកម្មភាព')}</span>
            </div>
          </div>

          <Reorder.Group
            axis="y"
            values={members}
            onReorder={handleReorder}
            className="divide-y divide-slate-100"
          >
            {filteredMembers.map((member) => {
              const globalIndex = members.findIndex((m) => m.id === member.id);
              const isSelected = selectedIds.includes(member.id);
              const isMemberActive = member.isActive !== false;
              const isToggling = togglingMemberId === member.id;

              return (
                <Reorder.Item
                  key={member.id}
                  value={member}
                  className={`group px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3 transition-colors hover:bg-slate-50/80 ${
                    isSelected ? 'bg-blue-50/40' : !isMemberActive ? 'bg-slate-50/50 opacity-75' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-600 transition-colors p-0.5"
                      title={t('Drag to reorder sequence', 'អូសដើម្បីផ្លាស់ប្តូរលំដាប់')}
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>

                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(member.id);
                      }}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0050C3] border-[#0050C3] text-white shadow-2xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    {/* Order Badge */}
                    <span className="w-5 text-center font-mono font-bold text-[11px] text-slate-400 shrink-0">
                      #{String(globalIndex + 1).padStart(2, '0')}
                    </span>

                    {/* Avatar */}
                    {member.image ? (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0 shadow-2xs">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0050C3] to-[#0088FE] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}

                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {member.name}
                        </h4>
                        {member.kh_name && (
                          <span className="text-[11px] font-medium text-slate-500 font-battambang">
                            ({member.kh_name})
                          </span>
                        )}
                        {!isMemberActive && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase">
                            {t('Hidden', 'បានលាក់')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-block md:hidden px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-gradient-brand border border-blue-200/60">
                          {member.role || 'Member'}
                        </span>
                        <p className="text-[10px] text-slate-500 font-normal truncate max-w-sm">
                          {member.bio ? `"${member.bio}"` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right side info & Actions */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    {/* Role badge */}
                    <div className="hidden md:flex flex-col items-end min-w-[110px]">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-gradient-brand border border-blue-200/60 uppercase tracking-wider">
                        {member.role || 'Team Member'}
                      </span>
                      {member.portfolio_link && (
                        <a
                          href={member.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-slate-500 hover:text-[#0050C3] flex items-center gap-0.5 mt-0.5 font-medium transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Link</span>
                        </a>
                      )}
                    </div>

                    {/* Visibility Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleMemberActive(member.id, isMemberActive)}
                      disabled={isToggling}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        isMemberActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                      title={isMemberActive ? t('Click to hide from public site', 'ចុចដើម្បីលាក់ពីវេបសាយ') : t('Click to show on public site', 'ចុចដើម្បីបង្ហាញលើវេបសាយ')}
                    >
                      {isToggling ? (
                        <RotateCw className="w-3 h-3 animate-spin" />
                      ) : isMemberActive ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>{t('Live', 'បង្ហាញ')}</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-amber-600" />
                          <span>{t('Hidden', 'លាក់')}</span>
                        </>
                      )}
                    </button>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 border-l border-slate-100 pl-2 sm:pl-3">
                      <Link
                        href={`/admin/team/new?id=${member.id}`}
                        className="p-1.5 text-slate-500 hover:text-[#0050C3] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200/60"
                        title={t('Edit Member Profile', 'កែសម្រួល')}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(member.id, member.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                        title={t('Delete Member', 'លុបសមាជិក')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      ) : (
        /* Visual Cards Grid View (Compact) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredMembers.map((member) => {
            const globalIndex = members.findIndex((m) => m.id === member.id);
            const isSelected = selectedIds.includes(member.id);
            const isMemberActive = member.isActive !== false;
            const isToggling = togglingMemberId === member.id;

            return (
              <div
                key={member.id}
                className={`group bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-[#0050C3] ring-1 ring-[#0050C3]/20'
                    : !isMemberActive
                    ? 'border-slate-200/70 bg-slate-50/50 opacity-80'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar with Checkbox, Order Badge, and Visibility Toggle */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => toggleSelection(member.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0050C3] border-[#0050C3] text-white shadow-2xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleMemberActive(member.id, isMemberActive)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                          isMemberActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                        title={isMemberActive ? t('Hide from public site', 'លាក់ពីគេហទំព័រ') : t('Show on public site', 'បង្ហាញលើគេហទំព័រ')}
                      >
                        {isToggling ? (
                          <RotateCw className="w-2.5 h-2.5 animate-spin" />
                        ) : isMemberActive ? (
                          <Eye className="w-2.5 h-2.5" />
                        ) : (
                          <EyeOff className="w-2.5 h-2.5" />
                        )}
                        <span>{isMemberActive ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}</span>
                      </button>

                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 border border-slate-200/60">
                        #{String(globalIndex + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Profile Center */}
                  <div className="flex flex-col items-center text-center">
                    {member.image ? (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 group-hover:border-[#0050C3]/30 transition-all shadow-2xs mb-2">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0050C3] to-[#0088FE] text-white font-black text-lg flex items-center justify-center shadow-2xs mb-2">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}

                    <h3 className="font-bold text-slate-900 text-xs tracking-tight leading-snug">
                      {member.name}
                    </h3>
                    {member.kh_name && (
                      <p className="text-[11px] text-slate-500 font-battambang mt-0.5">
                        {member.kh_name}
                      </p>
                    )}

                    <span className="mt-1.5 inline-block px-2.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-50 text-gradient-brand border border-blue-200/60 uppercase tracking-wider">
                      {member.role || 'Member'}
                    </span>

                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed line-clamp-2 mt-1.5 px-0.5">
                      {member.bio ? `"${member.bio}"` : '-'}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {member.portfolio_link ? (
                    <a
                      href={member.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#0050C3] hover:underline flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">Portfolio</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">No link</span>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/team/new?id=${member.id}`}
                      className="p-1 rounded-lg text-slate-500 hover:text-[#0050C3] hover:bg-blue-50 border border-slate-200/60 transition-colors"
                      title={t('Edit Member Profile', 'កែសម្រួល')}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(member.id, member.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 transition-colors cursor-pointer"
                      title={t('Delete Member', 'លុបសមាជិក')}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Modals */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setParsedData(null);
        }}
        title={t('Import Team Members', 'នាំចូលសមាជិកក្រុម')}
        subtitle={t(
          'Upload your Excel spreadsheet or enter Google Sheets link',
          'បញ្ចូលឯកសារ Excel ឬ តំណភ្ជាប់ Google Sheets'
        )}
        dataCount={parsedData?.length || 0}
        importMode={importMode}
        setImportMode={setImportMode}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileInput}
        sheetUrl={sheetUrl}
        setSheetUrl={setSheetUrl}
        onSheetFetch={handleSheetImport}
        isProcessing={loading}
        onConfirm={confirmImport}
        renderTable={() => (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2">{t('Status', 'ស្ថានភាព')}</th>
                <th className="px-4 py-2">{t('Name', 'ឈ្មោះ')}</th>
                <th className="px-4 py-2">{t('Role', 'តួនាទី')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parsedData.map((row, i) => (
                <tr
                  key={i}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    row.isDuplicate ? 'opacity-60 bg-slate-50' : ''
                  }`}
                >
                  <td className="px-4 py-2">
                    {row.isDuplicate ? (
                      <span className="text-amber-600 font-bold text-[10px] uppercase">
                        Skip
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[10px] uppercase">
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-bold text-slate-900">{row.name}</td>
                  <td className="px-4 py-2 text-slate-600">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        itemName={itemToDelete?.title || itemToDelete?.name}
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
