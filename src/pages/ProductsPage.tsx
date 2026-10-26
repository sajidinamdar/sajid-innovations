import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Database,
  FileText,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  HardDrive
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface ProductsPageProps {
  onOpenIdeaModal: (serviceTitle?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenIdeaModal }) => {
  const sajinova = siteConfig.products[0];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Sajinova Lab',
    'operatingSystem': 'Windows 10, Windows 11',
    'applicationCategory': 'BusinessApplication, HealthApplication',
    'description':
      'Laboratory management software product designed for diagnostic and pathology laboratory workflows with offline-first resilience, clinical test catalog, dynamic PDF reports, and WhatsApp sharing.',
    'offers': {
      '@type': 'Offer',
      'price': 'Contact for pricing',
      'priceCurrency': 'INR'
    },
    'author': {
      '@type': 'Organization',
      'name': 'Sajid Innovations'
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <SEO
        title="Products | Sajid Innovations - In-House Software Products"
        description="Software Built for Practical Use. Discover our proprietary software products like Sajinova Lab, engineered for diagnostic and clinical laboratory workflows."
        canonicalUrl="https://www.sajidinnovations.in/products"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Direction B · In-House Software Products</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Software Built for Practical Use
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed">
            We build focused software products designed to address specific operational challenges. Our products prioritize reliability, clear workflows, and long-term usability.
          </p>
        </div>

        {/* Featured Product Banner: Sajinova Lab */}
        {sajinova && (
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#0E1626] to-[#0A0E17] border border-blue-900/50 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Product Info */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Featured In-House Product
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                    {sajinova.category}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src="/sajinova-lab-icon.png"
                    alt={sajinova.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-900 p-1 border border-blue-500/30 shadow-lg shadow-blue-500/10 shrink-0"
                  />
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {sajinova.name}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-blue-300 mt-1">
                      {sajinova.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-base text-slate-300 leading-relaxed">
                  {sajinova.description}
                </p>

                {/* Key Capabilities */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Key Features Verified in Source Code:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>100% Offline-First (No internet required)</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Patient & Referring Doctor Management</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Clinical Test Catalog & Reference Rules</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Multi-Page Clinical PDF Reports</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Direct WhatsApp Report Sharing</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Hardware-Bound Encrypted Database Lock</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    to="/sajinova-lab"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/30 min-h-[44px]"
                  >
                    <span>Explore Sajinova Lab</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/enquire/sajinova-lab-demo"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all min-h-[44px]"
                  >
                    <span>Request a Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Specs Box */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-300">Technical Specifications</span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                    Windows Desktop
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Target Operating System</span>
                    <span className="text-slate-200 font-medium">Windows 10 / Windows 11</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Architecture</span>
                    <span className="text-slate-200 font-medium">Offline-First Resilience</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Database Engine</span>
                    <span className="text-slate-200 font-medium">Local Encrypted SQLite (17 Relational Tables)</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Security Model</span>
                    <span className="text-slate-200 font-medium">Hardware-Bound Workstation Encryption</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400">Disaster Recovery</span>
                    <span className="text-slate-200 font-medium">Automated Hot Backups & Snapshots</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 text-[11px] text-blue-300 leading-relaxed">
                  We do not market prototype mockups. Sajinova Lab is an engineered desktop software product verified against real clinical pathology workflows.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
