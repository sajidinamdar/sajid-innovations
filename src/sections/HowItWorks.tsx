import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface HowItWorksProps {
  onOpenIdeaModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenIdeaModal }) => {
  return (
    <section id="process" className="py-16 sm:py-20 md:py-28 bg-[#0B0F17] border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3.5 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Structured Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
            From Idea to Implementation
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            A clear, dependable process whether you need a tailored digital solution or a product demonstration.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {siteConfig.processSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all shadow-md"
            >
              <div>
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {step.step}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-cyan-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < siteConfig.processSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reassurance banner */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0E1523] to-[#111827] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-semibold text-white mb-1">
                Transparent Milestones & Verified Deliverables
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We agree on deliverables, timeline, and requirements before any work begins. No surprises or unexpected complexities.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/enquire/general"
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 min-h-[44px]"
            >
              <span>Start the Conversation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenIdeaModal}
              className="px-4 py-3.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              Quick Form
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
