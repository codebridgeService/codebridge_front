'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { userService } from '../../store/userService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  UserGroupIcon, 
  TrashIcon, 
  UserCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import DeleteModal from '../components/modals/DeleteModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const spring = {
    type: "spring",
    stiffness: 400,
    damping: 35,
    mass: 1
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (user.name?.toLowerCase().includes(search.toLowerCase())) || 
      (user.email?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [users, search]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const nonAdminUsers = filteredUsers.filter(u => u.role !== 'admin');
    if (selectedIds.length === nonAdminUsers.length && nonAdminUsers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(nonAdminUsers.map(u => u.id));
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
        await Promise.all(selectedIds.map(id => userService.deleteUser(id)));
        setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)));
        setSelectedIds([]);
      } else {
        await userService.deleteUser(itemToDelete.id);
        setUsers(prev => prev.filter(u => u.id !== itemToDelete.id));
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
        className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center text-white shadow-lg">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{t('User Management', 'គ្រប់គ្រងអ្នកប្រើប្រាស់')}</h1>
            <p className="text-[10px] font-black text-[color:var(--color-primary)]/60 uppercase tracking-widest mt-1.5">
              {users.length} {t('Active Accounts', 'គណនីសរុប')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[color:var(--color-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search users...', 'ស្វែងរក...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-5 py-2.5 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:bg-white transition-all text-xs font-bold w-56"
            />
          </div>

          {selectedIds.length > 0 && (
            <button 
              onClick={() => handleDeleteRequest(null, null, true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm border border-red-100"
            >
              <TrashIcon className="w-4 h-4" />
              <span>{t('Delete', 'លុប')} ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Kinetic List Display (High Density) */}
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-24 text-center animate-pulse text-[8px] font-black text-gray-300 uppercase tracking-widest">Hydrating Sessions...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white/50 border border-white/40 rounded-[1.5rem] p-12 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
               No Users Found
            </div>
          ) : (
            <motion.div layout className="space-y-2">
              {filteredUsers.map((user, idx) => (
                <motion.div 
                  key={user.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: idx * 0.02 }}
                  className="group bg-white/80 backdrop-blur-xl border border-white/60 p-4 pl-5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-[color:var(--color-primary)]/30 transition-all flex items-center justify-between gap-5 relative overflow-hidden"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                     {user.role !== 'admin' ? (
                       <button
                          onClick={(e) => { e.stopPropagation(); toggleSelection(user.id); }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${
                            selectedIds.includes(user.id) 
                              ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white' 
                              : 'border-gray-200 text-transparent hover:border-[color:var(--color-primary)]/50 bg-white shadow-inner'
                          }`}
                       >
                         <CheckIcon className="w-4 h-4" strokeWidth={3} />
                       </button>
                     ) : (
                       <div className="w-6 h-6 shrink-0"></div>
                     )}

                     <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)] group-hover:text-white transition-all shrink-0 shadow-inner overflow-hidden">
                       {user.image ? (
                         <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                       ) : user.role === 'admin' ? (
                         <ShieldCheckIcon className="w-6 h-6" />
                       ) : (
                         <UserIcon className="w-6 h-6" />
                       )}
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-sm font-black text-[color:var(--color-primary)] tracking-tight uppercase leading-none">{user.name}</h3>
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-600' 
                                : 'bg-emerald-100 text-emerald-600'
                           }`}>
                             {user.role}
                           </span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 leading-snug truncate max-w-lg ">
                          {user.email}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-8 pr-2">
                     <div className="hidden md:flex flex-col items-end">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">JOINED</p>
                        <p className="text-[10px] font-black text-[color:var(--color-primary)] uppercase tracking-widest">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                     </div>
                     
                     <div className="flex items-center gap-2 border-l border-gray-100 pl-6 py-2">
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteRequest(user.id, user.name)} 
                            className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm z-10 relative"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                     </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={itemToDelete?.isBulk ? t('Bulk Delete Users', 'លុបអ្នកប្រើប្រាស់ជាក្រុម') : t('Delete User', 'លុបអ្នកប្រើប្រាស់')}
        itemName={itemToDelete?.isBulk ? `${selectedIds.length} users` : itemToDelete?.title}
        loading={isDeleting}
      />
    </div>
  );
}
