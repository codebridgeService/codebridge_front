'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CommandLineIcon, 
  CpuChipIcon, 
  ShieldCheckIcon, 
  ServerStackIcon, 
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { getEncryptedHref } from '@/lib/routeCipher';

const SERVICES_DATABASE = {
  'web-development': {
    title: 'Web Development Solutions',
    titleKh: 'ការអភិវឌ្ឍន៍គេហទំព័រ និងប្រព័ន្ធ Web App',
    badge: 'NEXT.JS 15 // EDGE RUNTIME',
    icon: GlobeAltIcon,
    color: '#3B82F6',
    tagline: 'High-performance, search-optimized web applications built for speed, security, and global scale.',
    taglineKh: 'គេហទំព័រ និង Web Application ដែលមានល្បឿនលឿន សុវត្ថិភាពខ្ពស់ និងស្របតាមស្តង់ដារ SEO អន្តរជាតិ។',
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Cloudflare Edge'],
    workflow: [
      {
        phase: 'PHASE 01',
        title: 'Architecture & Sitemap Blueprinting',
        titleKh: 'រៀបចំប្លង់ស្ថាបត្យកម្ម និងទម្រង់ប្រព័ន្ធ',
        desc: 'We map the full user journey, define SEO content structures, determine component hierarchies, and model database relationships.',
        descKh: 'យើងរៀបចំប្លង់លំហូរអ្នកប្រើប្រាស់ រចនាសម្ព័ន្ធទិន្នន័យ SEO និងទម្រង់ប្រព័ន្ធទិន្នន័យឱ្យមានភាពច្បាស់លាស់។',
        deliverable: 'Technical Specification & Wireframe Blueprint'
      },
      {
        phase: 'PHASE 02',
        title: 'Design System & Component Tokens',
        titleKh: 'បង្កើតប្រព័ន្ធរចនា Design System & Tokens',
        desc: 'Developing cohesive responsive layouts, color systems, dark/light theme variables, and interactive micro-animations.',
        descKh: 'បង្កើតប្រព័ន្ធរចនាបថដែលឆ្លើយតបគ្រប់ទំហំអេក្រង់ ពណ៌ស្ដង់ដារ និងចលនា Micro-interactions ដ៏រស់រវើក។',
        deliverable: 'Figma UI Library & Design Tokens'
      },
      {
        phase: 'PHASE 03',
        title: 'Full-Stack Engineering & API Integration',
        titleKh: 'ការសរសេរកូដ Full-Stack & តភ្ជាប់ API',
        desc: 'Writing clean, typed components with Next.js 15 Server-Side Rendering (SSR), server actions, stateless JWT auth, and optimized REST APIs.',
        descKh: 'សរសេរកូដស្របតាមស្តង់ដារ SSR ភ្ជាប់ប្រព័ន្ធផ្ទៀងផ្ទាត់ JWT និងតភ្ជាប់ API ប្រកបដោយប្រសិទ្ធភាពខ្ពស់។',
        deliverable: 'Production Codebase & API Pipeline'
      },
      {
        phase: 'PHASE 04',
        title: 'Lighthouse 95+ Audit & Security Hardening',
        titleKh: 'តេស្តល្បឿន Lighthouse 95+ & ពង្រឹងសុវត្ថិភាព',
        desc: 'Sub-second first contentful paint (FCP), Core Web Vitals optimization, TLS 1.3 Strict HSTS, CSP headers, and OWASP Top 10 sanitization.',
        descKh: 'បង្កើនល្បឿនទំព័រឱ្យលឿនក្រោម ១វិនាទី បំពាក់វិញ្ញាបនបត្រសុវត្ថិភាព TLS 1.3 និងទប់ស្កាត់ការវាយប្រហារតាមអ៊ីនធឺណិត។',
        deliverable: 'Lighthouse Audit Certificate & Security Report'
      },
      {
        phase: 'PHASE 05',
        title: 'CI/CD Pipeline & Edge CDN Rollout',
        titleKh: 'ដាក់ឱ្យដំណើរការលើពពក Edge CDN ស្វ័យប្រវត្តិ',
        desc: 'Automated GitHub actions CI/CD deployment across global edge nodes with automated zero-downtime rollouts and real-time error telemetry.',
        descKh: 'ដាក់ប្រព័ន្ធឱ្យដំណើរការលើបណ្ដាញ Cloud CDN សកលដោយស្វ័យប្រវត្តិ ធានាការដំណើរការ ២៤/៧ គ្មានការរអាក់រអួល។',
        deliverable: 'Live Production URL & Cloud Infrastructure'
      }
    ],
    capabilities: [
      'High-Speed Corporate Web Portals',
      'Scalable E-Commerce & Payment Gateways',
      'Modern SaaS Customer Dashboards',
      'Headless CMS & Dynamic Blogs',
      'Multilingual Khmer / English Support',
      'Automated SEO & Social Graph Meta Tags'
    ]
  },

  'mobile-apps': {
    title: 'Mobile Application Engineering',
    titleKh: 'វិស្វកម្មកម្មវិធីទូរស័ព្ទដៃ iOS & Android',
    badge: 'FLUTTER // NATIVE ENGINE',
    icon: DevicePhoneMobileIcon,
    color: '#FACC15',
    tagline: 'Native-grade iOS and Android mobile apps engineered with fluid 120fps motion and offline-first reliability.',
    taglineKh: 'កម្មវិធីទូរស័ព្ទដៃសម្រាប់ iOS និង Android ដែលមានល្បឿនលឿន ចលនារលូន និងអាចប្រើប្រាស់បានទោះបីគ្មានអ៊ីនធឺណិត។',
    techStack: ['Flutter', 'Dart', 'React Native', 'Swift', 'Kotlin', 'SQLite', 'Firebase', 'REST APIs'],
    workflow: [
      {
        phase: 'PHASE 01',
        title: 'Mobile UX & Native Journey Blueprint',
        titleKh: 'រៀបចំ UX និងលំហូរកម្មវិធីទូរស័ព្ទ',
        desc: 'Designing gesture-driven user flows conforming to Apple Human Interface Guidelines and Google Material Design 3.',
        descKh: 'រៀបចំលំហូរអ្នកប្រើប្រាស់ស្របតាមស្តង់ដារប្រព័ន្ធប្រតិបត្តិការ iOS និង Android ទំនើបចុងក្រោយ។',
        deliverable: 'Interactive Mobile Click-Dummy'
      },
      {
        phase: 'PHASE 02',
        title: 'Cross-Platform Framework Architecture',
        titleKh: 'រៀបចំរចនាសម្ព័ន្ធ Cross-Platform Engine',
        desc: 'Implementing clean reactive state management (BLoC / Zustand), modular domain layers, and local offline caching engines.',
        descKh: 'រៀបចំ Architecture និង State Management ដែលមានសុវត្ថិភាព ព្រមទាំងប្រព័ន្ធទិន្នន័យ Offline Caching ក្នុងទូរស័ព្ទ។',
        deliverable: 'Core Mobile App Architecture'
      },
      {
        phase: 'PHASE 03',
        title: 'Hardware & Native SDK Integration',
        titleKh: 'តភ្ជាប់ Hardware & មុខងារទូរស័ព្ទ',
        desc: 'Connecting Biometric FaceID/Fingerprint auth, Push Notifications (APNs/FCM), GPS geo-tracking, camera, and bluetooth peripherals.',
        descKh: 'តភ្ជាប់មុខងារស្កេនក្រយៅដៃ/មុខ ប្រព័ន្ធផ្ញើសារ Push Notification កាមេរ៉ា និងផែនទី GPS យ៉ាងរលូន។',
        deliverable: 'Native SDK Integrations'
      },
      {
        phase: 'PHASE 04',
        title: 'Device Profiling & Performance Testing',
        titleKh: 'តេស្តដំណើរការលើឧបករណ៍ទូរស័ព្ទពិតប្រាកដ',
        desc: 'Profiling on physical iOS and Android devices to guarantee fluid 60/120fps, zero memory leaks, and low battery consumption.',
        descKh: 'តេស្តលើទូរស័ព្ទជាក់ស្ដែងគ្រប់ស៊េរី ធានាចលនារលូន មិនគាំង និងសន្សំសំចៃថ្មទូរស័ព្ទ។',
        deliverable: 'Quality Assurance Matrix & Beta Builds'
      },
      {
        phase: 'PHASE 05',
        title: 'App Store & Google Play Publishing',
        titleKh: 'ដាក់បង្ហោះលើ App Store និង Google Play',
        desc: 'Managing App Store Review compliance, Google Play target API rules, TestFlight distribution, and automated Fastlane pipelines.',
        descKh: 'រៀបចំឯកសារនិងដាក់បង្ហោះលើ App Store និង Google Play Store ស្របតាមច្បាប់និងគោលការណ៍សុវត្ថិភាព។',
        deliverable: 'Live Store Listings & Automated Updates'
      }
    ],
    capabilities: [
      'iOS & Android Single-Codebase Efficiency',
      'Biometric FaceID & Secure Keychain Storage',
      'Real-Time Push Notifications & Chat',
      'Offline-First Local Database Sync',
      'Mobile Payment Gateways (ABA Pay, Bakong)',
      'Automated App Store Release Pipelines'
    ]
  },

  'custom-systems': {
    title: 'Custom Enterprise Systems & ERP',
    titleKh: 'ប្រព័ន្ធគ្រប់គ្រងសហគ្រាស និង ERP តាមតម្រូវការ',
    badge: 'DISTRIBUTED CLUSTERS // 99.9% SLA',
    icon: ServerStackIcon,
    color: '#22C55E',
    tagline: 'Tailored enterprise software, ERP, POS, and automated business workflows designed to streamline operations.',
    taglineKh: 'ប្រព័ន្ធគ្រប់គ្រងអាជីវកម្ម ERP ប្រព័ន្ធលក់ POS និងស្វ័យប្រវត្តិកម្មអាជីវកម្មដែលបង្កើតឡើងស្របតាមតម្រូវការជាក់ស្ដែង។',
    techStack: ['PostgreSQL', 'Node.js', 'Python', 'Redis', 'Docker', 'RabbitMQ', 'Microservices', 'Linux'],
    workflow: [
      {
        phase: 'PHASE 01',
        title: 'Business Process & Data Schema Modeling',
        titleKh: 'វិភាគដំណើរការអាជីវកម្ម និងរៀបចំទិន្នន័យ',
        desc: 'Analyzing organizational workflows, stock movements, accounting protocols, and designing normalized relational databases.',
        descKh: 'វិភាគដំណើរការការងារជាក់ស្ដែងក្នុងអាជីវកម្ម ចរន្តស្តុក ចរន្តហិរញ្ញវត្ថុ និងរៀបចំរចនាសម្ព័ន្ធទិន្នន័យកម្រិតសហគ្រាស។',
        deliverable: 'Process Flowchart & Database Entity Map'
      },
      {
        phase: 'PHASE 02',
        title: 'Zero-Trust RBAC & Security Matrix',
        titleKh: 'ប្រព័ន្ធសិទ្ធិប្រើប្រាស់ RBAC & សុវត្ថិភាពខ្ពស់',
        desc: 'Engineering multi-tenant isolation, granular Role-Based Access Control, session tokens, and tamper-evident audit logs.',
        descKh: 'បែងចែកសិទ្ធិប្រើប្រាស់តាមតួនាទីបុគ្គលិកយ៉ាងតឹងរ៉ឹង រក្សាកំណត់ត្រាសវនកម្មរាល់សកម្មភាពក្នុងប្រព័ន្ធ។',
        deliverable: 'Security Permissions Matrix'
      },
      {
        phase: 'PHASE 03',
        title: 'Real-Time Transactional Business Engines',
        titleKh: 'បង្កើតម៉ាស៊ីនដំណើរការប្រតិបត្តិការ Real-Time',
        desc: 'Building automated multi-warehouse inventory tracking, live invoice generation, batch processing, and WebSocket telemetry.',
        descKh: 'បង្កើតប្រព័ន្ធកាត់ស្តុកស្វ័យប្រវត្តិ ការគ្រប់គ្រងសាខាច្រើន ការចេញវិក្កយបត្រ និងរបាយការណ៍បន្តផ្ទាល់។',
        deliverable: 'Core Business Logic Engine'
      },
      {
        phase: 'PHASE 04',
        title: 'Load Simulation & High-Concurrency Hardening',
        titleKh: 'តេស្តបន្ទុកប្រតិបត្តិការខ្ពស់ និងបង្កើនល្បឿន',
        desc: 'Simulating thousands of concurrent point-of-sale transactions, tuning Redis distributed caches, and indexing query bottlenecks.',
        descKh: 'តេស្តការផ្ទុកទិន្នន័យរាប់ម៉ឺនប្រតិបត្តិការក្នុងពេលតែមួយ និងបង្កើនល្បឿនទាញទិន្នន័យឱ្យលឿនបំផុត។',
        deliverable: 'Stress Test & Scalability Benchmark'
      },
      {
        phase: 'PHASE 05',
        title: 'Private Cloud / On-Prem Deployment & SLA',
        titleKh: 'ដំឡើងលើ Cloud ឬ Server ផ្ទាល់ខ្លួន & SLA 99.9%',
        desc: 'Containerized deployment via Docker, automated daily snapshot backups, multi-zone failover redundancy, and 99.9% uptime SLA.',
        descKh: 'ដំឡើងប្រព័ន្ធលើ Server សុវត្ថិភាពខ្ពស់ បម្រុងទុកទិន្នន័យស្វ័យប្រវត្តិកុំឱ្យបាត់បង់ និងមានការធានាដំណើរការ ៩៩.៩%។',
        deliverable: 'Enterprise Deployment & Operations SLA'
      }
    ],
    capabilities: [
      'Multi-Branch POS & Inventory Ledgers',
      'Automated Invoicing & Financial Accounting',
      'Staff HR, Attendance & Payroll Engines',
      'Granular Role-Based Access Control (RBAC)',
      'Real-Time Analytics & Executive Dashboards',
      'Automated Multi-Location Backup Redundancy'
    ]
  },

  'ui-ux-design': {
    title: 'UI/UX Design & Product Architecture',
    titleKh: 'រចនា UI/UX និងស្ថាបត្យកម្មផលិតផល',
    badge: 'FIGMA // ATOMIC DESIGN',
    icon: PaintBrushIcon,
    color: '#A855F7',
    tagline: 'Human-centered interfaces, intuitive interaction flows, and scalable enterprise design systems.',
    taglineKh: 'រចនាចំណុចប្រទាក់អ្នកប្រើប្រាស់ដ៏ស្រស់ស្អាត ងាយស្រួលយល់ និងប្រព័ន្ធ Design System ដែលអាចពង្រីកបាន។',
    techStack: ['Figma', 'Design Tokens', 'FigJam', 'Atomic Design', 'WCAG 2.1', 'Prototyping'],
    workflow: [
      {
        phase: 'PHASE 01',
        title: 'User Research & Journey Mapping',
        titleKh: 'ស្រាវជ្រាវតម្រូវការអ្នកប្រើប្រាស់ និងលំហូរការងារ',
        desc: 'Conducting stakeholder interviews, customer persona creation, competitor benchmarking, and friction-point discovery.',
        descKh: 'សិក្សាស្វែងយល់ពីអាកប្បកិរិយារបស់អតិថិជន និងរៀបចំដំណើរការប្រើប្រាស់ឱ្យសាមញ្ញបំផុត។',
        deliverable: 'User Personas & Journey Map'
      },
      {
        phase: 'PHASE 02',
        title: 'Information Architecture & Wireframes',
        titleKh: 'រៀបចំរចនាសម្ព័ន្ធទំព័រ និងប្លង់ Wireframe',
        desc: 'Creating low-fidelity wireframes that clarify screen hierarchy and content positioning before visual styling begins.',
        descKh: 'គូសប្លង់គ្រោងឆ្អឹង Wireframe ដើម្បីពិនិត្យលើទម្រង់ និងទីតាំងប៊ូតុងសំខាន់ៗ។',
        deliverable: 'Low-Fidelity Wireframes'
      },
      {
        phase: 'PHASE 03',
        title: 'High-Fidelity UI & Design Systems',
        titleKh: 'រចនា UI ពេញលេញ និងបង្កើត Design System',
        desc: 'Building responsive components, custom typography, color tokens, and state variations in a comprehensive Figma library.',
        descKh: 'រចនាផ្ទាំងអេក្រង់ជាក់ស្ដែងប្រកបដោយសោភ័ណភាពខ្ពស់ ពណ៌ស្រស់ស្អាត និងស្តង់ដារ Typography ត្រឹមត្រូវ។',
        deliverable: 'High-Fidelity Figma Component Library'
      },
      {
        phase: 'PHASE 04',
        title: 'Interactive Prototyping & Micro-Motion',
        titleKh: 'បង្កើតគំរូតេស្ត Prototype និងចលនារស់រវើក',
        desc: 'Connecting interactive transitions, clickable screen flows, and micro-animations for real user validation.',
        descKh: 'ភ្ជាប់អេក្រង់ទាំងអស់ឱ្យដំណើរការដូចកម្មវិធីពិតប្រាកដ ដើម្បីតេស្តសាកល្បងមុនពេលសរសេរកូដ។',
        deliverable: 'Clickable Interactive Prototype'
      },
      {
        phase: 'PHASE 05',
        title: 'Developer Handoff & Design QA',
        titleKh: 'ផ្ទេរការងារទៅក្រុមវិស្វករ និងត្រួតពិនិត្យ UI',
        desc: 'Exporting design tokens, CSS variables, and inspecting code implementations to guarantee 100% pixel-perfect fidelity.',
        descKh: 'ផ្ទេរប្លង់រចនាទៅកាន់ក្រុមវិស្វករកូដ និងត្រួតពិនិត្យរាល់ភីកសែលឱ្យដូចទៅនឹងប្លង់ដើម ១០០%។',
        deliverable: 'Design Tokens & Production Handoff'
      }
    ],
    capabilities: [
      'Comprehensive Multi-Brand Design Systems',
      'Pixel-Perfect Responsive Mobile & Web UI',
      'Clickable Interactive Prototypes',
      'Dark & Light Mode Color Architecture',
      'WCAG 2.1 Accessibility Compliance',
      'Developer-Ready Token Exports'
    ]
  }
};

