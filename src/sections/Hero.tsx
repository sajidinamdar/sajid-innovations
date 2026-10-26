import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code, Database, Sparkles, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface HeroProps {
  onOpenIdeaModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenIdeaModal }) => {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-600/5 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Brand Eyebrow, H1, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 rounded-full shadow-sm">
                {siteConfig.heroEyebrow}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-800 rounded-full">
                Founder: <span className="text-white font-semibold">{siteConfig.founderName}</span>
              </span>
            </div>

            {/* Main H1 - Single primary H1 per Master Prompt */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.18] sm:leading-[1.12]">
              Turning Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Powerful Digital Solutions.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-xl font-normal text-slate-300 text-balance leading-relaxed">
              {siteConfig.heroSubtitle}
            </p>

            {/* Supporting Microcopy */}
            <p className="text-sm sm:text-base font-medium text-cyan-300/90 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {siteConfig.heroMicrocopy}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/enquire/general"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl sm:rounded-lg shadow-lg shadow-blue-600/25 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[44px]"
              >
                <span>Let's Build Something</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl sm:rounded-lg transition-all duration-150 min-h-[44px]"
              >
                <span>Explore What We Build</span>
              </Link>

              <button
                type="button"
                onClick={onOpenIdeaModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 rounded-xl sm:rounded-lg transition-all duration-150 cursor-pointer min-h-[44px]"
              >
                <span>Quick Inquiry Form</span>
              </button>
            </div>

            {/* Small Brand Keywords */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Core Focus:</span>
              {siteConfig.heroKeywords.map((keyword, index) => (
                <React.Fragment key={keyword}>
                  <span className="hover:text-cyan-400 transition-colors">{keyword}</span>
                  {index < siteConfig.heroKeywords.length - 1 && <span className="text-slate-600">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Architecture - Ideas becoming digital solutions */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0B0F17] border border-slate-800/90 p-5 sm:p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Sajid Innovations Architecture
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                  Real Systems
                </span>
              </div>

              {/* Connected Visual Cards */}
              <div className="py-4 space-y-3.5">
                {/* Branch A: Client Services */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                        <Code className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-semibold text-white">Client Digital Solutions</div>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      Direction A
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Custom web applications, business software, AI chatbots, and workflow automation tailored to client requirements.
                  </p>
                </div>

                {/* Connecting Node */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="h-px w-10 bg-slate-800" />
                  <span className="text-cyan-400 text-[11px]">Integrated Under One Brand</span>
                  <span className="h-px w-10 bg-slate-800" />
                </div>

                {/* Branch B: Software Products */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Our Software Products</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                      Direction B
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sajinova Lab — laboratory management software with offline-first SQLite, clinical test catalogs, dynamic PDF reports & WhatsApp sharing.
                  </p>
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Practical · Reliable · Tested
                </span>
                <span className="text-slate-500">Ahilyanagar, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
