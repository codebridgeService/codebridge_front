'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CommandLineIcon, 
  CpuChipIcon, 
  ShieldCheckIcon, 
  ServerStackIcon, 
  CodeBracketIcon, 
  LockClosedIcon,
  CloudArrowUpIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

const DOCS_SECTIONS = [
  {
    id: 'architecture',
    title: 'Core Architecture',
    titleKh: 'ស្ថាបត្យកម្មប្រព័ន្ធស្នូល',
    icon: ServerStackIcon,
    badge: 'V2.4 SPEC',
    description: 'High-performance full-stack ecosystem built on distributed serverless nodes and containerized backend clusters.',
    descriptionKh: 'ប្រព័ន្ធបច្ចេកវិទ្យាដែលមានសមត្ថភាពដំណើរការខ្ពស់ ផ្អែកលើបច្ចេកវិទ្យា Serverless និង Containerized Clusters។',
    highlights: [
      { label: 'Frontend Runtime', val: 'Next.js 15 (Turbopack Engine, React 19 SSR)' },
      { label: 'API Services', val: 'Node.js Microservices / RESTful JSON / Webhooks' },
      { label: 'Database Layer', val: 'MongoDB Replica Sets & PostgreSQL High Availability' },
      { label: 'Global CDN & Edge', val: 'Cloudflare Edge DNS / Anycast Global Routing' },
    ],
    codeSnippet: `// CodeBridges Architecture Standard
export const SystemConfig = {
  runtime: 'nodejs-edge',
  scaling: 'auto-horizontal',
  cdnCache: 'stale-while-revalidate',
  telemetry: 'apm-active'
};`,
  },
  {
    id: 'security',
    title: 'Security & Cryptography',
    titleKh: 'ស្តង់ដារសុវត្ថិភាព និងការការពារ',
    icon: ShieldCheckIcon,
    badge: 'OWASP LEVEL 3',
    description: 'Defense-in-depth framework with cryptographic payload encryption and automated intrusion blocking.',
    descriptionKh: 'ក្របខ័ណ្ឌការពារសន្តិសុខទិន្នន័យពហុជាន់ រួមទាំងការការពារការវាយប្រហារដោយស្វ័យប្រវត្តិ។',
    highlights: [
      { label: 'Payload Encryption', val: 'AES-256-GCM authenticated cipher for sensitive states' },
      { label: 'Transport Security', val: 'TLS 1.3 Strict HSTS with automated certificate renewal' },
      { label: 'Credential Hashing', val: 'Argon2id cryptographic memory-hard standard' },
      { label: 'Threat Mitigation', val: 'Automated IP rate limiting & SQLi/XSS sanitization' },
    ],
    codeSnippet: `// Security Transport Cipher Standard
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
cipher.setAAD(Buffer.from('CODEBRIDGES_SECURE_AUTH'));
const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
const tag = cipher.getAuthTag();`,
  },
  {
    id: 'sdlc',
    title: 'Engineering Pipeline',
    titleKh: 'វដ្តអភិវឌ្ឍន៍សូហ្វវែរ (SDLC)',
    icon: CommandLineIcon,
    badge: 'CI/CD ACTIVE',
    description: 'Continuous integration and continuous deployment delivering verified releases with zero downtime.',
    descriptionKh: 'ដំណើរការបញ្ជូនកូដស្វ័យប្រវត្តិ ធានាការដាក់ឱ្យប្រើប្រាស់ដោយគ្មានការរំខានដល់ប្រព័ន្ធ។',
    highlights: [
      { label: 'Version Control', val: 'Git feature-branching with strict peer review policies' },
      { label: 'Automated Testing', val: 'Linting, unit tests, and integration smoke validation' },
      { label: 'Container Builds', val: 'Docker multi-stage builds with minimal alpine base images' },
      { label: 'Deployment Strategy', val: 'Rolling zero-downtime updates & blue-green validation' },
    ],
    codeSnippet: `# CI/CD Production Pipeline
name: Deploy Production
on:
  push:
    branches: [ master ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build`,
  },
  {
    id: 'api',
    title: 'API & Integrations',
    titleKh: 'ចំណុចប្រទាក់ API និងប្រព័ន្ធភ្ជាប់',
    icon: CodeBracketIcon,
    badge: 'REST / JSON',
    description: 'Clean, predictable endpoints designed for rapid mobile, web, and external enterprise system connectivity.',
    descriptionKh: 'API ស្ដង់ដារដែលមានភាពច្បាស់លាស់ ងាយស្រួលតភ្ជាប់ជាមួយកម្មវិធីទូរស័ព្ទ និងប្រព័ន្ធខាងក្រៅ។',
    highlights: [
      { label: 'Authentication', val: 'Stateless Bearer JWT tokens with rolling refresh tokens' },
      { label: 'Error Formatting', val: 'RFC 7807 compliant standardized problem payloads' },
      { label: 'Pagination Standard', val: 'Cursor-based & limit/offset pagination' },
      { label: 'Telemetry Headers', val: 'X-Request-Id tracing across all microservice hops' },
    ],
    codeSnippet: `// Authenticated Client Request Example
const response = await fetch('https://api.codebridge.site/v1/projects', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'X-Client-Platform': 'mobile-ios'
  }
});`,
  },
];

