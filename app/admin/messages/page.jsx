'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  EnvelopeIcon, 
  EnvelopeOpenIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../store/authService";

export default function MessageCenterPage() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const t = (en, kh) => (lang === "kh" ? kh : en);

  const spring = {
    type: "spring",
    stiffness: 400,
    damping: 35,
    mass: 1
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: authService.getAuthHeader(),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (message) => {
    const newStatus = message.status === "read" ? "unread" : "read";
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages(prev => prev.map((m) => (m.id === message.id ? { ...m, status: newStatus } : m)));
        if (selectedMessage?.id === message.id) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
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
      const res = await fetch(`/api/admin/messages/${itemToDelete.id}`, {
        method: "DELETE",
        headers: authService.getAuthHeader(),
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
      console.error("Failed to delete message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch = [m.name, m.email, m.message].some(v => v.toLowerCase().includes(search.toLowerCase()));
      if (filter === 'unread') return matchesSearch && m.status === 'unread';
      if (filter === 'read') return matchesSearch && m.status === 'read';
      return matchesSearch;
    });
  }, [messages, search, filter]);

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--color-primary)] flex items-center justify-center text-white shadow-xl">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('Message Center', 'មជ្ឈមណ្ឌលសារ')}</h1>
            <p className="text-[11px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-primary)]/40 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[color:var(--color-primary)]"></span></span>
              {t(`${unreadCount} unread inbox`, `${unreadCount} សារមិនទាន់អាន`)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search messages...', 'ស្វែងរកសារ...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-5 py-3.5 bg-white border border-gray-100 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xs font-bold w-64 shadow-sm"
            />
          </div>
          
          <div className="flex gap-1.5 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-xl">
             {['all', 'unread'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === f ? 'bg-white text-[color:var(--color-primary)] shadow-sm' : 'text-gray-500 hover:text-[color:var(--color-primary)]'
                 }`}
               >
                 {t(f, f === 'all' ? 'ទាំងអស់' : 'មិនទាន់អាន')}
               </button>
             ))}
          </div>

          <button onClick={fetchMessages} className="p-3.5 bg-white border border-gray-100 shadow-sm rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95">
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-4 items-start">
        {/* List Pane */}
        <div className="lg:col-span-4 h-[78vh] overflow-y-auto no-scrollbar pr-1 pb-10">
           <LayoutGroup>
             <AnimatePresence mode="popLayout">
               {loading ? (
                 <div className="py-24 text-center animate-pulse text-[8px] font-black text-gray-300 uppercase tracking-widest">LOADING...</div>
               ) : filteredMessages.length === 0 ? (
                 <div className="bg-white/50 border border-white/40 rounded-[1.5rem] p-12 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    No Records
                 </div>
               ) : (
                  <motion.div layout className="space-y-3">
                    {filteredMessages.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-5 rounded-[1.5rem] border cursor-pointer transition-all relative overflow-hidden group ${
                          selectedMessage?.id === msg.id 
                            ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white shadow-xl scale-[1.02]' 
                            : 'bg-white/80 backdrop-blur-md border-white/60 shadow-sm hover:border-blue-200 hover:shadow-md'
                        }`}
                      >
                        {msg.status === 'unread' && selectedMessage?.id !== msg.id && (
                          <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        )}
                        <div className="flex gap-4 items-center mb-2.5">
                           <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-sm uppercase ${selectedMessage?.id === msg.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[color:var(--color-primary)]/10 group-hover:text-[color:var(--color-primary)] transition-colors'}`}>
                             {msg.name.charAt(0)}
                           </div>
                           <div className="flex-1 min-w-0 pr-4">
                              <h3 className={`text-[13px] font-black truncate mb-0.5 ${selectedMessage?.id === msg.id ? 'text-white' : 'text-[color:var(--color-primary)]'}`}>
                                {msg.name}
                              </h3>
                              <p className={`text-[10px] font-black uppercase tracking-widest truncate ${selectedMessage?.id === msg.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                {msg.email}
                              </p>
                           </div>
                           <span className={`text-[9px] font-black uppercase tracking-widest opacity-60 self-start mt-1`}>
                             {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                        <p className={`text-xs font-medium line-clamp-2 pl-16 leading-relaxed ${selectedMessage?.id === msg.id ? 'text-white/80' : 'text-gray-500'}`}>
                          "{msg.message}"
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
               )}
             </AnimatePresence>
           </LayoutGroup>
        </div>

        {/* View Pane */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             {selectedMessage ? (
               <motion.div 
                 key={selectedMessage.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={spring}
                 className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-2xl overflow-hidden min-h-[78vh] flex flex-col"
               >
                 <div className="p-8 pb-6 border-b border-gray-100 flex items-start justify-between bg-white/40">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-[1.25rem] bg-[color:var(--color-primary)] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[color:var(--color-primary)]/30">
                         {selectedMessage.name.charAt(0)}
                       </div>
                        <div>
                           <h2 className="text-2xl font-black text-[color:var(--color-primary)] leading-none mb-2 tracking-tight">{selectedMessage.name}</h2>
                           <a href={`mailto:${selectedMessage.email}`} className="text-[11px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest hover:underline flex items-center gap-1.5">
                              <EnvelopeIcon className="w-3.5 h-3.5" />
                              {selectedMessage.email}
                           </a>
                        </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleToggleRead(selectedMessage)} className="p-3.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all" title={selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}>
                         {selectedMessage.status === 'unread' ? <EnvelopeOpenIcon className="w-5 h-5" /> : <EnvelopeIcon className="w-5 h-5" />}
                       </button>
                       <button onClick={() => handleDeleteRequest(selectedMessage.id, selectedMessage.name)} className="p-3.5 border border-rose-100 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                         <TrashIcon className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-10">
                    <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-[color:var(--color-primary)]" />{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                    <div className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-emerald-500" />ID: {selectedMessage.id}</div>
                 </div>

                 <div className="p-10 flex-1 flex flex-col bg-white/30">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex-1 relative">
                       <span className="absolute -top-3.5 left-8 px-5 py-1.5 bg-[color:var(--color-primary)] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                         {t('Message Content', 'ខ្លឹមសារសារ')}
                       </span>
                       <p className="text-gray-800 font-medium leading-loose text-base whitespace-pre-wrap mt-3">
                         {selectedMessage.message}
                       </p>
                    </div>

                    <div className="mt-8">
                       <motion.a 
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         href={`mailto:${selectedMessage.email}`}
                         className="w-full py-5 bg-[color:var(--color-primary)] text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl group hover:shadow-[color:var(--color-primary)]/30"
                       >
                         <PaperAirplaneIcon className="w-6 h-6 -rotate-12 group-hover:rotate-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                         {t('REPLY TO INQUIRY', 'ឆ្លើយតបសារ')}
                       </motion.a>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="h-[78vh] flex flex-col items-center justify-center text-center px-10 opacity-30">
                  <EnvelopeIcon className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select an inquiry to read</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-950/60 backdrop-blur-xl" onClick={() => !isDeleting && setShowDeleteModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 text-center shadow-4xl"
            >
              <ExclamationTriangleIcon className="w-10 h-10 text-rose-500 mx-auto mb-4" />
              <h3 className="text-base font-black text-[color:var(--color-primary)] mb-2 uppercase tracking-tight">{t('Delete Message?', 'លុបសារនេះ?')}</h3>
              <p className="text-gray-500 text-[10px] mb-8 font-black uppercase tracking-widest opacity-60 leading-relaxed px-4">
                {t(`Confirm deletion for "${itemToDelete?.info}"`, `បញ្ជាក់ការលុបសារពី "${itemToDelete?.info}"`)}
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={confirmDelete} disabled={isDeleting} className="w-full py-4 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg">
                  {isDeleting ? t('DELETING...', 'កំពុងលុប...') : t('CONFIRM DELETE', 'បញ្ជាក់ការលុប')}
                </button>
                <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} className="w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[color:var(--color-primary)] transition-all">
                  {t('CANCEL', 'បោះបង់')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
