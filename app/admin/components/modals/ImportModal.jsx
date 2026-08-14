'use client';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  DocumentArrowUpIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../context/LanguageContext';

export default function ImportModal({
  isOpen,
  onClose,
  title,
  subtitle,
  dataCount,
  importMode,
  setImportMode,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  sheetUrl,
  setSheetUrl,
  onSheetFetch,
  isProcessing,
  onConfirm,
  renderTable
}) {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={() => !isProcessing && onClose()}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-3xl overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{title || t('Import Data', 'នាំចូលទិន្នន័យ')}</h3>
            <p className="text-xs text-blue-500 font-bold mt-1.5">
              {dataCount > 0 
                ? t(`Found ${dataCount} items ready to import`, `បានរកឃើញទិន្នន័យចំនួន ${dataCount} ដើម្បីនាំចូល`)
                : subtitle || t('Upload an Excel file or paste a Google Sheet link', 'បញ្ចូលឯកសារ Excel ឬ តំណភ្ជាប់ Google Sheets')
              }
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            disabled={isProcessing}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
          <button 
            onClick={() => setImportMode('file')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${importMode === 'file' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 bg-white border border-gray-200 hover:text-blue-600 hover:border-blue-200'}`}
          >
            {t('Upload Excel File', 'ឯកសារ Excel')}
          </button>
          <button 
            onClick={() => setImportMode('sheet')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${importMode === 'sheet' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 bg-white border border-gray-200 hover:text-emerald-600 hover:border-emerald-200'}`}
          >
            {t('Link Google Sheet', 'សៀវភៅតាមពពក')}
          </button>
        </div>

        <div className="p-8">
          {dataCount === 0 ? (
            importMode === 'file' ? (
              <label 
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-105' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <DocumentArrowUpIcon className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-gray-400'}`} />
                  <p className="mb-2 text-sm text-gray-600 font-bold">
                    <span className="font-black text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition-colors">{t('Click to browse', 'ចុចដើម្បីជ្រើសរើស')}</span> {t('or simply drop your file here', 'ឬទម្លាក់ឯកសារនៅទីនេះ')}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">Supports .XLSX and .XLS formats</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={onFileSelect} />
              </label>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50/50 p-8 hover:bg-gray-50 transition-all">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-white shadow-sm">
                  <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h2v2H8z"/><path d="M14 13h2v2h-2z"/><path d="M11 13h2v2h-2z"/><path d="M8 17h2v2H8z"/><path d="M14 17h2v2h-2z"/><path d="M11 17h2v2h-2z"/></svg>
                </div>
                <div className="w-full max-w-lg space-y-4 text-center mx-auto">
                  <input 
                    type="text"
                    placeholder="Public Sheets URL..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="w-full px-6 py-4 bg-white border border-gray-200 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm font-medium shadow-sm"
                  />
                  <button 
                    onClick={onSheetFetch}
                    disabled={isProcessing || !sheetUrl}
                    className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[13px] shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUpTrayIcon className="w-5 h-5" />}
                    {t('Fetch Data', 'ទាញយកទិន្នន័យ')}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="border border-gray-100 rounded-[1.5rem] overflow-x-auto overflow-y-auto bg-white max-h-[60vh] no-scrollbar shadow-inner">
              {renderTable()}
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-black text-gray-500 bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm">
            <span>{dataCount > 0 ? t('Ready to import!', 'រុករាល់សម្រាប់ការបញ្ចូល') : t('Waiting for a file...', 'កំពុងរង់ចាំទិន្នន័យ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-3 text-gray-500 font-black text-xs hover:text-gray-900 hover:bg-white rounded-xl transition-all disabled:opacity-50"
            >
              {t('Cancel', 'បោះបង់')}
            </button>
            {dataCount > 0 && (
              <button 
                onClick={onConfirm}
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[13px] shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('Importing...', 'កំពុងនាំចូល...')}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    {t('Start Import', 'បញ្ជាក់ការនាំចូល')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