export default function DocsPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [activeSection, setActiveSection] = useState('architecture');
  const [copiedId, setCopiedId] = useState(null);

  const activeDoc = DOCS_SECTIONS.find(s => s.id === activeSection) || DOCS_SECTIONS[0];

  const handleCopy = (code, id) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--bg-main)]/80 border border-[color:var(--border-main)] shadow-xs mb-3">
          <CommandLineIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
          <span className="text-[10px] font-mono font-bold text-[color:var(--text-main)] uppercase tracking-widest">
            {t('Technical Specifications', 'ឯកសារបច្ចេកទេស និងប្លង់ប្រព័ន្ធ')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[color:var(--text-main)] tracking-tight mb-2">
          {t('Engineering Documentation', 'ឯកសារស្ថាបត្យកម្មបច្ចេកវិទ្យា')}
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          {t(
            'Explore CodeBridges system architecture, cryptography protocols, API guidelines, and deployment engineering standards.',
            'ស្វែងយល់អំពីស្ថាបត្យកម្មប្រព័ន្ធ ស្តង់ដារសុវត្ថិភាព គោលការណ៍ API និងដំណើរការដាក់ឱ្យប្រើប្រាស់របស់ CodeBridges។'
          )}
        </p>
      </motion.div>

      {/* Docs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {DOCS_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isSelected = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[color:var(--bg-main)] border-[color:var(--color-primary)] shadow-md ring-1 ring-[color:var(--color-primary)]/30'
                    : 'bg-transparent border-[color:var(--border-main)]/70 hover:border-[color:var(--border-main)] hover:bg-[color:var(--bg-main)]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[color:var(--color-primary)] text-white' : 'bg-[color:var(--text-main)]/5 text-[color:var(--text-muted)] group-hover:text-[color:var(--color-primary)]'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[color:var(--text-main)]">
                      {t(section.title, section.titleKh)}
                    </span>
                    <span className="text-[9px] font-mono text-[color:var(--text-muted)] uppercase tracking-wider">
                      {section.badge}
                    </span>
                  </div>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isSelected ? 'bg-[color:var(--color-primary)] scale-125' : 'bg-transparent'
                }`} />
              </button>
            );
          })}

          {/* Direct Engineering Inquiry Card */}
          <div className="mt-4 p-5 rounded-2xl bg-transparent border border-[color:var(--border-main)]/60 text-center">
            <CpuChipIcon className="w-6 h-6 text-[color:var(--color-primary)] mx-auto mb-2" />
            <h4 className="text-xs font-bold text-[color:var(--text-main)] mb-1 uppercase tracking-tight">
              {t('Have Architecture Questions?', 'មានចម្ងល់អំពីប្លង់ប្រព័ន្ធ?')}
            </h4>
            <p className="text-[11px] text-[color:var(--text-muted)] mb-3 leading-relaxed">
              {t(
                'Connect directly with our lead architects to discuss custom enterprise specifications.',
                'ពិភាក្សាផ្ទាល់ជាមួយក្រុមវិស្វកររបស់យើងអំពីតម្រូវការបច្ចេកវិទ្យារបស់អ្នក។'
              )}
            </p>
            <a
              href="https://t.me/codebridgee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all"
            >
              <FaTelegramPlane className="w-3.5 h-3.5" />
              <span>{t('Chat on Telegram', 'ជជែកតាម Telegram')}</span>
            </a>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-8 p-5 sm:p-7 rounded-2xl bg-transparent border border-[color:var(--border-main)]/70 relative">
          {/* Cyber Corner Accents */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[color:var(--border-main)] opacity-70 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[color:var(--border-main)] opacity-70 pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[color:var(--border-main)]/50 mb-5">
            <div>
              <span className="text-[9px] font-mono font-bold text-[color:var(--color-primary)] uppercase tracking-wider">
                {activeDoc.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)] tracking-tight">
                {t(activeDoc.title, activeDoc.titleKh)}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[color:var(--bg-main)] text-[10px] font-mono text-[color:var(--text-muted)] border border-[color:var(--border-main)]/60 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              VERIFIED ARCHITECTURE
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed mb-6 font-medium">
            {t(activeDoc.description, activeDoc.descriptionKh)}
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {activeDoc.highlights.map((h, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[color:var(--bg-main)]/60 border border-[color:var(--border-main)]/50">
                <span className="text-[10px] font-mono font-bold text-[color:var(--color-primary)] uppercase tracking-wider block mb-1">
                  {h.label}
                </span>
                <span className="text-xs font-semibold text-[color:var(--text-main)] leading-relaxed">
                  {h.val}
                </span>
              </div>
            ))}
          </div>

          {/* Code Snippet Box */}
          <div className="rounded-xl bg-[#0b101b] border border-slate-800 overflow-hidden shadow-md">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0f172a]/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[10px] font-mono text-slate-400 ml-2">codebridge-spec.ts</span>
              </div>
              <button
                onClick={() => handleCopy(activeDoc.codeSnippet, activeDoc.id)}
                className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === activeDoc.id ? (
                  <>
                    <CheckIcon className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{activeDoc.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