export default function ServiceDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams?.slug || 'web-development';
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const service = SERVICES_DATABASE[slug] || SERVICES_DATABASE['web-development'];
  const Icon = service.icon || GlobeAltIcon;

  return (
    <div className="min-h-screen pt-4 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[11px] font-mono text-[color:var(--text-muted)]">
        <Link href="/" className="hover:text-[color:var(--color-primary)] transition-colors">
          {t('Home', 'ទំព័រដើម')}
        </Link>
        <span>/</span>
        <Link href={getEncryptedHref('/services')} className="hover:text-[color:var(--color-primary)] transition-colors">
          {t('Services', 'សេវាកម្ម')}
        </Link>
        <span>/</span>
        <span className="text-[color:var(--text-main)] font-bold">{service.badge}</span>
      </div>

      {/* Hero Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 sm:p-8 rounded-2xl bg-transparent border border-[color:var(--border-main)]/80 relative overflow-hidden mb-10"
      >
        {/* Cyber Corner Accents */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[color:var(--border-main)] opacity-70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[color:var(--border-main)] opacity-70 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--bg-main)]/80 border border-[color:var(--border-main)] shadow-xs mb-3">
              <Icon className="w-4 h-4 text-[color:var(--color-primary)]" />
              <span className="text-[10px] font-mono font-bold text-[color:var(--text-main)] uppercase tracking-wider">
                {service.badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[color:var(--text-main)] tracking-tight mb-3">
              {t(service.title, service.titleKh)}
            </h1>

            <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-2xl leading-relaxed">
              {t(service.tagline, service.taglineKh)}
            </p>
          </div>

          {/* Action CTA Box */}
          <div className="flex flex-col gap-2.5 shrink-0 sm:min-w-[200px]">
            <a
              href="https://t.me/codebridgee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <FaTelegramPlane className="w-3.5 h-3.5" />
              <span>{t('Discuss This Project', 'ពិភាក្សាអំពីគម្រោងនេះ')}</span>
            </a>
            <Link
              href={getEncryptedHref('/contact')}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2 border border-[color:var(--border-main)]/80 bg-transparent text-[color:var(--text-main)] font-bold text-xs rounded-full shadow-xs hover:border-[color:var(--color-primary)] transition-all"
            >
              <span>{t('Request Consultation', 'សុំការពិគ្រោះយោបល់')}</span>
              <ArrowRightIcon className="w-3 h-3 stroke-[2]" />
            </Link>
          </div>
        </div>

        {/* Tech Stack Chip Strip */}
        <div className="mt-6 pt-5 border-t border-[color:var(--border-main)]/50 flex flex-wrap items-center gap-2">
          <CommandLineIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)] opacity-70 shrink-0 mr-1" />
          <span className="text-[10px] font-mono font-bold text-[color:var(--text-muted)] uppercase mr-1">
            CORE STACK:
          </span>
          {service.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-transparent text-[color:var(--text-secondary)] border border-[color:var(--border-main)]/70 shadow-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Main Workflow Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-transparent border border-[color:var(--border-main)] shadow-xs mb-2">
            <CpuChipIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
            <span className="text-[10px] font-mono font-bold text-[color:var(--text-main)] uppercase tracking-wider">
              {t('Engineering Lifecycle', 'វដ្តដំណើរការវិស្វកម្ម')}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-[color:var(--text-main)] tracking-tight">
            {t('Our Step-by-Step Workflow & Process', 'ដំណើរការនិងដំណាក់កាលការងារលម្អិត')}
          </h2>
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xl mx-auto mt-1">
            {t(
              'A disciplined, agile methodology engineered to deliver high-performance results without delays or unexpected bugs.',
              'វិធីសាស្ត្រការងារបែប Agile ប្រកបដោយភាពច្បាស់លាស់ ធានាការបង្កើតប្រព័ន្ធប្រកបដោយគុណភាពខ្ពស់បំផុត។'
            )}
          </p>
        </div>

        {/* Workflow Timeline Steps */}
        <div className="space-y-4 max-w-4xl mx-auto relative">
          {service.workflow.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 sm:p-6 rounded-2xl bg-transparent border border-[color:var(--border-main)]/80 relative hover:border-[color:var(--color-primary)]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    0{idx + 1}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[color:var(--color-primary)] uppercase tracking-widest block mb-1">
                      {step.phase}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[color:var(--text-main)] mb-1.5 tracking-tight">
                      {t(step.title, step.titleKh)}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[color:var(--text-muted)] leading-relaxed font-medium">
                      {t(step.desc, step.descKh)}
                    </p>
                  </div>
                </div>

                <div className="sm:self-center shrink-0 pl-13 sm:pl-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-transparent text-[10px] font-mono text-[color:var(--text-muted)] border border-[color:var(--border-main)]/60">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{step.deliverable}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deliverables / Capabilities Grid */}
      <div className="p-6 sm:p-8 rounded-2xl bg-transparent border border-[color:var(--border-main)]/70 mb-12">
        <div className="text-center mb-6">
          <h3 className="text-lg sm:text-xl font-black text-[color:var(--text-main)] uppercase tracking-tight mb-1">
            {t('What We Deliver', 'លទ្ធផលដែលយើងផ្តល់ជូន')}
          </h3>
          <p className="text-xs text-[color:var(--text-muted)]">
            {t('Production-grade technical capabilities baked into every project.', 'សមត្ថភាពបច្ចេកវិទ្យាកម្រិតសហគ្រាសសម្រាប់គ្រប់គម្រោង។')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {service.capabilities.map((cap, i) => (
            <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-transparent border border-[color:var(--border-main)]/50">
              <div className="p-1 rounded-full bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] shrink-0">
                <CheckIcon className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-[color:var(--text-main)]">
                {cap}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Direct CTA */}
      <div className="text-center p-8 rounded-2xl bg-transparent border border-[color:var(--border-main)]/80 max-w-3xl mx-auto relative overflow-hidden">
        {/* Cyber Corner Accents */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[color:var(--border-main)] opacity-70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[color:var(--border-main)] opacity-70 pointer-events-none" />

        <h3 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)] tracking-tight mb-2">
          {t("Ready to Engineer Your Next Solution?", "រួចរាល់ដើម្បីបង្កើតដំណោះស្រាយបន្ទាប់របស់អ្នកហើយឬនៅ?")}
        </h3>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] max-w-xl mx-auto mb-6 leading-relaxed">
          {t(
            "Every project has unique technical specifications. Connect with our engineering team directly on Telegram to consult on your custom requirements.",
            "គម្រោងនីមួយៗមានតម្រូវការបច្ចេកវិទ្យាជាក់ស្ដែងរៀងៗខ្លួន។ ពិភាក្សាផ្ទាល់ជាមួយក្រុមវិស្វកររបស់យើងតាម Telegram ដើម្បីរៀបចំគម្រោងរបស់អ្នក។"
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://t.me/codebridgee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <FaTelegramPlane className="w-3.5 h-3.5" />
            <span>{t("Talk With Our Engineers on Telegram", "ពិភាក្សាជាមួយក្រុមការងារតាម Telegram")}</span>
          </a>
          <Link
            href={getEncryptedHref('/services')}
            className="inline-flex items-center justify-center px-6 py-2.5 border border-[color:var(--border-main)]/80 bg-transparent text-[color:var(--text-main)] font-bold text-xs rounded-full shadow-xs hover:border-[color:var(--color-primary)] transition-all"
          >
            <span>{t("Explore Other Services", "មើលសេវាកម្មផ្សេងៗទៀត")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
