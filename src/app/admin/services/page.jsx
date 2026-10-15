'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { serviceService } from '@/store/serviceService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import * as XLSX from 'xlsx';
import { 
  Plus, 
  Trash2, 
  Edit3,
  Search,
  Wrench,
  Upload,
  Check,
  GripVertical,
  RotateCw,
  Eye,
  EyeOff,
  Cpu
} from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/outline';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';
import ImportModal from '../components/modals/ImportModal';

const HEADER_MAPS = {
  name: ['name', 'service', 'title', 'service name', 'name (en)'],
  kh_name: ['kh_name', 'name (kh)', 'kh name', 'service (kh)', 'kh_title'],
  icon: ['icon', 'icon name', 'heroicon', 'image icon'],
  description: ['description', 'desc', 'details', 'description (en)'],
  kh_description: ['kh_description', 'description (kh)', 'kh description', 'kh_desc'],
};

export default function ServiceManagementPage() {
  const { lang } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, HIDDEN
  const [hasChanges, setHasChanges] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Section Visibility State
  const [showServicesSection, setShowServicesSection] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [togglingServiceId, setTogglingServiceId] = useState(null);

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [importMode, setImportMode] = useState('file');

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

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    fetchServices();
    siteSettingService.getSettings()
      .then(settings => {
        if (settings) {
          setShowServicesSection(settings.showServices !== false);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getServices();
      setServices(data || []);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeServicesCount = useMemo(
    () => services.filter(s => s.isActive !== false).length,
    [services]
  );
  const hiddenServicesCount = useMemo(
    () => services.filter(s => s.isActive === false).length,
    [services]
  );

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const title = service.title || service.name || '';
      const khTitle = service.kh_title || service.kh_name || '';
      const desc = service.description || '';
      const khDesc = service.kh_description || '';

      const matchesSearch = 
        title.toLowerCase().includes(search.toLowerCase()) || 
        khTitle.includes(search) ||
        desc.toLowerCase().includes(search.toLowerCase()) ||
        khDesc.includes(search);

      const isServiceActive = service.isActive !== false;
      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isServiceActive) ||
        (statusFilter === 'HIDDEN' && !isServiceActive);

      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newStatus = !showServicesSection;
      await siteSettingService.updateSettings({ showServices: newStatus });
      setShowServicesSection(newStatus);
      setResultMessage(
        newStatus
          ? t('Our Services section is now live on the public website!', 'ផ្នែកសេវាកម្មត្រូវបានបង្ហាញជាសាធារណៈហើយ!')
          : t('Our Services section has been hidden from the public website.', 'ផ្នែកសេវាកម្មត្រូវបានលាក់ពីគេហទំព័រសាធារណៈហើយ។')
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

  const handleToggleServiceActive = async (id, currentStatus) => {
    setTogglingServiceId(id);
    const newStatus = !currentStatus;
    // Optimistic update
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: newStatus } : s));

    try {
      await serviceService.updateService(id, { isActive: newStatus });
      setResultMessage(
        newStatus
          ? t('Service is now live in the catalog!', 'សេវាកម្មត្រូវបានបង្ហាញក្នុងកាតាឡុកហើយ!')
          : t('Service is now hidden from the catalog.', 'សេវាកម្មត្រូវបានលាក់ពីកាតាឡុកហើយ។')
      );
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      // Revert optimistic update
      setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: currentStatus } : s));
      setResultMessage(err.message || 'Failed to update service visibility');
      setResultType('error');
      setShowResultModal(true);
    } finally {
      setTogglingServiceId(null);
    }
  };

  const handleReorder = (newOrder) => {
    setServices(newOrder);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    setIsProcessing(true);
    try {
      const orders = services.map((s, i) => ({ id: s.id, order: i }));
      await serviceService.reorderServices(orders);
      setHasChanges(false);
      setResultType('success');
      setResultMessage(t('Order updated successfully', 'លំដាប់ត្រូវបានធ្វើបច្ចុប្បន្នភាព'));
      setShowResultModal(true);
    } catch (err) {
      setResultType('error');
      setResultMessage(err.message || 'Failed to update order');
      setShowResultModal(true);
    } finally {
      setIsProcessing(false);
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
        await Promise.all(selectedIds.map(id => serviceService.deleteService(id)));
        setServices(prev => prev.filter(s => !selectedIds.includes(s.id)));
        setSelectedIds([]);
      } else {
        await serviceService.deleteService(itemToDelete.id);
        setServices(prev => prev.filter(s => s.id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      setResultMessage(t('Service(s) deleted successfully!', 'សេវាកម្មត្រូវបានលុបដោយជោគជ័យ!'));
      setResultType('success');
      setShowResultModal(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const processImportData = (wb) => {
    try {
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length < 1) throw new Error("File is empty");

      let headerRowIndex = 0;
      let maxMatches = 0;
      const scanLimit = Math.min(data.length, 15);
      for (let i = 0; i < scanLimit; i++) {
        const row = data[i];
        if (!row || !Array.isArray(row)) continue;
        let matches = 0;
        const rowString = row.join(' ').toLowerCase();
        Object.values(HEADER_MAPS).forEach(aliases => {
          if (aliases.some(a => rowString.includes(a.toLowerCase()))) matches++;
        });
        if (matches > maxMatches) {
          maxMatches = matches;
          headerRowIndex = i;
        }
      }

      const rows = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex });
      const mappedData = rows.map(row => {
        const item = {};
        Object.keys(HEADER_MAPS).forEach(field => {
          const aliases = HEADER_MAPS[field];
          for (const alias of aliases) {
            const key = Object.keys(row).find(k => k.toLowerCase().trim() === alias.toLowerCase());
            if (key && row[key]) {
              item[field] = String(row[key]).trim();
              break;
            }
          }
        });
        const isDuplicate = services.some(s => 
          (s.title?.trim().toLowerCase() === item.name?.trim().toLowerCase()) ||
          (s.name?.trim().toLowerCase() === item.name?.trim().toLowerCase())
        );
        return { ...item, isActive: true, isDuplicate };
      }).filter(s => s.name && (s.description || s.kh_description));
      setImportData(mappedData);
    } catch (err) {
      alert("Error parsing data: " + err.message);
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
        alert("Error parsing file: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSheetImport = async () => {
    const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!sheetId) return alert(t("Invalid Sheets URL", "តំណភ្ជាប់មិនត្រឹមត្រូវ"));
    setIsProcessing(true);
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const wb = XLSX.read(text, { type: 'string' });
      processImportData(wb);
    } catch (err) {
      alert(t("Sheet must be PUBLIC", "សូមកំណត់ Sheets ជាសាធារណៈ"));
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = async () => {
    setIsProcessing(true);
    try {
      const result = await serviceService.importServices(importData);
      setResultType(result.importedCount > 0 ? 'success' : 'info');
      setResultMessage(result.message);
      setShowResultModal(true);
      setShowImportModal(false);
      setImportData([]);
      fetchServices();
    } catch (err) {
      setResultType('error');
      setResultMessage(err.message);
      setShowResultModal(true);
    } finally {
      setIsProcessing(false);
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
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('Service Catalog', 'កាតាឡុកសេវាកម្ម')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {services.length} {t('Total Services', 'សេវាកម្មសរុប')} • {activeServicesCount} {t('Live', 'ផ្សាយ')} • {hiddenServicesCount} {t('Hidden', 'លាក់')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search services...', 'ស្វែងរកសេវាកម្ម...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-44 sm:w-52"
            />
          </div>

          {hasChanges && (
            <button 
              type="button"
              onClick={saveOrder}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0050C3] rounded-xl font-bold text-xs hover:bg-blue-100 transition-all shadow-2xs border border-blue-100 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{t('Save Order', 'រក្សាទុកលំដាប់')}</span>
            </button>
          )}

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
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:text-[#0050C3] hover:border-[#0050C3]/30 transition-all shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('Import', 'នាំចូល')}</span>
          </button>

          <Link 
            href="/admin/services/new"
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
            showServicesSection
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                showServicesSection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {showServicesSection ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('Homepage Services Section', 'ផ្នែកសេវាកម្មលើទំព័រដើម')}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    showServicesSection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {showServicesSection ? t('Live', 'បង្ហាញ') : t('Hidden', 'លាក់')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {showServicesSection
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
            ) : showServicesSection ? (
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
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t('Service Visibility Breakdown', 'ស្ថានភាពសេវាកម្ម')}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold">
                <span className="text-emerald-700 font-bold">{activeServicesCount} {t('Live', 'ផ្សាយ')}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold">{hiddenServicesCount} {t('Hidden', 'លាក់')}</span>
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
              {t('All', 'ទាំងអស់')} ({services.length})
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
              {t('Live', 'ផ្សាយ')} ({activeServicesCount})
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
              {t('Hidden', 'លាក់')} ({hiddenServicesCount})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Reorderable Services List Display */}
      {loading ? (
        <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Loading Services...', 'កំពុងទាញយកទិន្នន័យសេវាកម្ម...')}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs font-bold text-slate-400 shadow-2xs">
          {t('No services found matching your criteria', 'រកមិនឃើញសេវាកម្មដែលត្រូវគ្នានោះទេ')}
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={services} 
          onReorder={handleReorder}
          className="space-y-2.5"
        >
          {filteredServices.map((service) => {
            const isServiceActive = service.isActive !== false;
            const Icon = HeroIcons[service.icon] || Cpu;

            return (
              <Reorder.Item 
                key={service.id} 
                value={service}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group bg-white border p-3 pl-3 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 relative overflow-hidden cursor-grab active:cursor-grabbing ${
                  isServiceActive
                    ? 'border-slate-200/80 hover:border-[#0050C3]/30'
                    : 'border-slate-200 bg-slate-50/60 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Drag Handle */}
                  <div className="p-1 text-slate-300 group-hover:text-slate-600 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Multi-select Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleSelection(service.id); }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors cursor-pointer ${
                      selectedIds.includes(service.id) 
                        ? 'bg-[#0050C3] border-[#0050C3] text-white' 
                        : 'border-slate-300 text-transparent hover:border-[#0050C3]/50 bg-white'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  {/* Icon Card */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0050C3] group-hover:bg-[#0050C3] group-hover:text-white transition-all shrink-0 border border-slate-100">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0050C3] transition-colors truncate">
                        {t(service.title || service.name, service.kh_title || service.kh_name)}
                      </h3>
                      
                      {/* Active/Hidden Status Pill */}
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isServiceActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}>
                        {isServiceActive ? t('Live', 'ផ្សាយ') : t('Hidden', 'លាក់')}
                      </span>

                      <span className="text-[9px] font-mono font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">
                        #{services.indexOf(service) + 1}
                      </span>
                    </div>

                    <p className="text-xs font-normal text-slate-500 truncate max-w-xl">
                      {t(service.description, service.kh_description)}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 pr-1">
                  <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ICON</p>
                    <p className="text-[10px] font-mono font-semibold text-slate-700 truncate max-w-[120px]">{service.icon}</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 py-1">
                    {/* Instant Hide/Show Toggle Button */}
                    <button
                      type="button"
                      title={isServiceActive ? t('Hide from public site', 'លាក់ពីគេហទំព័រ') : t('Show on public site', 'បង្ហាញលើគេហទំព័រ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleServiceActive(service.id, isServiceActive);
                      }}
                      disabled={togglingServiceId === service.id}
                      className={`p-1.5 rounded-lg transition-all shadow-2xs border cursor-pointer ${
                        isServiceActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {togglingServiceId === service.id ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isServiceActive ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Edit Button */}
                    <Link 
                      href={`/admin/services/new?id=${service.id}`} 
                      className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#0050C3] rounded-lg transition-all shadow-2xs border border-slate-200/60"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete Button */}
                    <button 
                      type="button"
                      onClick={() => handleDeleteRequest(service.id, service.title || service.name)} 
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
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title={t('Bulk Import Services', 'នាំចូលសេវាកម្ម')}
        subtitle={t('Refresh collection via cloud or local file', 'បញ្ចូលឯកសារ Excel ឬ តំណភ្ជាប់ Google Sheets')}
        dataCount={importData.length}
        importMode={importMode}
        setImportMode={(mode) => { setImportMode(mode); setImportData([]); }}
        isDragging={isDragging}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) processFile(file);
        }}
        onFileSelect={(e) => processFile(e.target.files[0])}
        sheetUrl={sheetUrl}
        setSheetUrl={setSheetUrl}
        onSheetFetch={handleSheetImport}
        isProcessing={isProcessing}
        onConfirm={confirmImport}
        renderTable={() => (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Status', 'ស្ថានភាព')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Service', 'សេវាកម្ម')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Icon', 'រូបតំណាង')}</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{t('Description', 'ការពិពណ៌នា')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {importData.map((row, i) => (
                <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.isDuplicate ? 'opacity-60 bg-slate-50' : ''}`}>
                  <td className="px-4 py-3 text-[10px] font-bold uppercase">
                    {row.isDuplicate ? <span className="text-amber-600">Skip</span> : <span className="text-emerald-600">New</span>}
                  </td>
                  <td className="px-4 py-3 font-bold text-[#0050C3]">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{row.icon}</td>
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
