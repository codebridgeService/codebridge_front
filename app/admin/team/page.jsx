'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { teamService } from '../../store/teamService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowUpIcon,
  CheckIcon,
  Bars2Icon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import ImportModal from '../components/modals/ImportModal';
import DeleteModal from '../components/modals/DeleteModal';
import ResultModal from '../components/modals/ResultModal';

export default function TeamManagementPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [search, setSearch] = useState('');
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

  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };


  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const data = await teamService.getTeamMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (newOrder) => {
    setMembers(newOrder);
  };

  const saveNewOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orders = members.map((m, index) => ({
        id: m.id,
        order: index
      }));
      await teamService.reorderTeamMembers(orders);
      setResultMessage(t("Team order saved successfully!", "លំដាប់ក្រុមត្រូវបានរក្សាទុកដោយជោគជ័យ!"));
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
        await Promise.all(selectedIds.map(id => teamService.deleteTeamMember(id)));
        setMembers(prev => prev.filter(m => !selectedIds.includes(m.id)));
        setSelectedIds([]);
      } else {
        await teamService.deleteTeamMember(itemToDelete.id);
        setMembers(prev => prev.filter(m => m.id !== itemToDelete.id));
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
      const rowsList = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(10, rowsList.length); i++) {
        const rowArr = rowsList[i] || [];
        const hasDataTokens = rowArr.some(c => typeof c === 'string' && (
          c.toLowerCase().trim().includes('name') || c.toLowerCase().trim().includes('role')
        ));
        if (hasDataTokens) { headerRowIndex = i; break; }
      }
      const data = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex });
      const getMappedValue = (row, possibleKeys, possibleSubstrings = []) => {
        for (const key of Object.keys(row)) {
          const normalizedKey = key.trim().toLowerCase();
          if (possibleKeys.includes(normalizedKey)) return row[key];
          if (possibleSubstrings.some(sub => normalizedKey.includes(sub))) return row[key];
        }
        return '';
      };
      const mappedData = data.map((row) => {
        const nameStr = String(getMappedValue(row, ['name']) || '').trim();
        const existing = members.find(m => m.name && nameStr !== '' && String(m.name).trim().toLowerCase() === nameStr.toLowerCase());
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
        alert(t(`Failed to parse Excel file.`, `ការវិភាគឯកសារ Excel បានបរាជ័យ។`));
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
    if (file && (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls'))) {
      processFile(file);
    } else {
      alert(t("Please upload a valid Excel file (.xlsx or .xls)", "សូមបញ្ចូលឯកសារ Excel ដែលត្រឹមត្រូវ (.xlsx ឬ .xls)"));
    }
  };

  const handleSheetImport = async () => {
    const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!sheetId) return alert(t("Invalid URL", "តំណភ្ជាប់មិនត្រឹមត្រូវ"));
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`);
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const wb = XLSX.read(text, { type: 'string' });
      processImportData(wb);
    } catch (err) {
      alert(t("Failed to fetch Google Sheet.", "មិនអាចទាញយកបានទេ។"));
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
        Object.keys(row).forEach(key => {
          if (key === 'isDuplicate') return;
          if (row[key]) formData.append(key, row[key]);
        });
        await teamService.createTeamMember(formData);
        successCount++;
      } catch (err) { console.error(err); }
    }
    setLoading(false);
    setIsImportModalOpen(false);
    fetchMembers();
    setResultMessage(t(`Import completed! Success: ${successCount}`, `ការនាំចូលបញ្ជប់! ចំនួន: ${successCount}`));
    setResultType('success');
    setShowResultModal(true);
    setParsedData(null);
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
            <UserCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('Team Management', 'គ្រប់គ្រងក្រុម')}</h1>
            <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5">
              {members.length} {t('Active Members', 'សមាជិកសរុប')}
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
            href="/admin/team/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-[color:var(--color-primary)] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[color:var(--color-primary)]/20 hover:scale-105 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            {t('Add New', 'បន្ថែមថ្មី')}
          </Link>
        </div>
      </motion.div>

      {/* Reorderable List Display */}
      {loading ? (
        <div className="py-24 text-center animate-pulse text-[8px] font-black text-gray-300 uppercase tracking-widest">Hydrating Team...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white/50 border border-white/40 rounded-[1.5rem] p-12 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
           No Members Found
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={members} 
          onReorder={handleReorder}
          className="space-y-2"
        >
          {members.map((member) => (
            <Reorder.Item 
              key={member.id}
              value={member}
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
                    onClick={(e) => { e.stopPropagation(); toggleSelection(member.id); }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${
                      selectedIds.includes(member.id) 
                        ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white' 
                        : 'border-gray-200 text-transparent hover:border-[color:var(--color-primary)]/50 bg-white shadow-inner'
                    }`}
                 >
                   <CheckIcon className="w-4 h-4" strokeWidth={3} />
                 </button>

                 {member.image ? (
                    <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-gray-100 group-hover:border-[color:var(--color-primary)]/30 transition-all">
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                 ) : (
                    <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)] group-hover:text-white transition-all shrink-0 shadow-inner">
                      <UserCircleIcon className="w-6 h-6" />
                    </div>
                 )}
                 
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-sm font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{member.name}</h3>
                       <span className="text-[9px] font-black bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] px-2 py-0.5 rounded-md uppercase tracking-widest">ORDER: {members.indexOf(member) + 1}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 leading-snug truncate max-w-lg ">
                      {member.bio ? `"${member.bio}"` : '-'}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-8 pr-2">
                 <div className="hidden md:flex flex-col items-end">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">ROLE</p>
                    <p className="text-[12px] font-black text-[color:var(--color-primary)] uppercase tracking-widest leading-none">{member.role || 'No Role'}</p>
                 </div>
                 
                 <div className="flex items-center gap-2 border-l border-gray-100 pl-6 py-2">
                    <Link href={`/admin/team/new?id=${member.id}`} className="p-2.5 text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 hover:bg-[color:var(--color-primary)]/10 rounded-xl transition-all shadow-sm">
                      <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDeleteRequest(member.id, member.name)} className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm z-10 relative">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Reusable Modals */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => { setIsImportModalOpen(false); setParsedData(null); }}
        title={t('Import Team Members', 'នាំចូលសមាជិកក្រុម')}
        subtitle={t('Upload your Excel file or enter Google Sheets URL', 'បញ្ចូលឯកសារ Excel ឬ តំណភ្ជាប់ Google Sheets')}
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
            <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-black text-[color:var(--color-primary)]/40 uppercase">{t('Status', 'ស្ថានភាព')}</th>
                <th className="px-4 py-3 font-black text-[color:var(--color-primary)]/40 uppercase">{t('Name', 'ឈ្មោះ')}</th>
                <th className="px-4 py-3 font-black text-[color:var(--color-primary)]/40 uppercase">{t('Role', 'តួនាទី')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parsedData.map((row, i) => (
                <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${row.isDuplicate ? 'opacity-60 bg-gray-50' : ''}`}>
                  <td className="px-4 py-3">{row.isDuplicate ? <span className="text-amber-500 font-bold">Skip</span> : <span className="text-emerald-500 font-bold">New</span>}</td>
                  <td className="px-4 py-3 font-bold text-[color:var(--color-primary)]">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.role}</td>
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
