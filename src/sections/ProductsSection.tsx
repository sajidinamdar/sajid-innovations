import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  ShieldCheck,
  FileText,
  MessageCircle,
  Cpu,
  Database,
  ArrowRight
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface ProductsSectionProps {
  onOpenDemoRequest?: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onOpenDemoRequest }) => {
  const sajinova = siteConfig.products[0];

  return (
    <section id="products" className="py-16 sm:py-20 md:py-28 bg-[#090D15] relative overflow-hidden">
      {/* Background radial accent */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3.5 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Direction B · In-House Software Products</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
            Our Software Products
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We build our own software products to address practical challenges in specific industries.
          </p>
        </div>

        {/* Featured Product Card: Sajinova Lab */}
        {sajinova && (
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#0E1626] to-[#0A0E17] border border-blue-900/40 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Product Info & Verified Highlights */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex flex-wrap items-center gap-3">
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
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-slate-900 p-1 border border-blue-500/30 shadow-lg shadow-blue-500/10 shrink-0"
                  />
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                      {sajinova.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-blue-300 mt-1">
                      {sajinova.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {sajinova.description}
                </p>

                {/* Verified Specs / Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-white">100% Offline-First</div>
                      <div className="text-slate-400">Works without continuous internet</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-white">Clinical PDF Engine</div>
                      <div className="text-slate-400">Automated multi-page dynamic reports</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-white">WhatsApp Integration</div>
                      <div className="text-slate-400">Send reports directly with one click</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-white">Encrypted DB Security</div>
                      <div className="text-slate-400">Hardware-bound local protection</div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
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

              {/* Product Visual Mockup / Specs Summary */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-300">Technical Specifications</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      Production Ready
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                      <span className="text-slate-400">Platform</span>
                      <span className="text-slate-200 font-medium">Windows Desktop (10 / 11)</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                      <span className="text-slate-400">Architecture</span>
                      <span className="text-slate-200 font-medium">Offline-First Resilience</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                      <span className="text-slate-400">Database</span>
                      <span className="text-slate-200 font-medium">Local Encrypted SQLite (17 Tables)</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                      <span className="text-slate-400">Security Model</span>
                      <span className="text-slate-200 font-medium">Hardware-Bound Workstation Encryption</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400">Report Generator</span>
                      <span className="text-slate-200 font-medium">ReportLab 2-Pass Clinical Engine</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-[11px] text-blue-300 leading-relaxed">
                    Designed specifically for pathology labs and diagnostic clinics looking to modernize operations without dependency on constant cloud uptime.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
