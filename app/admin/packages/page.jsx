'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { packageService } from '../../store/packageService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  StarIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  Bars2Icon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';
import ImportModal from '../components/modals/ImportModal';

export default function PackageManagementPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [search, setSearch] = useState('');
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

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => 
      (pkg.name?.toLowerCase().includes(search.toLowerCase())) || 
      (pkg.kh_name?.includes(search))
    );
  }, [packages, search]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };


  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await packageService.getPackages();
      // Ensure order is respected
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      setResultMessage(t("Order saved successfully!", "លំដាប់ត្រូវបានរក្សាទុកដោយជោគជ័យ!"));
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
        await Promise.all(selectedIds.map(id => packageService.deletePackage(id)));
        setPackages(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
      } else {
        await packageService.deletePackage(itemToDelete.id);
        setPackages(prev => prev.filter(p => p.id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
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
      alert(t("Please upload a valid Excel file (.xlsx or .xls)", "សូមបញ្ចូលឯកសារ Excel ដែលត្រឹមត្រូវ (.xlsx ឬ .xls)"));
    }
  };

  const handleSheetImport = async () => {
    const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!sheetId) return alert(t("Invalid Google Sheets URL", "តំណភ្ជាប់មិនត្រឹមត្រូវ"));
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`);
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const wb = XLSX.read(text, { type: 'string' });
      processImportData(wb);
    } catch (err) {
      alert(t("Failed to fetch Google Sheet.", "មិនអាចទាញយក Google Sheet បានទេ។"));
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
    <div className="space-y-4 pb-20">
      {/* High-Density Glass Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-40"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center text-white shadow-lg">
            <Squares2X2Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('Package Management', 'គ្រប់គ្រងកញ្ចប់')}</h1>
            <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5">
              {packages.length} {t('Active Packages', 'កញ្ចប់តម្លៃសរុប')}
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

          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]/20 transition-all shadow-sm"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            <span>{t('Import', 'នាំចូល')}</span>
          </button>

          <Link 
            href="/admin/packages/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-[color:var(--color-primary)] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[color:var(--color-primary)]/20 hover:scale-105 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            {t('Add New', 'បន្ថែមថ្មី')}
          </Link>
        </div>
      </motion.div>

      {/* Reorderable List Display */}
      {loading ? (
        <div className="py-24 text-center animate-pulse text-[8px] font-black text-gray-300 uppercase tracking-widest">Hydrating Packages...</div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white/50 border border-white/40 rounded-[1.5rem] p-12 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
           No Packages Found
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={packages} 
          onReorder={handleReorder}
          className="space-y-2"
        >
          {packages.map((pkg) => (
            <Reorder.Item 
              key={pkg.id} 
              value={pkg}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group bg-white/80 backdrop-blur-xl border border-white/60 p-4 pl-5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-[color:var(--color-primary)]/30 transition-all flex items-center justify-between gap-5 relative overflow-hidden cursor-grab active:cursor-grabbing"
            >
              {pkg.recommend && (
                 <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                   <div className="absolute top-2 -right-6 px-8 py-0.5 bg-yellow-400 rotate-45 text-[8px] font-black uppercase text-white shadow-sm border border-white/30 backdrop-blur-sm shadow-yellow-500/20">POPULAR</div>
                 </div>
              )}

              <div className="flex items-center gap-5 flex-1 min-w-0">
                 {/* Drag Handle */}
                 <div className="text-gray-300 group-hover:text-[color:var(--color-primary)] transition-colors">
                   <Bars2Icon className="w-5 h-5" />
                 </div>

                 <button
                    onClick={(e) => { e.stopPropagation(); toggleSelection(pkg.id); }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${
                      selectedIds.includes(pkg.id) 
                        ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white' 
                        : 'border-gray-200 text-transparent hover:border-[color:var(--color-primary)]/50 bg-white shadow-inner'
                    }`}
                 >
                   <CheckIcon className="w-4 h-4" strokeWidth={3} />
                 </button>

                 <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)] group-hover:text-white transition-all shrink-0 shadow-inner">
                   {pkg.recommend ? <StarIconSolid className="w-6 h-6" /> : <Squares2X2Icon className="w-6 h-6" />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-sm font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t(pkg.name, pkg.kh_name)}</h3>
                       <span className="text-[9px] font-black bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] px-2 py-0.5 rounded-md uppercase tracking-widest">ORDER: {packages.indexOf(pkg) + 1}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 leading-snug truncate max-w-lg ">
                      "{t(pkg.description, pkg.kh_description)}"
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-8 pr-2">
                 <div className="hidden md:flex flex-col items-end">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">PRICE</p>
                    <p className="text-[12px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">{pkg.price}</p>
                 </div>
                 
                 <div className="flex items-center gap-2 border-l border-gray-100 pl-6 py-2">
                    <Link href={`/admin/packages/new?id=${pkg.id}`} className="p-2.5 text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 hover:bg-[color:var(--color-primary)]/10 rounded-xl transition-all shadow-sm">
                      <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDeleteRequest(pkg.id, pkg.name)} className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm z-10 relative">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Modals remain the same but with branded styling */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={t('Bulk Import', 'នាំចូលកញ្ចប់')}
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
             <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
               <tr>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('Status', 'ស្ថានភាព')}</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('Package', 'កញ្ចប់')}</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('Price', 'តម្លៃ')}</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('Features', 'លក្ខណៈ')}</th>
                 <th className="px-4 py-3 font-black text-gray-400 uppercase tracking-widest">{t('Description', 'ការពិពណ៌នា')}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {parsedData.map((row, i) => (
                 <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${row.isDuplicate ? 'opacity-60 bg-gray-50' : ''}`}>
                   <td className="px-4 py-3 text-[10px] font-black uppercase">
                     {row.isDuplicate ? <span className="text-amber-500">Skip</span> : <span className="text-emerald-500">New</span>}
                   </td>
                   <td className="px-4 py-3 font-bold text-[color:var(--color-primary)]">{row.name}</td>
                   <td className="px-4 py-3 text-[color:var(--color-primary)] font-black">{row.price}</td>
                   <td className="px-4 py-3 text-[10px] text-gray-500 max-w-[200px]">
                     {row.features.map((f, idx) => <div key={idx} className="truncate">• {f}</div>)}
                   </td>
                   <td className="px-4 py-3 text-[10px] text-gray-500 max-w-[200px] truncate" title={row.description}>{row.description}</td>
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
