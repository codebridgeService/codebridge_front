import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function Toast({ show, message, type = 'success' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-8 right-8 z-[100] flex items-center gap-4 p-4 pr-6 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl"
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
            type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
          }`}>
            {type === 'success' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <XCircleIcon className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">
              {type === 'success' ? 'Success' : 'Error'}
            </h4>
            <p className="text-sm font-medium text-gray-500">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
