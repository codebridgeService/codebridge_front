'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { CommandLineIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { getEncryptedHref } from '@/lib/routeCipher';

// High-tech technology stack mapper based on project category and context
function getTechStack(category, title) {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (cat.includes('mobile') || cat.includes('app')) return ['Flutter', 'REST API', 'iOS & Android'];
  if (cat.includes('erp') || cat.includes('pos') || cat.includes('system') || cat.includes('management')) return ['PostgreSQL', 'Microservices', 'Docker'];
  if (cat.includes('e-commerce') || cat.includes('shop')) return ['Next.js', 'Payment Gateway', 'Edge CDN'];
  if (cat.includes('ui') || cat.includes('design')) return ['Figma', 'Atomic Design', 'Design System'];
  if (t.includes('web') || cat.includes('web')) return ['Next.js 15', 'TypeScript', 'Node.js'];
  return ['Full-Stack', 'Cloud Native', 'API Integration'];
}

export default function ProjectCard({ project }) {
  const router = useRouter();
  const techStack = getTechStack(project.category, project.title);

  return (
    <motion.div
      onClick={() => router.push(getEncryptedHref(`/portfolio/${project.encryptedId || project.id}`))}
      className="relative bg-[color:var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[color:var(--border-main)] flex flex-col h-full group cursor-pointer"
      whileHover={{ y: -4 }}
    >
      {/* Cyber Corner Accents */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70 pointer-events-none z-20" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[color:var(--border-main)] group-hover:border-[color:var(--color-primary)] transition-colors opacity-70 pointer-events-none z-20" />

      {/* Image Container */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={project.image || "/placeholder-project.png"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Live Production Telemetry Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-mono font-bold text-white shadow-sm border border-white/10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="tracking-widest uppercase">PROD LIVE</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[color:var(--bg-secondary)]/90 backdrop-blur-sm rounded-md text-[8px] font-mono font-bold text-[color:var(--color-primary)] shadow-sm border border-[color:var(--border-main)] transition-colors duration-300 uppercase">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow gap-2.5">
        <div>
          <h4 className="font-black text-base text-[color:var(--text-main)] tracking-tight mb-1 group-hover:text-[color:var(--color-primary)] transition-all duration-300 uppercase">
            {project.title}
          </h4>
          <p className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-widest transition-colors duration-300">
             {project.category}
          </p>
        </div>

        <div className="flex-grow">
          <p className="text-xs text-[color:var(--text-muted)] leading-relaxed font-medium line-clamp-2 transition-colors duration-300">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Chip Strip */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <CommandLineIcon className="w-3 h-3 text-[color:var(--color-primary)] opacity-70 shrink-0 mr-0.5" />
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[color:var(--bg-main)] text-[color:var(--text-secondary)] border border-[color:var(--border-main)] shadow-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action & Metadata */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[color:var(--border-main)] transition-colors duration-300">
           <div className="flex items-center gap-1.5">
              <CpuChipIcon className="w-3.5 h-3.5 text-[color:var(--text-muted)] opacity-60 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[7px] font-mono font-bold text-[color:var(--text-muted)]/70 uppercase tracking-widest">DEPLOYED</span>
                <span className="text-[9px] font-mono font-black text-[color:var(--text-main)] uppercase transition-colors duration-300">
                  {project.createdAt ? new Date(project.createdAt).getFullYear() : new Date().getFullYear()}
                </span>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
             {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[color:var(--text-main)] text-[color:var(--bg-main)] text-[9px] font-black rounded-lg hover:bg-[color:var(--color-primary)] hover:text-white transition-all shadow-md active:scale-95 uppercase tracking-wider"
                >
                  {project.link.includes('github.com') ? <FaGithub className="h-3 w-3" /> : <FaExternalLinkAlt className="h-2.5 w-2.5" />}
                  Live View
                </a>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}