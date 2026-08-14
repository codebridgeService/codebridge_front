'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup, Reorder } from 'framer-motion';
import Link from 'next/link';
import { serviceService } from '../../store/serviceService';
import { useLanguage } from '../../context/LanguageContext';
import * as XLSX from 'xlsx';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  Bars2Icon
} from '@heroicons/react/24/outline';
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
  const [hasChanges, setHasChanges] = useState(false);
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const spring = {
    type: "spring",
    stiffness: 400,
    damping: 35,
    mass: 1
  };

  // Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
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
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceService.getServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      alert(err.message);
    } finally {
      setIsProcessing(false);
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
          s.title?.trim().toLowerCase() === item.name?.trim().toLowerCase() ||
          s.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
        );
        return { ...item, isDuplicate };
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
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => 
      ((service.title || service.name)?.toLowerCase().includes(search.toLowerCase())) || 
      ((service.kh_title || service.kh_name)?.includes(search))
    );
  }, [services, search]);

  return (
    <div className="space-y-4 pb-20">
      {/* High-Density Glass Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-40"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center text-white shadow-lg">
            <Cog6ToothIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('Service Catalog', 'កាតាឡុកសេវាកម្ម')}</h1>
            <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5">
              {services.length} {t('Active Services', 'សេវាកម្មសរុប')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[color:var(--color-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search...', 'ស្វែងរក...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-5 py-2.5 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:bg-white transition-all text-xs font-bold w-56"
            />
          </div>

          {hasChanges && (
            <button 
              onClick={saveOrder}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              {isProcessing ? t('SAVING...', 'កំពុងរក្សាទុក...') : t('SAVE ORDER', 'រក្សាទុកលំដាប់')}
            </button>
          )}

          {selectedIds.length > 0 && (
            <button 
              onClick={() => handleDeleteRequest(null, null, true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm border border-red-100"
            >
              <TrashIcon className="w-4 h-4" />
              <span>{t('Delete', 'លុប')} ({selectedIds.length})</span>
            </button>
          )}

          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]/20 transition-all shadow-sm"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            <span>{t('Import', 'នាំចូល')}</span>
          </button>

          <Link 
            href="/admin/services/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-[color:var(--color-primary)] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[color:var(--color-primary)]/20 hover:scale-105 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            {t('Add New', 'បន្ថែមថ្មី')}
          </Link>
        </div>
      </motion.div>

      {/* Kinetic List Display (High Density) */}
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-24 text-center animate-pulse text-[8px] font-black text-gray-300 uppercase tracking-widest">Hydrating Catalog...</div>
          ) : filteredServices.length === 0 ? (
            <div className="bg-white/50 border border-white/40 rounded-[1.5rem] p-12 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
               No Records Found
            </div>
          ) : search ? (
            <motion.div layout className="space-y-2">
              {filteredServices.map((service, idx) => {
                const Icon = HeroIcons[service.icon] || Cog6ToothIcon;
                return (
                  <motion.div 
                    key={service.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: idx * 0.02 }}
                    className="group bg-white/80 backdrop-blur-xl border border-white/60 p-4 pl-5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-[color:var(--color-primary)]/30 transition-all flex items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                       <button
                          onClick={(e) => { e.stopPropagation(); toggleSelection(service.id); }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${
                            selectedIds.includes(service.id) 
                              ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white' 
                              : 'border-gray-200 text-transparent hover:border-[color:var(--color-primary)]/50 bg-white shadow-inner'
                          }`}
                       >
                         <CheckIcon className="w-4 h-4" strokeWidth={3} />
                       </button>

                       <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)] group-hover:text-white transition-all shrink-0 shadow-inner">
                         <Icon className="w-6 h-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <h3 className="text-sm font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t(service.title || service.name, service.kh_title || service.kh_name)}</h3>
                             <span className="text-[9px] font-black bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] px-2 py-0.5 rounded-md uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">ID: {service.id.slice(-6)}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-400 leading-snug truncate max-w-lg ">
                            "{t(service.description, service.kh_description)}"
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 pr-2">
                       <div className="hidden md:flex flex-col items-end">
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">ICON</p>
                          <p className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">{service.icon}</p>
                       </div>
                       
                       <div className="flex items-center gap-2 border-l border-gray-100 pl-6 py-2">
                          <Link href={`/admin/services/new?id=${service.id}`} className="p-2.5 text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 hover:bg-[color:var(--color-primary)]/10 rounded-xl transition-all shadow-sm">
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDeleteRequest(service.id, service.title || service.name)} className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <Reorder.Group 
              axis="y" 
              values={services} 
              onReorder={handleReorder}
              className="space-y-2"
            >
              {services.map((service, idx) => {
                const Icon = HeroIcons[service.icon] || Cog6ToothIcon;
                return (
                  <Reorder.Item 
                    key={service.id} 
                    value={service}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: idx * 0.02 }}
                    className="group bg-white/80 backdrop-blur-xl border border-white/60 p-4 pl-5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-[color:var(--color-primary)]/30 transition-all flex items-center justify-between gap-5 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                       <div className="p-1.5 text-gray-300 group-hover:text-[color:var(--color-primary)] transition-colors">
                          <Bars2Icon className="w-5 h-5" />
                       </div>

                       <button
                          onClick={(e) => { e.stopPropagation(); toggleSelection(service.id); }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${
                            selectedIds.includes(service.id) 
                              ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white' 
                              : 'border-gray-200 text-transparent hover:border-[color:var(--color-primary)]/50 bg-white shadow-inner'
                          }`}
                       >
                         <CheckIcon className="w-4 h-4" strokeWidth={3} />
                       </button>

                       <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)] group-hover:text-white transition-all shrink-0 shadow-inner">
                         <Icon className="w-6 h-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <h3 className="text-sm font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t(service.title || service.name, service.kh_title || service.kh_name)}</h3>
                             <span className="text-[9px] font-black bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] px-2 py-0.5 rounded-md uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">ID: {service.id.slice(-6)}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-400 leading-snug truncate max-w-lg ">
                            "{t(service.description, service.kh_description)}"
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 pr-2">
                       <div className="hidden md:flex flex-col items-end">
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">ICON</p>
                          <p className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">{service.icon}</p>
                       </div>
                       
                       <div className="flex items-center gap-2 border-l border-gray-100 pl-6 py-2">
                          <Link href={`/admin/services/new?id=${service.id}`} className="p-2.5 text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 hover:bg-[color:var(--color-primary)]/10 rounded-xl transition-all shadow-sm">
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDeleteRequest(service.id, service.title || service.name)} className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          )}
        </AnimatePresence>
      </LayoutGroup>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title={t('Bulk Import', 'នាំចូលសេវាកម្ម')}
        subtitle={t('Refresh collection via cloud or local file', 'បញ្ចូលឯកសារ Excel ឬ តំណភ្ជាប់ Google Sheets')}
        dataCount={importData.length}
        importMode={importMode}
        setImportMode={(mode) => { setImportMode(mode); setImportData([]); }}
        isDragging={isDragging}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
        onFileSelect={(e) => processFile(e.target.files[0])}
        sheetUrl={sheetUrl}
        setSheetUrl={setSheetUrl}
        onSheetFetch={handleSheetImport}
        isProcessing={isProcessing}
        onConfirm={confirmImport}
        renderTable={() => (
           <table className="w-full text-left text-xs">
             <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('STATUS', 'ស្ថានភាព')}</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('NAME', 'ឈ្មោះ')}</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">KH_NAME</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">ICON</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">DESCRIPTION</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">KH_DESCRIPTION</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {importData.map((item, i) => (
                 <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${item.isDuplicate ? 'opacity-60 bg-gray-50' : ''}`}>
                   <td className="px-4 py-3 text-[10px] font-black uppercase">
                     {item.isDuplicate ? (
                       <span className="text-amber-500">Skip</span>
                     ) : (
                       <span className="text-emerald-500">New</span>
                     )}
                   </td>
                   <td className="px-4 py-3 font-bold text-[color:var(--color-primary)]">{item.name}</td>
                   <td className="px-4 py-3 font-medium text-gray-700">{item.kh_name}</td>
                   <td className="px-4 py-3 font-medium text-[color:var(--color-primary)]">{item.icon}</td>
                   <td className="px-4 py-3 text-[10px] text-gray-500 max-w-[150px] truncate" title={item.description}>{item.description}</td>
                   <td className="px-4 py-3 text-[10px] text-gray-500 max-w-[150px] truncate" title={item.kh_description}>{item.kh_description}</td>
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
