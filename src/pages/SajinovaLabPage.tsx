import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Database,
  FileText,
  MessageCircle,
  ShieldCheck,
  WifiOff,
  Users,
  Activity,
  KeyRound,
  HardDriveDownload,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface SajinovaLabPageProps {
  onOpenDemoRequest: () => void;
}

export const SajinovaLabPage: React.FC<SajinovaLabPageProps> = ({ onOpenDemoRequest }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const productFaqs = [
    {
      question: 'Does Sajinova Lab require an active internet connection to generate reports?',
      answer:
        'No. Sajinova Lab is engineered with an offline-first architecture. All patient data entry, test catalog calculations, reference interval checks, and PDF report generation run locally on your Windows computer without an active internet connection. Internet is only used when you choose to send reports via WhatsApp.'
    },
    {
      question: 'Can I customize the diagnostic report with our lab header and doctor signature?',
      answer:
        'Yes. Sajinova Lab provides full report customizability. You can upload your laboratory logo, clinic header, custom footer notes, and pathologist digital signature. You can also print on pre-printed laboratory stationery by toggling the header margin offset.'
    },
    {
      question: 'How are clinical test reference ranges configured?',
      answer:
        'The software includes an organized clinical test catalog where you can configure parameter units, age- and gender-specific normal reference intervals, and optional critical threshold warnings. Values outside standard intervals are automatically highlighted with visual badges (HIGH, LOW, CRITICAL).'
    },
    {
      question: 'How does the hardware-bound database lock protect patient records?',
      answer:
        'The local SQLite database (17 relational tables) is protected with a machine-bound encryption key tied to the authorized laboratory computer. This prevents unauthorized duplication or extraction of sensitive clinical records if database files are copied to another system.'
    },
    {
      question: 'What happens to our diagnostic data if a subscription license expires?',
      answer:
        'Your data is never locked or deleted. Sajinova Lab guarantees permanent read-only and export access to all existing patient records and historical reports even if an active license expires. You can always view, search, and reprint past reports.'
    },
    {
      question: 'How do I request a live demonstration for my laboratory?',
      answer:
        'You can request a demonstration using the online form on this page or by contacting Sajid Innovations directly on WhatsApp (+91 8329465339). We will schedule a personalized walkthrough tailored to your clinical test volume and workflow.'
    }
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Sajinova Lab',
    'operatingSystem': 'Windows 10, Windows 11',
    'applicationCategory': 'BusinessApplication, HealthApplication',
    'description':
      'A reliable, offline-first desktop application designed to streamline laboratory workflows, manage patient records and clinical tests, generate multi-page PDF reports, and share results via WhatsApp.',
    'offers': {
      '@type': 'Offer',
      'price': 'Contact for pricing',
      'priceCurrency': 'INR'
    },
    'author': {
      '@type': 'Organization',
      'name': 'Sajid Innovations',
      'url': 'https://www.sajidinnovations.in/'
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <SEO
        title="Sajinova Lab | Laboratory Management Software for Diagnostic Labs"
        description="Offline-first desktop software for pathology and diagnostic laboratories. Streamline patient records, clinical test catalogs, dynamic multi-page PDF reports, and WhatsApp sharing."
        canonicalUrl="https://www.sajidinnovations.in/sajinova-lab"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* 1. Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 rounded-full">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                SAJINOVA LAB · LABORATORY MANAGEMENT SOFTWARE
              </span>
              <span className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                Windows Desktop
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.15]">
              Purpose-Built Software for Diagnostic & Pathology Laboratories
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed text-balance">
              A reliable, offline-first desktop application designed to streamline laboratory workflows, manage patient records and clinical tests, generate multi-page PDF reports, and share results via WhatsApp.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to="/enquire/sajinova-lab-demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/30 min-h-[44px]"
              >
                <span>Request a Demo</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                to="/enquire/sajinova-lab-demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all min-h-[44px]"
              >
                <span>Inquire About Licensing</span>
              </Link>

              <a
                href={siteConfig.getWhatsAppUrl("Hi Sajid! I would like to schedule a demonstration of Sajinova Lab for my diagnostic laboratory.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/40 rounded-xl transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Demo Request</span>
              </a>
            </div>
          </div>

          {/* Right Product Card / Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-b from-[#111827] to-[#0A0E17] border border-blue-900/40 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
                <img
                  src="/sajinova-lab-icon.png"
                  alt="Sajinova Lab"
                  width={64}
                  height={64}
                  loading="eager"
                  decoding="async"
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-900 p-1 border border-blue-500/30 shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Sajinova Lab</h3>
                  <p className="text-xs text-cyan-400 font-mono">v1.0 Commercial Release</p>
                  <p className="text-xs text-slate-400">Clinical Pathology Management</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Architecture</span>
                  <span className="text-slate-200 font-medium">100% Offline Resilience</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Database</span>
                  <span className="text-slate-200 font-medium">17 Relational SQLite Tables</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">PDF Engine</span>
                  <span className="text-slate-200 font-medium">ReportLab 2-Pass Dynamic</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Security</span>
                  <span className="text-slate-200 font-medium">Hardware-Bound Workstation Encryption</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-slate-400">Sharing</span>
                  <span className="text-slate-200 font-medium">1-Click Direct WhatsApp</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 leading-relaxed">
                Zero internet latency. Keep generating and printing diagnostic reports even during local network outages.
              </div>
            </div>
          </div>
        </div>

        {/* 2. The Operational Challenge */}
        <div className="space-y-8 text-left">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>The Operational Challenge</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Pathology Laboratories Struggle With Fragile Systems
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Diagnostic centers operate under strict turnaround deadlines. Fragile cloud setups and manual recordkeeping create constant operational friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-white">Internet Outages</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cloud-only web applications freeze when internet connections fluctuate, stopping report generation and patient turnaround.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-white">Spreadsheet Chaos</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Relying on spreadsheets causes accidental overwrites, misplaced patient numbers, and hours wasted compiling reports.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-white">Inconsistent Formats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lack of standardized normal reference ranges and dynamic tables makes reports look unprofessional and hard for doctors to review.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-white">Risk of Data Loss</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hardware crashes or accidental file corruption without automated snapshots risk wiping months of clinical history.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Verified Core Features */}
        <div className="space-y-8 text-left">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Verified Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Complete Laboratory Reliability
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every feature below is verified in the application source code and built for daily high-volume diagnostic workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Offline-First Resilience</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                All functions—from patient intake to report compilation—run on the local Windows workstation with zero continuous internet required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Patient & Doctor Directory</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fast patient lookup by mobile or ID, complete registration records, and referring doctor profiles with commission / referral tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Clinical Test Catalog & Reference Rules</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Configurable parameters with age- and gender-specific reference intervals, including automatic HIGH, LOW, and CRITICAL flags.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Dynamic Multi-Page Clinical PDF Reports</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ReportLab 2-pass dynamic layout with lab header, logo, digital pathologist signature, and tamper-evident SHA-256 audit hashes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Direct WhatsApp Report Sharing</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Share clinical reports directly with patients and referring doctors with pre-filled message templates and instant attachment.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Hardware-Bound DB Lock Security</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Encrypted local SQLite database bound to the authorized workstation hardware to prevent unauthorized copying and protect patient confidentiality.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <HardDriveDownload className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Hot SQLite Backups & Recovery</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Online non-blocking database backups and automated pre-restore safety snapshots ensure clinical history is always protected.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Cryptographic Licensing</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Secure offline cryptographic activation keys supporting flexible license terms with permanent, tamper-proof data preservation.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Dedicated Technical Support</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct onboarding, custom test catalog import assistance, and continuous technical updates from Sajid Innovations.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Technical Specifications Table */}
        <div className="space-y-6 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Technical Architecture & Specifications
          </h2>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#111827]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Component</th>
                  <th className="py-3.5 px-4 sm:px-6">Specification</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Benefit to Laboratory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">Operating System</td>
                  <td className="py-3.5 px-4 sm:px-6">Windows 10 / Windows 11 (64-bit)</td>
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-400">Installs directly on existing clinic reception and lab PCs</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">Runtime & UI</td>
                  <td className="py-3.5 px-4 sm:px-6">Python 3.12 · Qt6 (PySide6)</td>
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-400">High-performance native desktop rendering with zero browser lag</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">Database Engine</td>
                  <td className="py-3.5 px-4 sm:px-6">Local SQLite (17 Relational Tables)</td>
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-400">Zero cloud maintenance; lightning-fast local queries</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">Database Encryption</td>
                  <td className="py-3.5 px-4 sm:px-6">Hardware-Bound Workstation Encryption</td>
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-400">Database cannot be read if copied to an unauthorized PC</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">Reporting Engine</td>
                  <td className="py-3.5 px-4 sm:px-6">ReportLab 2-Pass Clinical Engine</td>
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-400">Dynamic multi-page clinical reports with audit verification hashes</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">Disaster Recovery</td>
                  <td className="py-3.5 px-4 sm:px-6">Hot Online Backups & Safety Snapshots</td>
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-400">One-click data backup without interrupting receptionist work</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Product FAQs */}
        <div className="space-y-6 text-left">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sajinova Lab Questions & Answers
            </h2>
            <p className="text-sm text-slate-400">
              Clear answers regarding deployment, licensing, and day-to-day laboratory operations.
            </p>
          </div>

          <div className="space-y-3">
            {productFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl bg-[#111827] border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer text-sm sm:text-base font-semibold text-white"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Demo Request Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 border border-blue-900/40 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to modernise your diagnostic laboratory?
            </h3>
            <p className="text-sm text-slate-300">
              Request a guided walkthrough of Sajinova Lab and see how offline-first resilience can eliminate reporting delays.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/enquire/sajinova-lab-demo"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all text-center shadow-lg shadow-blue-600/30 min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>Request a Live Demo</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={siteConfig.getWhatsAppUrl("Hi Sajid! I would like to schedule a demo of Sajinova Lab.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 text-sm font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-900/50 rounded-xl transition-colors text-center min-h-[44px] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
