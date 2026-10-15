'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '@/store/userService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Users, 
  Trash2, 
  Search, 
  Check, 
  ShieldCheck, 
  User, 
  RotateCw,
  AlertTriangle
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, ADMIN, USER
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const adminCount = useMemo(
    () => users.filter(u => u.role === 'admin').length,
    [users]
  );
  const memberCount = useMemo(
    () => users.filter(u => u.role !== 'admin').length,
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.name || '';
      const email = user.email || '';

      const matchesSearch = 
        name.toLowerCase().includes(search.toLowerCase()) || 
        email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = 
        roleFilter === 'ALL' ||
        (roleFilter === 'ADMIN' && user.role === 'admin') ||
        (roleFilter === 'USER' && user.role !== 'admin');

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

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
      alert(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{t('User Management', 'គ្រប់គ្រងអ្នកប្រើប្រាស់')}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {users.length} {t('Active Accounts', 'គណនីសរុប')} • {adminCount} {t('Admins', 'អភិបាល')} • {memberCount} {t('Standard Users', 'សមាជិក')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0050C3] transition-colors" />
            <input 
              type="text" 
              placeholder={t('Search users...', 'ស្វែងរកអ្នកប្រើប្រាស់...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050C3]/20 focus:bg-white transition-all text-xs font-semibold w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 transition-all shadow-2xs cursor-pointer"
            title={t('Refresh', 'ផ្ទុកឡើងវិញ')}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
        </div>
      </motion.div>

      {/* 2. Metrics & Role Filters */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">{t('Accounts Breakdown:', 'ស្ថានភាពគណនី:')}</span>
          <span className="text-[#0050C3] font-bold">{adminCount} {t('Admins', 'អភិបាល')}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">{memberCount} {t('Users', 'អ្នកប្រើ')}</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRoleFilter('ALL')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              roleFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('All', 'ទាំងអស់')} ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              roleFilter === 'ADMIN'
                ? 'bg-[#0050C3] text-white shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-[#0050C3]'
            }`}
          >
            {t('Admins', 'អភិបាល')} ({adminCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('USER')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              roleFilter === 'USER'
                ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            {t('Users', 'អ្នកប្រើ')} ({memberCount})
          </button>
        </div>
      </div>

      {/* 3. Users List Display */}
      {loading ? (
        <div className="py-16 text-center animate-pulse text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Loading Users...', 'កំពុងទាញយកអ្នកប្រើប្រាស់...')}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs font-bold text-slate-400 shadow-2xs">
          {t('No users found matching your search', 'រកមិនឃើញអ្នកប្រើប្រាស់ឡើយ')}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const isAdmin = user.role === 'admin';
            const dateStr = user.createdAt || user.created_at;

            return (
              <motion.div 
                key={user.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white border border-slate-200/80 p-3 pl-3.5 rounded-2xl shadow-2xs hover:shadow-xs hover:border-[#0050C3]/30 transition-all flex items-center justify-between gap-3.5 relative overflow-hidden"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {!isAdmin ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSelection(user.id); }}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors cursor-pointer ${
                        selectedIds.includes(user.id) 
                          ? 'bg-[#0050C3] border-[#0050C3] text-white' 
                          : 'border-slate-300 text-transparent hover:border-[#0050C3]/50 bg-white'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                  ) : (
                    <div className="w-5 h-5 shrink-0"></div>
                  )}

                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0050C3] group-hover:bg-[#0050C3] group-hover:text-white transition-all shrink-0 border border-slate-100 overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : isAdmin ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0050C3] transition-colors truncate">
                        {user.name}
                      </h3>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isAdmin 
                          ? 'bg-blue-50 text-[#0050C3] border border-blue-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-normal truncate max-w-lg">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pr-1">
                  <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">JOINED</p>
                    <p className="text-xs font-mono font-medium text-slate-700">
                      {dateStr ? new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 py-1">
                    {!isAdmin ? (
                      <button 
                        type="button"
                        onClick={() => handleDeleteRequest(user.id, user.name)} 
                        className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-2xs border border-rose-100 cursor-pointer"
                        title={t('Delete User', 'លុបអ្នកប្រើ')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                        PROTECTED
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-slate-200/80 text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {itemToDelete?.isBulk ? t('Bulk Delete Users?', 'លុបអ្នកប្រើប្រាស់ជាក្រុម?') : t('Delete User Account?', 'លុបគណនីអ្នកប្រើប្រាស់?')}
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {t(
                  `Are you sure you want to delete ${itemToDelete?.isBulk ? `${selectedIds.length} users` : `"${itemToDelete?.title}"`}? This action cannot be undone.`,
                  `តើអ្នកប្រាកដជាចង់លុប ${itemToDelete?.isBulk ? `${selectedIds.length} នាក់` : `"${itemToDelete?.title}"`} មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
                )}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {t('Cancel', 'បោះបង់')}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs cursor-pointer disabled:opacity-50"
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
