import React from 'react';
import { ArrowUpRight, MessageSquare, Terminal, Cpu, Database, Server, Layers } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface HeroProps {
  onOpenIdeaModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenIdeaModal }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-transparent blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-950/40 border border-blue-800/40 rounded-full">
              <span>{siteConfig.brandPositioning}</span>
              <span aria-hidden="true">·</span>
              <span>Founder: {siteConfig.founderName}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.15]">
              Have a Business Idea? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">
                Let's Build It.
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-normal text-slate-300 text-balance leading-relaxed">
              {siteConfig.heroSubtitle}
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              {siteConfig.heroParagraph}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenIdeaModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/25 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all duration-150"
              >
                <span>Explore My Projects</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all duration-150"
              >
                <span>Contact Me</span>
              </a>
            </div>

            {/* Supporting Text */}
            <div className="pt-5 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {siteConfig.heroSupportingText}
            </div>
          </div>

          {/* Right Column: Clear Solution Architecture Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0F172A] border border-slate-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">How Your Application Works</span>
                <span className="text-slate-400">Complete System</span>
              </div>

              {/* Architecture nodes diagram */}
              <div className="py-6 space-y-4">
                {/* Node 1: What users see */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">What Your Customers See</div>
                      <div className="text-xs text-slate-400">Clean web & mobile screens · Fast, simple & easy to use</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-blue-400/90">Web & Phone</span>
                </div>

                {/* Connection line */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-slate-800" />
                </div>

                {/* Node 2: Behind the scenes engine */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Behind-the-Scenes Business Engine</div>
                      <div className="text-xs text-slate-400">User accounts · Automated notifications · Fast processing</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-400/90">Core Engine</span>
                </div>

                {/* Connection line */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-slate-800" />
                </div>

                {/* Node 3: AI & Data Vault */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold text-white">Smart AI Assistant</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Answers questions from your PDFs & chats 24/7</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">Secure Data Vault</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Customer records kept safe, backed up & private</p>
                  </div>
                </div>
              </div>

              {/* Status footer inside schematic */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Direct collaboration with the engineer</span>
                <span className="text-slate-300 font-medium">Status: Ready to build</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
