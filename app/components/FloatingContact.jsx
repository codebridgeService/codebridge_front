'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaTelegramPlane, FaFacebookMessenger } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingContact() {
  const pathname = usePathname();

  // Don't show floating contact on admin or login pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }
  const contacts = [
    {
      name: 'Telegram',
      icon: <FaTelegramPlane className="h-5 w-5" />,
      url: 'https://t.me/codebridgee',
      color: 'bg-[#26A5E4]',
      shadow: 'shadow-[#26A5E4]/40',
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger className="h-5 w-5" />,
      url: 'https://m.me/61563715387398',
      color: 'bg-gradient-to-br from-[#0695FF] via-[#A334FA] to-[#FF6968]',
      shadow: 'shadow-[#A334FA]/40',
    },
  ];

  return (
    <div className="fixed bottom-[100px] right-8 z-50 flex flex-col gap-3">
      {contacts.map((contact, index) => (
        <motion.a
            key={contact.name}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5, x: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              transition: { delay: index * 0.1 }
            }}
            exit={{ opacity: 0, scale: 0.5, x: 20 }}
            whileHover={{ y: -5, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full ${contact.color} text-white flex items-center justify-center shadow-lg ${contact.shadow} transition-all duration-300 border border-white/20 backdrop-blur-sm group relative`}
            aria-label={`Contact on ${contact.name}`}
          >
            {contact.icon}
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
              {contact.name}
            </span>
          </motion.a>
        ))}
    </div>
  );
}
