'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { packageService } from '@/store/packageService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Edit3,
  Search,
  Package,
  Star,
  Upload,
  Check,
  GripVertical,
  RotateCw,
  Eye,
  EyeOff
} from 'lucide-react';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';
import ImportModal from '../components/modals/ImportModal';

export default function PackageManagementPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, HIDDEN
  
  // Section Visibility State
  const [showPackagesSection, setShowPackagesSection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingPackageId, setTogglingPackageId] = useState(null);

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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
    fetchPackages();
    siteSettingService.getSettings()
      .then(settings => {
        if (settings) {
          setShowPackagesSection(settings.showPackages !== false);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getPackages();
      setPackages(data || []);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const activePackagesCount = useMemo(
    () => packages.filter(p => p.isActive !== false).length,
    [packages]
  );
  const hiddenPackagesCount = useMemo(
    () => packages.filter(p => p.isActive === false).length,
    [packages]
  );

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = 
        (pkg.name?.toLowerCase().includes(search.toLowerCase())) || 
        (pkg.kh_name?.includes(search)) ||
        (pkg.description?.toLowerCase().includes(search.toLowerCase())) ||
        (pkg.price?.toLowerCase().includes(search.toLowerCase()));

      const isPkgActive = pkg.isActive !== false;
      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isPkgActive) ||
        (statusFilter === 'HIDDEN' && !isPkgActive);

      return matchesSearch && matchesStatus;
    });
  }, [packages, search, statusFilter]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newStatus = !showPackagesSection;
      await siteSettingService.updateSettings({ showPackages: newStatus });
      setShowPackagesSection(newStatus);
      setResultMessage(
        newStatus
          ? t('Pricing Packages section is now live on the public website!', 'ផ្នែកកញ្ចប់តម្លៃត្រូវបានបង្ហាញជាសាធារណៈហើយ!')
          : t('Pricing Packages section has been hidden from the public website.', 'ផ្នែកកញ្ចប់តម្លៃត្រូវបានលាក់ពីគេហទំព័រសាធារណៈហើយ។')
      );
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message || 'Failed to update section visibility');
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleTogglePackageActive = async (id, currentStatus) => {
    setTogglingPackageId(id);
    const newStatus = !currentStatus;
    // Optimistic update
    setPackages(prev => prev.map(p => p.id === id ? { ...p, isActive: newStatus } : p));

    try {
      await packageService.updatePackage(id, { isActive: newStatus });
      setResultMessage(
        newStatus
          ? t('Package is now live on the pricing table!', 'កញ្ចប់ត្រូវបានបង្ហាញលើតារាងតម្លៃហើយ!')
          : t('Package is now hidden from the pricing table.', 'កញ្ចប់ត្រូវបានលាក់ពីតារាងតម្លៃហើយ។')
      );
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      // Revert optimistic update
      setPackages(prev => prev.map(p => p.id === id ? { ...p, isActive: currentStatus } : p));
      setResultMessage(err.message || 'Failed to update package visibility');
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setTogglingPackageId(null);
    }
  };

  const handleReorder = (newOrder) => {
    setPackages(newOrder);
  };

  const saveNewOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orders = packages.map((pkg, index) => ({
        id: pkg.id,
        order: index
      }));
      await packageService.reorderPackages(orders);
      setResultMessage(t('Order saved successfully!', 'លំដាប់ត្រូវបានរក្សាទុកដោយជោគជ័យ!'));
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message);
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
        await Promise.all(selectedIds.map(id => packageService.deletePackage(id)));
        setPackages(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
      } else {
        await packageService.deletePackage(itemToDelete.id);
        setPackages(prev => prev.filter(p => p.id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      setResultMessage(t('Package(s) deleted successfully!', 'កញ្ចប់ត្រូវបានលុបដោយជោគជ័យ!'));
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      setResultMessage(err.message);
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const processImportData = (wb) => {
    try {
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const fullData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(15, fullData.length); i++) {
        const row = fullData[i] || [];
        const rowValues = row.map(v => String(v).toLowerCase().trim());
        const matches = rowValues.filter(v => 
          v === 'name' || v === 'kh_name' || v === 'price' || v === 'description' || v === 'kh_description' || v === 'features' || v === 'kh_features'
        );
        if (matches.length >= 2) {
          headerRowIndex = i;
          break;
        }
      }
      const data = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex });
      const getMappedValue = (row, key) => {
        for (const rk of Object.keys(row)) {
          if (rk.trim().toLowerCase() === key.toLowerCase()) return row[rk];
        }
        return '';
      };
      const mappedData = data.map((row) => {
        const nameStr = String(getMappedValue(row, 'name') || '').trim();
        if (!nameStr) return null;
        const priceVal = String(getMappedValue(row, 'price') || '$0');
        const featuresStr = String(getMappedValue(row, 'features') || '');
        const featuresArr = featuresStr ? featuresStr.split('\n').map(f => f.trim()).filter(f => f) : [];
        return {
          _rawObj: row,
          name: nameStr,
          kh_name: String(getMappedValue(row, 'kh_name') || nameStr).trim(),
          price: priceVal,
          description: String(getMappedValue(row, 'description') || ''),
          kh_description: String(getMappedValue(row, 'kh_description') || ''),
          features: featuresArr,
          kh_features: String(getMappedValue(row, 'kh_features') || '').split('\n').map(f => f.trim()).filter(f => f),
          isActive: true,
          isDuplicate: packages.some(p => p.name?.trim().toLowerCase() === nameStr.toLowerCase())
        };
      }).filter(item => item !== null);
      setParsedData(mappedData);
    } catch (err) {
      alert(t('Error parsing data.', 'មានបញ្ហាក្នុងការអានទិន្នន័យ។'));
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
        alert(t('Error parsing Excel file.', 'មានបញ្ហាក្នុងការអានឯកសារ Excel។'));
      }
    };
    reader.readAsBinaryString(file);
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
    if (file && (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls'))) {
      processFile(file);
    } else {
      alert(t('Please upload a valid Excel file (.xlsx or .xls)', 'សូមបញ្ចូលឯកសារ Excel ដែលត្រឹមត្រូវ (.xlsx ឬ .xls)'));
    }
  };

  const handleSheetImport = async () => {
    const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!sheetId) return alert(t('Invalid Google Sheets URL', 'តំណភ្ជាប់មិនត្រឹមត្រូវ'));
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`);
      if (!res.ok) throw new Error('Failed to fetch');
      const text = await res.text();
      const wb = XLSX.read(text, { type: 'string' });
      processImportData(wb);
    } catch (err) {
      alert(t('Failed to fetch Google Sheet.', 'មិនអាចទាញយក Google Sheet បានទេ។'));
    } finally {
      setLoading(false);
    }
  };

  const confirmImport = async () => {
    setLoading(true);
    let successCount = 0;
    for (const pkgData of parsedData) {
      if (pkgData.isDuplicate) continue;
      try {
        const payload = { ...pkgData };
        delete payload.isDuplicate;
        delete payload._rawObj;
        await packageService.createPackage(payload);
        successCount++;
      } catch (err) { console.error(err); }
    }
    setLoading(false);
    setIsImportModalOpen(false);
    fetchPackages();
    setResultMessage(t(`Import complete! Success: ${successCount}`, `ការនាំចូលបញ្ជប់! ជោគជ័យ: ${successCount}`));
    setResultType(successCount > 0 ? 'success' : 'info');
    setShowResultModal(true);
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
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('Pricing Packages', 'គ្រប់គ្រងកញ្ចប់តម្លៃ')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {packages.length} {t('Total Packages', 'កញ្ចប់សរុប')} • {activePackagesCount} {t('Live', 'ផ្សាយ')} • {hiddenPackagesCount} {t('Hidden', 'លាក់')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search packages...', 'ស្វែងរកកញ្ចប់...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-44 sm:w-52"
            />
          </div>

          <button 
            type="button"
            onClick={saveNewOrder}
            disabled={isSavingOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0050C3] rounded-xl font-bold text-xs hover:bg-blue-100 transition-all shadow-2xs border border-blue-100 disabled:opacity-50 cursor-pointer"
          >
            {isSavingOrder ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>{t('Save Order', 'រក្សាទុកលំដាប់')}</span>
          </button>

          {selectedIds.length > 0 && (
            <button 
              type="button"
              onClick={() => handleDeleteRequest(null, null, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all shadow-2xs border border-rose-100 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('Delete', 'លុប')} ({selectedIds.length})</span>
            </button>
          )}

          <button 
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:text-[#0050C3] hover:border-[#0050C3]/30 transition-all shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('Import', 'នាំចូល')}</span>
          </button>

          <Link 
            href="/admin/packages/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#0050C3] to-[#0088FE] text-white rounded-xl font-bold text-xs shadow-xs hover:brightness-105 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('Add New', 'បន្ថែមថ្មី')}
          </Link>
        </div>
      </motion.div>

      {/* 2. Section Visibility & Visibility Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Homepage Section Visibility Banner */}
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
            showPackagesSection
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                showPackagesSection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {showPackagesSection ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('Homepage Packages Section', 'ផ្នែកកញ្ចប់តម្លៃលើទំព័រដើម')}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    showPackagesSection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {showPackagesSection ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {showPackagesSection
                  ? t('Section is currently visible to all visitors', 'ផ្នែកនេះកំពុងបង្ហាញជាសាធារណៈដល់អ្នកទស្សនា')
                  : t('Section is hidden from the public website', 'ផ្នែកនេះត្រូវបានលាក់ពីគេហទំព័រសាធារណៈ')}
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
            ) : showPackagesSection ? (
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
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('Package Visibility Breakdown', 'ស្ថានភាពកញ្ចប់')}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold">
                <span className="text-emerald-700 font-bold">{activePackagesCount} {t('Live', 'ផ្សាយ')}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold">{hiddenPackagesCount} {t('Hidden', 'លាក់')}</span>
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
              {t('All', 'ទាំងអស់')} ({packages.length})
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
              {t('Live', 'ផ្សាយ')} ({activePackagesCount})
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
              {t('Hidden', 'លាក់')} ({hiddenPackagesCount})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Reorderable Packages List Display */}
      {loading ? (
        <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Loading Packages...', 'កំពុងទាញយកទិន្នន័យកញ្ចប់...')}
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs font-bold text-slate-400 shadow-2xs">
          {t('No packages found matching your criteria', 'រកមិនឃើញកញ្ចប់តម្លៃដែលត្រូវគ្នានោះទេ')}
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={packages} 
          onReorder={handleReorder}
          className="space-y-2.5"
        >
          {filteredPackages.map((pkg) => {
            const isPkgActive = pkg.isActive !== false;
            return (
              <Reorder.Item 
                key={pkg.id} 
                value={pkg}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group bg-white border p-3 pl-3 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 relative overflow-hidden cursor-grab active:cursor-grabbing ${
                  isPkgActive
                    ? 'border-slate-200/80 hover:border-[#0050C3]/30'
                    : 'border-slate-200 bg-slate-50/60 opacity-80'
                }`}
              >
                {pkg.recommend && (
                  <div className="absolute top-0 right-0 w-14 h-14 pointer-events-none overflow-hidden">
                    <div className="absolute top-1.5 -right-6 px-6 py-0.5 bg-amber-400 rotate-45 text-[7px] font-black uppercase text-white shadow-xs">
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Drag Handle */}
                  <div className="p-1 text-slate-300 group-hover:text-slate-600 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Multi-select Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleSelection(pkg.id); }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors cursor-pointer ${
                      selectedIds.includes(pkg.id) 
                        ? 'bg-[#0050C3] border-[#0050C3] text-white' 
                        : 'border-slate-300 text-transparent hover:border-[#0050C3]/50 bg-white'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  {/* Icon Card */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0050C3] group-hover:bg-[#0050C3] group-hover:text-white transition-all shrink-0 border border-slate-100">
                    {pkg.recommend ? <Star className="w-5 h-5 fill-current" /> : <Package className="w-5 h-5" />}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0050C3] transition-colors truncate">
                        {t(pkg.name, pkg.kh_name)}
                      </h3>
                      
                      {/* Active/Hidden Status Pill */}
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isPkgActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}>
                        {isPkgActive ? t('Live', 'ផ្សាយ') : t('Hidden', 'លាក់')}
                      </span>

                      <span className="text-[9px] font-mono font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">
                        #{packages.indexOf(pkg) + 1}
                      </span>
                    </div>

                    <p className="text-xs font-normal text-slate-500 truncate max-w-xl">
                      {t(pkg.description, pkg.kh_description)}
                    </p>
                  </div>
                </div>

                {/* Right Actions & Pricing */}
                <div className="flex items-center gap-3 pr-1">
                  <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PRICE</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{pkg.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 py-1">
                    {/* Instant Hide/Show Toggle Button */}
                    <button
                      type="button"
                      title={isPkgActive ? t('Hide from public site', 'លាក់ពីគេហទំព័រ') : t('Show on public site', 'បង្ហាញលើគេហទំព័រ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePackageActive(pkg.id, isPkgActive);
                      }}
                      disabled={togglingPackageId === pkg.id}
                      className={`p-1.5 rounded-lg transition-all shadow-2xs border cursor-pointer ${
                        isPkgActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {togglingPackageId === pkg.id ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isPkgActive ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Edit Button */}
                    <Link 
                      href={`/admin/packages/new?id=${pkg.id}`} 
                      className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#0050C3] rounded-lg transition-all shadow-2xs border border-slate-200/60"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete Button */}
                    <button 
                      type="button"
                      onClick={() => handleDeleteRequest(pkg.id, pkg.name)} 
                      className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-2xs border border-rose-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* Modals */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={t('Bulk Import Packages', 'នាំចូលកញ្ចប់តម្លៃ')}
        subtitle={t('Refresh collection via cloud or local file', 'បញ្ចូលឯកសារ Excel ឬ តំណភ្ជាប់ Google Sheets')}
        dataCount={parsedData.length}
        importMode={importMode}
        setImportMode={(mode) => { setImportMode(mode); setParsedData([]); }}
        isDragging={isDragging}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onFileSelect={(e) => processFile(e.target.files[0])}
        sheetUrl={sheetUrl}
        setSheetUrl={setSheetUrl}
        onSheetFetch={handleSheetImport}
        isProcessing={loading}
        onConfirm={confirmImport}
        renderTable={() => (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Status', 'ស្ថានភាព')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Package', 'កញ្ចប់')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Price', 'តម្លៃ')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Features', 'លក្ខណៈ')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Description', 'ការពិពណ៌នា')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parsedData.map((row, i) => (
                <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.isDuplicate ? 'opacity-60 bg-slate-50' : ''}`}>
                  <td className="px-4 py-3 text-[10px] font-bold uppercase">
                    {row.isDuplicate ? <span className="text-amber-600">Skip</span> : <span className="text-emerald-600">New</span>}
                  </td>
                  <td className="px-4 py-3 font-bold text-[#0050C3]">{row.name}</td>
                  <td className="px-4 py-3 text-slate-900 font-bold">{row.price}</td>
                  <td className="px-4 py-3 text-[10px] text-slate-500 max-w-[200px]">
                    {row.features.map((f, idx) => <div key={idx} className="truncate">• {f}</div>)}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-500 max-w-[200px] truncate" title={row.description}>{row.description}</td>
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
