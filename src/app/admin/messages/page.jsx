'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  RotateCw, 
  Search, 
  AlertTriangle, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiFetch } from '@/lib/api';

export default function MessageCenterPage() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const spring = {
    type: 'spring',
    stiffness: 400,
    damping: 35,
    mass: 1
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/messages');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
          // If no message selected and data has items, select first
          if (!selectedMessage && data.length > 0) {
            setSelectedMessage(data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (message) => {
    const newStatus = message.status === 'read' ? 'unread' : 'read';
    try {
      const res = await apiFetch(`/admin/messages/${message.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages(prev => prev.map((m) => (m.id === message.id ? { ...m, status: newStatus } : m)));
        if (selectedMessage?.id === message.id) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteRequest = (id, info) => {
    setItemToDelete({ id, info });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await apiFetch(`/admin/messages/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages(prev => prev.filter((m) => m.id !== itemToDelete.id));
        setShowDeleteModal(false);
        setItemToDelete(null);
        if (selectedMessage?.id === itemToDelete.id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const name = m.name || '';
      const email = m.email || '';
      const msg = m.message || '';
      const matchesSearch = [name, email, msg].some(v => v.toLowerCase().includes(search.toLowerCase()));
      if (filter === 'unread') return matchesSearch && m.status === 'unread';
      if (filter === 'read') return matchesSearch && m.status === 'read';
      return matchesSearch;
    });
  }, [messages, search, filter]);

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-3.5 pb-8">
      {/* 1. Header Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xs rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sticky top-4 z-40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050C3] to-[#0088FE] flex items-center justify-center text-white shadow-2xs shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('Message Center', 'មជ្ឈមណ្ឌលសារ')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{messages.length} {t('Total Messages', 'សារសរុប')} • {unreadCount} {t('Unread', 'មិនទាន់អាន')}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search messages...', 'ស្វែងរកសារ...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-48 sm:w-60"
            />
          </div>
          
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === f 
                    ? 'bg-white text-[#0050C3] shadow-2xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? t('All', 'ទាំងអស់') : f === 'unread' ? t('Unread', 'មិនទាន់អាន') : t('Read', 'បានអាន')}
              </button>
            ))}
          </div>

          <button 
            type="button"
            onClick={fetchMessages} 
            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 shadow-2xs rounded-xl text-slate-600 transition-all cursor-pointer"
            title={t('Refresh', 'ផ្ទុកឡើងវិញ')}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* 2. Inbox Split View */}
      <div className="grid lg:grid-cols-12 gap-3.5 items-start">
        {/* Left List Pane */}
        <div className="lg:col-span-5 h-[76vh] overflow-y-auto no-scrollbar pr-0.5 space-y-2">
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="py-20 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('Loading Messages...', 'កំពុងទាញយកសារ...')}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-xs font-bold text-slate-400 shadow-2xs">
                  {t('No messages found', 'មិនមានសារ')}
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  const isUnread = msg.status === 'unread';

                  return (
                    <motion.div 
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-blue-50/80 border-[#0050C3] shadow-sm ring-1 ring-[#0050C3]/20' 
                          : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {isUnread && !isSelected && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-[#0050C3] rounded-full"></div>
                      )}
                      
                      <div className="flex gap-2.5 items-center mb-1.5">
                        <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                          isSelected 
                            ? 'bg-[#0050C3] text-white shadow-2xs' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#0050C3] transition-colors'
                        }`}>
                          {msg.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <h3 className={`text-xs truncate ${isUnread ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                              {msg.name}
                            </h3>
                            {isUnread && (
                              <span className="text-[8px] font-black uppercase px-1 py-0.2 bg-blue-100 text-[#0050C3] rounded">NEW</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-normal truncate">
                            {msg.email}
                          </p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono self-start mt-0.5">
                          {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-normal line-clamp-2 pl-10.5 leading-relaxed">
                        {msg.message}
                      </p>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>

        {/* Right View Details Pane */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div 
                key={selectedMessage.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={spring}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden min-h-[76vh] flex flex-col"
              >
                {/* Message Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0050C3] border border-blue-200/60 flex items-center justify-center font-bold text-sm shadow-2xs">
                      {selectedMessage.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">{selectedMessage.name}</h2>
                      <a href={`mailto:${selectedMessage.email}`} className="text-xs font-semibold text-[#0050C3] hover:underline flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{selectedMessage.email}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      type="button"
                      onClick={() => handleToggleRead(selectedMessage)} 
                      className="p-1.5 border border-slate-200/80 rounded-xl bg-slate-50 text-slate-600 hover:text-[#0050C3] hover:bg-white hover:border-[#0050C3]/30 transition-all cursor-pointer shadow-2xs" 
                      title={selectedMessage.status === 'unread' ? t('Mark as Read', 'សម្គាល់ថាបានអាន') : t('Mark as Unread', 'សម្គាល់ថាមិនទាន់អាន')}
                    >
                      {selectedMessage.status === 'unread' ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteRequest(selectedMessage.id, selectedMessage.name)} 
                      className="p-1.5 border border-rose-200 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all shadow-2xs cursor-pointer"
                      title={t('Delete Message', 'លុបសារ')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Meta Strip */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-x-5 gap-y-1 text-[10px] font-semibold text-slate-500 px-5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#0050C3]" />
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>ID: {selectedMessage.id}</span>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-slate-50/30">
                  <div className="bg-white p-5 rounded-2xl shadow-2xs border border-slate-200/80 space-y-3">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-[#0050C3] border border-blue-200/60 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {t('Message Content', 'ខ្លឹមសារសារ')}
                    </span>
                    <p className="text-slate-800 font-normal leading-relaxed text-xs whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="mt-5">
                    <motion.a 
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      href={`mailto:${selectedMessage.email}`}
                      className="w-full py-2.5 bg-gradient-to-r from-[#0050C3] to-[#0088FE] hover:brightness-105 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('Reply via Email Client', 'ឆ្លើយតបសារតាមរយៈ Email')}</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[76vh] bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center text-center px-10 shadow-2xs">
                <Mail className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Select an inquiry to view details', 'ជ្រើសរើសសារដើម្បីមើលព័ត៌មានលម្អិត')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal (Crisp Light Theme) */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" 
              onClick={() => !isDeleting && setShowDeleteModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }} 
              className="relative w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-xl border border-slate-200/80"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{t('Delete Message?', 'លុបសារនេះ?')}</h3>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                {t(`Are you sure you want to delete message from "${itemToDelete?.info}"? This action cannot be undone.`, `តើអ្នកប្រាកដជាចង់លុបសារពី "${itemToDelete?.info}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`)}
              </p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowDeleteModal(false)} 
                  disabled={isDeleting} 
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  {t('Cancel', 'បោះបង់')}
                </button>
                <button 
                  type="button"
                  onClick={confirmDelete} 
                  disabled={isDeleting} 
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? t('Deleting...', 'កំពុងលុប...') : t('Delete', 'លុប')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
