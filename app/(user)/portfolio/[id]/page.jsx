'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, TagIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projectService } from '../../../store/projectService';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      projectService.getProject(id)
        .then(data => {
          setProject(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load project details.');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[color:var(--bg-main)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[color:var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[color:var(--bg-main)] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-[color:var(--text-main)] mb-4 uppercase tracking-tighter">Project Not Found</h1>
        <p className="text-[color:var(--text-muted)] mb-8">{error || "The project you're looking for doesn't exist or has been removed."}</p>
        <button 
          onClick={() => router.push('/portfolio')}
          className="px-8 py-4 bg-[color:var(--text-main)] text-[color:var(--bg-main)] rounded-full font-black uppercase tracking-widest text-xs hover:bg-[color:var(--color-primary)] hover:text-white transition-all shadow-xl"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--bg-main)] pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Navigation & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link 
            href="/#portfolio" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)] transition-all mb-8 shadow-sm"
          >
            <ArrowLeftIcon className="w-3 h-3" /> Back
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <TagIcon className="w-3 h-3" /> {project.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[color:var(--text-main)] uppercase tracking-tighter leading-none mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-[color:var(--text-muted)] font-medium leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>
            
            {project.link && (
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-6 py-4 bg-[color:var(--color-primary)] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-[color:var(--color-primary)]/20 hover:-translate-y-1 transition-all"
              >
                Visit Live Site <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl border border-[color:var(--border-main)] bg-[color:var(--bg-secondary)]"
        >
          <img 
            src={project.image || "/placeholder-project.png"} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content Body (Markdown) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-[color:var(--color-primary)] max-w-none bg-[color:var(--bg-secondary)] p-8 md:p-12 rounded-[3rem] border border-[color:var(--border-main)] shadow-xl"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.content || "No detailed case study was provided for this project."}
          </ReactMarkdown>
        </motion.div>

      </div>
    </main>
  );
}
