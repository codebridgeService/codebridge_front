'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaUsers, FaTools } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProjectCard({ project }) {
  const router = useRouter();

  return (
    <motion.div
      onClick={() => router.push(`/portfolio/${project.id}`)}
      className="bg-[color:var(--bg-secondary)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-[color:var(--border-main)] flex flex-col h-full group cursor-pointer"
      whileHover={{ y: -6 }}
    >
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.image || "/placeholder-project.png"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-[color:var(--bg-secondary)]/90 backdrop-blur-sm rounded-full text-[9px] font-bold text-[color:var(--color-primary)] shadow-sm transition-colors duration-300">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow gap-4">
        <div>
          <h4 className="font-black text-lg text-[color:var(--text-main)] tracking-tight mb-2 group-hover:text-[color:var(--color-primary)] transition-all duration-300 uppercase">
            {project.title}
          </h4>
          <p className="text-xs font-bold text-[color:var(--text-muted)] uppercase tracking-widest mb-4 transition-colors duration-300">
             {project.category}
          </p>
        </div>

        <div className="flex-grow">
          <p className="text-sm text-[color:var(--text-muted)] leading-relaxed font-medium line-clamp-3 transition-colors duration-300">
            {project.description}
          </p>
        </div>

        {/* Action & Metadata */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[color:var(--border-main)] transition-colors duration-300">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-[color:var(--text-muted)]/40 uppercase tracking-widest mb-0.5 transition-colors duration-300">ESTABLISHED</span>
              <span className="text-[10px] font-black text-[color:var(--text-main)] uppercase transition-colors duration-300">
                {project.createdAt ? new Date(project.createdAt).getFullYear() : new Date().getFullYear()}
              </span>
           </div>
           
           <div className="flex items-center gap-3">
             {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2 bg-[color:var(--text-main)] text-[color:var(--bg-main)] text-[10px] font-black rounded-xl hover:bg-[color:var(--color-primary)] hover:text-white transition-all shadow-lg shadow-[color:var(--color-primary)]/10 active:scale-95 uppercase tracking-widest"
                >
                  {project.link.includes('github.com') ? <FaGithub className="h-3.5 w-3.5" /> : <FaExternalLinkAlt className="h-3 w-3" />}
                  Live View
                </a>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}