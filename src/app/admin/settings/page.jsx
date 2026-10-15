'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/store/authService';
import { siteSettingService } from '@/store/siteSettingService';
import { useLanguage } from '@/context/LanguageContext';
import { 
  UserIcon, 
  LockClosedIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  Cog6ToothIcon,
  SparklesIcon,
  MegaphoneIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CubeTransparentIcon,
  FolderIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const [activeTab, setActiveTab] = useState('visibility'); // 'visibility', 'hero', 'cta', 'about', 'contacts', 'account'
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Account State
  const [user, setUser] = useState({ name: '', email: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Site Settings State (Singleton)
  const [siteSettings, setSiteSettings] = useState({
    // Contacts & Socials
    phone: '',
    email: '',
    address: '',
    addressKh: '',
    workingHours: '',
    workingHoursKh: '',
    facebookUrl: '',
    telegramUrl: '',
    tiktokUrl: '',
    instagramUrl: '',

    // Hero
    heroBadge: '',
    heroBadgeKh: '',
    heroTitle: '',
    heroTitleKh: '',
    heroSubtitle: '',
    heroSubtitleKh: '',
    heroCtaText: '',
    heroCtaTextKh: '',
    heroCtaLink: '',

    // CTA Section
    ctaTitle: '',
    ctaTitleKh: '',
    ctaSubtitle: '',
    ctaSubtitleKh: '',
    ctaBtnText: '',
    ctaBtnTextKh: '',
    ctaBtnLink: '',

    // About Page
    aboutStory: '',
    aboutStoryKh: '',
    missionTitle: '',
    missionTitleKh: '',
    missionText: '',
    missionTextKh: '',
    visionTitle: '',
    visionTitleKh: '',
    visionText: '',
    visionTextKh: '',

    // Section Visibility Toggles (Homepage & Site-wide)
    showHero: true,
    showServices: true,
    showPackages: true,
    showProjects: true,
    showSecurity: true,
    showFaq: true,
    showTeam: true,
    showHowWeWork: true,
    showCta: true,
  });

  useEffect(() => {
    // Load Admin Account
    const session = authService.getSession();
    if (session && session.user) {
      setUser({ 
        name: session.user.name || '', 
        email: session.user.email || '', 
        image: session.user.image || '' 
      });
      if (session.user.image) setImagePreview(session.user.image);
    }

    // Load Site Settings
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const data = await siteSettingService.getSettings();
      if (data) {
        setSiteSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    }
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatus({ type: '', message: '' });
    try {
      const updated = await siteSettingService.updateSettings(siteSettings);
      setSiteSettings(updated);
      setStatus({ type: 'success', message: t('Site settings updated successfully!', 'ការកំណត់គេហទំព័រត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!') });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update site settings' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleSection = async (secKey) => {
    const newStatus = siteSettings[secKey] === false ? true : false;
    setSiteSettings(prev => ({
      ...prev,
      [secKey]: newStatus,
    }));
    setStatus({ type: '', message: '' });

    try {
      const updated = await siteSettingService.updateSettings({
        [secKey]: newStatus,
      });
      if (updated) {
        setSiteSettings(prev => ({ ...prev, ...updated }));
      }
      setStatus({ 
        type: 'success', 
        message: newStatus
          ? t('Section is now visible to public!', 'ផ្នែកនេះត្រូវបានបង្ហាញជាសាធារណៈ!')
          : t('Section has been hidden from public!', 'ផ្នែកនេះត្រូវបានលាក់ពីសាធារណៈ!')
      });
    } catch (err) {
      console.error('Failed to toggle section:', err);
      setSiteSettings(prev => ({
        ...prev,
        [secKey]: !newStatus,
      }));
      setStatus({ type: 'error', message: err.message || 'Failed to update section visibility' });
    }
  };

  const handleEnableAllSections = async () => {
    const allEnabled = {
      showHero: true,
      showServices: true,
      showPackages: true,
      showProjects: true,
      showSecurity: true,
      showFaq: true,
      showTeam: true,
      showHowWeWork: true,
      showCta: true,
    };
    setSiteSettings(prev => ({ ...prev, ...allEnabled }));
    setStatus({ type: '', message: '' });
    try {
      await siteSettingService.updateSettings(allEnabled);
      setStatus({ type: 'success', message: t('All sections are now visible!', 'គ្រប់ផ្នែកទាំងអស់ត្រូវបានបង្ហាញ!') });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to enable all sections' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      if (imageFile) formData.append('image', imageFile);

      const res = await authService.updateProfile(formData);
      const session = authService.getSession();
      authService.setSession(session.token, res.user);
      setStatus({ type: 'success', message: t('Profile updated successfully!', 'ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានធ្វើបច្ចុប្បន្នភាព!') });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: t('Passwords do not match.', 'ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។') });
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      setStatus({ type: 'success', message: t('Password changed successfully!', 'ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!') });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const visibilitySections = [
    {
      key: 'showHero',
      title: t('Hero Section', 'ផ្នែក Hero Banner'),
      description: t('Main welcome headline, slogan badge, and primary action buttons at the top of the homepage.', 'ចំណងជើងស្វាគមន៍ធំ, ស្លាក Slogan និងប៊ូតុងសកម្មភាពចម្បងនៅផ្នែកខាងលើនៃទំព័រដើម។'),
      location: t('Homepage Top', 'ផ្នែកខាងលើទំព័រដើម'),
      icon: SparklesIcon,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      key: 'showServices',
      title: t('Our Services / Expertise', 'សេវាកម្ម និងជំនាញ'),
      description: t('Interactive grid displaying top digital engineering and web/app services.', 'ផ្ទាំងបង្ហាញសេវាកម្មវិស្វកម្មឌីជីថល គេហទំព័រ និងកម្មវិធីទូរស័ព្ទ។'),
      location: t('Homepage', 'ទំព័រដើម'),
      icon: BriefcaseIcon,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      key: 'showPackages',
      title: t('Service Pricing Packages', 'កញ្ចប់តម្លៃសេវាកម្ម'),
      description: t('Tiered pricing cards with feature checklists and instant project order modals.', 'កាតតម្លៃសេវាកម្មជាកម្រិត រួមទាំងបញ្ជីមុខងារ និងម៉ូដាល់បញ្ជាទិញគម្រោង។'),
      location: t('Homepage', 'ទំព័រដើម'),
      icon: CubeTransparentIcon,
      color: 'from-amber-500 to-orange-600',
    },
    {
      key: 'showProjects',
      title: t('Recent Projects / Portfolio', 'គម្រោងថ្មីៗ / ស្នាដៃ'),
      description: t('Showcase of latest client case studies, live previews, and project tags.', 'ការបង្ហាញស្នាដៃថ្មីៗ ករណីសិក្សារបស់អតិថិជន និងស្លាកប្រភេទគម្រោង។'),
      location: t('Homepage', 'ទំព័រដើម'),
      icon: FolderIcon,
      color: 'from-violet-500 to-purple-600',
    },
    {
      key: 'showSecurity',
      title: t('Security & Guarantees', 'សុវត្ថិភាព និងការធានា'),
      description: t('Enterprise DDoS protection, attack shield highlights, and quality guarantees.', 'ការការពារ DDoS កម្រិតសហគ្រាស ប្រព័ន្ធ Attack Shield និងការធានាគុណភាព។'),
      location: t('Homepage', 'ទំព័រដើម'),
      icon: ShieldCheckIcon,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      key: 'showFaq',
      title: t('Frequently Asked Questions (FAQ)', 'សំណួរដែលសួរញឹកញាប់ (FAQ)'),
      description: t('Interactive accordion answering client questions on process, timing, and security.', 'ផ្ទាំងសំណួរ-ចម្លើយអន្តរកម្មឆ្លើយតបសំណួរអតិថិជនអំពីដំណើរការ រយៈពេល និងសុវត្ថិភាព។'),
      location: t('Homepage', 'ទំព័រដើម'),
      icon: QuestionMarkCircleIcon,
      color: 'from-sky-500 to-blue-600',
    },
    {
      key: 'showTeam',
      title: t('Our Team', 'ក្រុមការងាររបស់យើង'),
      description: t('Team member cards showing names, executive/dev roles, photos, and portfolio links.', 'កាតបង្ហាញសមាជិកក្រុម ឈ្មោះ តួនាទី រូបថត និងតំណភ្ជាប់ផលប័ត្រ។'),
      location: t('Homepage & About Us Page', 'ទំព័រដើម & ទំព័រ About Us'),
      icon: UserGroupIcon,
      color: 'from-rose-500 to-pink-600',
    },
    {
      key: 'showHowWeWork',
      title: t('How We Work (Workflow)', 'របៀបដែលយើងធ្វើការ (Workflow)'),
      description: t('Step-by-step roadmap showing client onboarding, design, build, and launch phases.', 'ផែនទីជំហានពីការប្រឹក្សា ការរចនា ការអភិវឌ្ឍ រហូតដល់ការដាក់ឱ្យប្រើប្រាស់។'),
      location: t('About Us Page', 'ទំព័រ About Us'),
      icon: ArrowPathIcon,
      color: 'from-indigo-500 to-blue-700',
    },
    {
      key: 'showCta',
      title: t('Call to Action Banner', 'ផ្ទាំងអំពាវនាវ Call-to-Action'),
      description: t('High-converting banner inviting visitors to start their project or get a free quote.', 'ផ្ទាំងអំពាវនាវទាក់ទាញចិត្តអតិថិជនឱ្យចាប់ផ្តើមគម្រោង ឬស្នើសុំការវាយតម្លៃតម្លៃឥតគិតថ្លៃ។'),
      location: t('Homepage Bottom', 'ផ្នែកខាងក្រោមទំព័រដើម'),
      icon: MegaphoneIcon,
      color: 'from-amber-500 to-red-500',
    },
  ];

  const tabs = [
    { id: 'visibility', name: t('Section Visibility', 'ការបង្ហាញ/លាក់ផ្នែក'), icon: EyeIcon },
    { id: 'hero', name: t('Hero Section', 'ផ្នែក Hero'), icon: SparklesIcon },
    { id: 'cta', name: t('Call To Action', 'ផ្នែក CTA Banner'), icon: MegaphoneIcon },
    { id: 'about', name: t('About Us Content', 'ព័ត៌មាន About Us'), icon: InformationCircleIcon },
    { id: 'contacts', name: t('Contacts & Socials', 'ទំនាក់ទំនង និងបណ្តាញសង្គម'), icon: BuildingOfficeIcon },
    { id: 'account', name: t('Admin Account', 'គណនី Admin'), icon: UserIcon },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[color:var(--bg-main)] border border-[color:var(--border-main)] shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[color:var(--color-primary)] to-[color:var(--color-secondary)] flex items-center justify-center text-white shadow-xs">
            <Cog6ToothIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[color:var(--text-main)] tracking-tight">
              {t('Site Content & System Settings', 'ការកំណត់មាតិកា និងប្រព័ន្ធ')}
            </h1>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {t('Customize public text, hero banners, about page, section visibility, and contact info in English & Khmer.', 'កែសម្រួលអត្ថបទសាធារណៈ, Hero, About Us, ការបង្ហាញ/លាក់ផ្នែក និងទំនាក់ទំនងជាភាសាអង់គ្លេស និងខ្មែរ')}
            </p>
          </div>
        </div>

        {status.message && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-xs border ${
              status.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {status.type === 'success' ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <ExclamationCircleIcon className="w-3.5 h-3.5" />}
            {status.message}
          </motion.div>
        )}
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStatus({ type: '', message: '' });
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[color:var(--color-primary)] text-white shadow-xs'
                  : 'bg-[color:var(--bg-main)] text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] border border-[color:var(--border-main)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* TAB 0: SECTION VISIBILITY */}
      {activeTab === 'visibility' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[color:var(--border-main)]">
            <div>
              <h2 className="text-base font-bold text-[color:var(--text-main)] flex items-center gap-2">
                <EyeIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
                {t('Dynamic Section Visibility Control', 'ការគ្រប់គ្រងការបង្ហាញ/លាក់ផ្នែកនៅលើគេហទំព័រ')}
              </h2>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
                {t(
                  'Instantly show or hide any public section across the homepage and About page without touching code.',
                  'កំណត់បង្ហាញ ឬលាក់ផ្នែកនានានៅលើទំព័រដើម និងទំព័រ About Us ភ្លាមៗដោយមិនចាំបាច់កែប្រែកូដឡើយ។'
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAllSections}
                className="px-3 py-1.5 rounded-xl border border-[color:var(--border-main)] text-xs font-semibold text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] hover:bg-[color:var(--bg-secondary)] transition-all cursor-pointer"
              >
                {t('Enable All', 'បង្ហាញទាំងអស់')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveSiteSettings} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibilitySections.map((sec) => {
                const Icon = sec.icon;
                const isVisible = siteSettings[sec.key] !== false;

                return (
                  <div
                    key={sec.key}
                    className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                      isVisible 
                        ? 'bg-[color:var(--bg-secondary)]/60 border-[color:var(--border-main)] hover:border-[color:var(--color-primary)]/40 shadow-xs'
                        : 'bg-gray-500/5 border-dashed border-gray-300 dark:border-gray-700 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${sec.color} flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs font-bold text-[color:var(--text-main)]">
                              {sec.title}
                            </h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] border border-[color:var(--color-primary)]/20">
                              {sec.location}
                            </span>
                          </div>
                          <p className="text-xs text-[color:var(--text-muted)] mt-1.5 leading-relaxed">
                            {sec.description}
                          </p>
                        </div>
                      </div>

                      {/* Animated Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isVisible}
                        onClick={() => handleToggleSection(sec.key)}
                        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                          isVisible
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm'
                            : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                            isVisible ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[color:var(--border-main)]/60 text-xs">
                      <span className="text-[color:var(--text-muted)] font-medium">
                        {t('Current Status:', 'ស្ថានភាពបច្ចុប្បន្ន:')}
                      </span>
                      {isVisible ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[11px]">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          {t('Visible to public', 'កំពុងបង្ហាញ')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-gray-500 dark:text-gray-400 bg-gray-500/10 px-2.5 py-0.5 rounded-full text-[11px]">
                          <EyeSlashIcon className="w-3.5 h-3.5" />
                          {t('Hidden from public', 'បានលាក់')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[color:var(--border-main)]">
              <p className="text-xs text-[color:var(--text-muted)]">
                {t(
                  'Toggle any section above and click save to apply changes live across the website.',
                  'បិទ/បើកផ្នែកណាមួយខាងលើ រួចចុចរក្សាទុកដើម្បីអនុវត្តការផ្លាស់ប្តូរនៅលើគេហទំព័រភ្លាមៗ។'
                )}
              </p>
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-xs font-bold shadow-md hover:brightness-110 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {savingSettings ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    {t('Saving Changes...', 'កំពុងរក្សាទុក...')}
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    {t('Save Visibility Settings', 'រក្សាទុកការកំណត់បង្ហាញ/លាក់')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 1: HERO SECTION */}
      {activeTab === 'hero' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs">
          <h2 className="text-base font-bold text-[color:var(--text-main)] mb-0.5">{t('Hero Section Content', 'មាតិកាផ្នែក Hero')}</h2>
          <p className="text-xs text-[color:var(--text-muted)] mb-4">{t('Controls the primary headline, slogan badge, and main call-to-action on the homepage.', 'គ្រប់គ្រងចំណងជើងធំ, ស្លាក Slogan និងប៊ូតុងសកម្មភាពនៅលើទំព័រដើម')}</p>

          <form onSubmit={handleSaveSiteSettings} className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Hero Badge (English)', 'ស្លាក Badge (ភាសាអង់គ្លេស)')}</label>
                <input
                  type="text"
                  value={siteSettings.heroBadge}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Hero Badge (Khmer)', 'ស្លាក Badge (ភាសាខ្មែរ)')}</label>
                <input
                  type="text"
                  value={siteSettings.heroBadgeKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroBadgeKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Main Headline (English)', 'ចំណងជើងចម្បង (ភាសាអង់គ្លេស)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.heroTitle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Main Headline (Khmer)', 'ចំណងជើងចម្បង (ភាសាខ្មែរ)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.heroTitleKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroTitleKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Subtitle / Description (English)', 'ការពិពណ៌នាសង្ខេប (ភាសាអង់គ្លេស)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.heroSubtitle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Subtitle / Description (Khmer)', 'ការពិពណ៌នាសង្ខេប (ភាសាខ្មែរ)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.heroSubtitleKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitleKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Button Text (English)', 'អត្ថបទប៊ូតុង (អង់គ្លេស)')}</label>
                <input
                  type="text"
                  value={siteSettings.heroCtaText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroCtaText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Button Text (Khmer)', 'អត្ថបទប៊ូតុង (ខ្មែរ)')}</label>
                <input
                  type="text"
                  value={siteSettings.heroCtaTextKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroCtaTextKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Button Target Link', 'តំណភ្ជាប់ Link ប៊ូតុង')}</label>
                <input
                  type="text"
                  value={siteSettings.heroCtaLink}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroCtaLink: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                {savingSettings ? t('Saving...', 'កំពុងរក្សាទុក...') : t('Save Hero Changes', 'រក្សាទុក Hero')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 2: CALL TO ACTION BANNER */}
      {activeTab === 'cta' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs">
          <h2 className="text-base font-bold text-[color:var(--text-main)] mb-0.5">{t('Call To Action (CTA) Banner', 'ផ្ទាំងផ្សព្វផ្សាយ CTA Banner')}</h2>
          <p className="text-xs text-[color:var(--text-muted)] mb-4">{t('Controls the conversion banner displayed above the footer across public pages.', 'គ្រប់គ្រងផ្ទាំងទាក់ទាញអតិថិជនដែលបង្ហាញនៅពីលើ Footer')}</p>

          <form onSubmit={handleSaveSiteSettings} className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Title (English)', 'ចំណងជើង CTA (អង់គ្លេស)')}</label>
                <input
                  type="text"
                  value={siteSettings.ctaTitle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Title (Khmer)', 'ចំណងជើង CTA (ខ្មែរ)')}</label>
                <input
                  type="text"
                  value={siteSettings.ctaTitleKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaTitleKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Subtitle (English)', 'ការពិពណ៌នា CTA (អង់គ្លេស)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.ctaSubtitle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('CTA Subtitle (Khmer)', 'ការពិពណ៌នា CTA (ខ្មែរ)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.ctaSubtitleKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaSubtitleKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Button Text (English)', 'អត្ថបទប៊ូតុង (អង់គ្លេស)')}</label>
                <input
                  type="text"
                  value={siteSettings.ctaBtnText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaBtnText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Button Text (Khmer)', 'អត្ថបទប៊ូតុង (ខ្មែរ)')}</label>
                <input
                  type="text"
                  value={siteSettings.ctaBtnTextKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaBtnTextKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Button Link', 'តំណភ្ជាប់ Link')}</label>
                <input
                  type="text"
                  value={siteSettings.ctaBtnLink}
                  onChange={(e) => setSiteSettings({ ...siteSettings, ctaBtnLink: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                {savingSettings ? t('Saving...', 'កំពុងរក្សាទុក...') : t('Save CTA Changes', 'រក្សាទុក CTA')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 3: ABOUT US CONTENT */}
      {activeTab === 'about' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs">
          <h2 className="text-base font-bold text-[color:var(--text-main)] mb-0.5">{t('About Us Page Content', 'មាតិកាទំព័រ About Us')}</h2>
          <p className="text-xs text-[color:var(--text-muted)] mb-4">{t('Controls company story, mission statement, and vision pillars.', 'គ្រប់គ្រងរឿងរ៉ាវរបស់ក្រុមហ៊ុន បេសកកម្ម និងចក្ខុវិស័យ')}</p>

          <form onSubmit={handleSaveSiteSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Company Story / Bio (English)', 'រឿងរ៉ាវក្រុមហ៊ុន (អង់គ្លេស)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.aboutStory}
                  onChange={(e) => setSiteSettings({ ...siteSettings, aboutStory: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Company Story / Bio (Khmer)', 'រឿងរ៉ាវក្រុមហ៊ុន (ខ្មែរ)')}</label>
                <textarea
                  rows={2}
                  value={siteSettings.aboutStoryKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, aboutStoryKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[color:var(--border-main)]/60">
              <h3 className="text-xs font-bold text-[color:var(--text-main)] mb-2.5">{t('Our Mission Card', 'ប័ណ្ណបេសកកម្ម Mission')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Mission Title (EN)', 'ចំណងជើងបេសកកម្ម (EN)')}</label>
                  <input
                    type="text"
                    value={siteSettings.missionTitle}
                    onChange={(e) => setSiteSettings({ ...siteSettings, missionTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mt-2.5 mb-1">{t('Mission Statement (EN)', 'ខ្លឹមសារបេសកកម្ម (EN)')}</label>
                  <textarea
                    rows={2}
                    value={siteSettings.missionText}
                    onChange={(e) => setSiteSettings({ ...siteSettings, missionText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Mission Title (KH)', 'ចំណងជើងបេសកកម្ម (KH)')}</label>
                  <input
                    type="text"
                    value={siteSettings.missionTitleKh}
                    onChange={(e) => setSiteSettings({ ...siteSettings, missionTitleKh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                  />
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mt-2.5 mb-1">{t('Mission Statement (KH)', 'ខ្លឹមសារបេសកកម្ម (KH)')}</label>
                  <textarea
                    rows={2}
                    value={siteSettings.missionTextKh}
                    onChange={(e) => setSiteSettings({ ...siteSettings, missionTextKh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[color:var(--border-main)]/60">
              <h3 className="text-xs font-bold text-[color:var(--text-main)] mb-2.5">{t('Our Vision Card', 'ប័ណ្ណចក្ខុវិស័យ Vision')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Vision Title (EN)', 'ចំណងជើងចក្ខុវិស័យ (EN)')}</label>
                  <input
                    type="text"
                    value={siteSettings.visionTitle}
                    onChange={(e) => setSiteSettings({ ...siteSettings, visionTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mt-2.5 mb-1">{t('Vision Statement (EN)', 'ខ្លឹមសារចក្ខុវិស័យ (EN)')}</label>
                  <textarea
                    rows={2}
                    value={siteSettings.visionText}
                    onChange={(e) => setSiteSettings({ ...siteSettings, visionText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Vision Title (KH)', 'ចំណងជើងចក្ខុវិស័យ (KH)')}</label>
                  <input
                    type="text"
                    value={siteSettings.visionTitleKh}
                    onChange={(e) => setSiteSettings({ ...siteSettings, visionTitleKh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                  />
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mt-2.5 mb-1">{t('Vision Statement (KH)', 'ខ្លឹមសារចក្ខុវិស័យ (KH)')}</label>
                  <textarea
                    rows={2}
                    value={siteSettings.visionTextKh}
                    onChange={(e) => setSiteSettings({ ...siteSettings, visionTextKh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                {savingSettings ? t('Saving...', 'កំពុងរក្សាទុក...') : t('Save About Us Content', 'រក្សាទុក About Us')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 4: CONTACTS & SOCIALS */}
      {activeTab === 'contacts' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs">
          <h2 className="text-base font-bold text-[color:var(--text-main)] mb-0.5">{t('Company Contacts & Social Media Links', 'ទំនាក់ទំនង និងបណ្តាញសង្គម')}</h2>
          <p className="text-xs text-[color:var(--text-muted)] mb-4">{t('Controls phone, email, physical address, working hours, and social media icons in the Footer and Contact page.', 'គ្រប់គ្រងលេខទូរស័ព្ទ អ៊ីមែល អាសយដ្ឋាន និងតំណភ្ជាប់សង្គមក្នុង Footer និងទំព័រទំនាក់ទំនង')}</p>

          <form onSubmit={handleSaveSiteSettings} className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Official Phone Number', 'លេខទូរស័ព្ទផ្លូវការ')}</label>
                <input
                  type="text"
                  value={siteSettings.phone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Official Support Email', 'អ៊ីមែលផ្លូវការ')}</label>
                <input
                  type="email"
                  value={siteSettings.email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Office Address (English)', 'អាសយដ្ឋាន (អង់គ្លេស)')}</label>
                <input
                  type="text"
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Office Address (Khmer)', 'អាសយដ្ឋាន (ខ្មែរ)')}</label>
                <input
                  type="text"
                  value={siteSettings.addressKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, addressKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Working Hours (English)', 'ម៉ោងធ្វើការ (អង់គ្លេស)')}</label>
                <input
                  type="text"
                  value={siteSettings.workingHours}
                  onChange={(e) => setSiteSettings({ ...siteSettings, workingHours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Working Hours (Khmer)', 'ម៉ោងធ្វើការ (ខ្មែរ)')}</label>
                <input
                  type="text"
                  value={siteSettings.workingHoursKh}
                  onChange={(e) => setSiteSettings({ ...siteSettings, workingHoursKh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs font-battambang"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[color:var(--border-main)]/60">
              <h3 className="text-xs font-bold text-[color:var(--text-main)] mb-2.5">{t('Social Media Links', 'តំណភ្ជាប់បណ្តាញសង្គម')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">Telegram URL</label>
                  <input
                    type="url"
                    value={siteSettings.telegramUrl || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, telegramUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={siteSettings.facebookUrl || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">TikTok URL</label>
                  <input
                    type="url"
                    value={siteSettings.tiktokUrl || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tiktokUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={siteSettings.instagramUrl || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                {savingSettings ? t('Saving...', 'កំពុងរក្សាទុក...') : t('Save Contacts & Socials', 'រក្សាទុកទំនាក់ទំនង')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 5: ADMIN ACCOUNT */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs">
            <h3 className="text-base font-bold text-[color:var(--text-main)] mb-0.5">{t('Profile Details', 'ព័ត៌មានផ្ទាល់ខ្លួន')}</h3>
            <p className="text-xs text-[color:var(--text-muted)] mb-4">{t('Update your administrator display name and profile image.', 'ធ្វើបច្ចុប្បន្នភាពឈ្មោះ និងរូបថតគណនី')}</p>

            <form onSubmit={handleProfileUpdate} className="space-y-3.5">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-20 h-20 rounded-xl bg-[color:var(--bg-secondary)] border-2 border-dashed border-[color:var(--border-main)] flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-7 h-7 text-[color:var(--text-muted)]" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="text-xs text-[color:var(--text-muted)]">
                  <p className="font-bold text-[color:var(--text-main)]">{t('Click image to upload', 'ចុចលើរូបដើម្បីផ្លាស់ប្តូរ')}</p>
                  <p className="mt-0.5">PNG, JPG, or WEBP up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Name', 'ឈ្មោះ')}</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Email Address', 'អ៊ីមែល')}</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? t('Saving...', 'កំពុងរក្សាទុក...') : t('Update Profile', 'ធ្វើបច្ចុប្បន្នភាព')}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[color:var(--bg-main)] p-4 sm:p-5 rounded-2xl border border-[color:var(--border-main)] shadow-xs">
            <h3 className="text-base font-bold text-[color:var(--text-main)] mb-0.5">{t('Change Password', 'ប្តូរពាក្យសម្ងាត់')}</h3>
            <p className="text-xs text-[color:var(--text-muted)] mb-4">{t('Ensure your account is using a strong password.', 'ការពារគណនីរបស់អ្នកដោយប្រើពាក្យសម្ងាត់រឹងមាំ')}</p>

            <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Current Password', 'ពាក្យសម្ងាត់បច្ចុប្បន្ន')}</label>
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('New Password', 'ពាក្យសម្ងាត់ថ្មី')}</label>
                <input
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[color:var(--text-muted)] mb-1">{t('Confirm New Password', 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់')}</label>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] text-xs"
                />
              </div>
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-[color:var(--color-primary)] text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? t('Updating...', 'កំពុងប្តូរ...') : t('Change Password', 'ប្តូរពាក្យសម្ងាត់')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
