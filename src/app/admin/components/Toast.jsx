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
          className="fixed top-5 right-5 z-[100] flex items-center gap-3 p-3 pr-4 bg-white/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-lg rounded-xl"
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
            type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
          }`}>
            {type === 'success' ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <XCircleIcon className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
              {type === 'success' ? 'Success' : 'Error'}
            </h4>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
