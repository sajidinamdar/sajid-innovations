import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface HowItWorksProps {
  onOpenIdeaModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenIdeaModal }) => {
  return (
    <section id="process" className="py-20 md:py-28 bg-[#0B0F17] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Development Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
            From Idea to Working Solution
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            A clear, structured 5-step approach to discuss requirements, build agreed features, and deliver working solutions.
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {siteConfig.processSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative group hover:border-slate-700 transition-all"
            >
              <div>
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-blue-400">
                    {step.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-blue-500 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < siteConfig.processSteps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reassurance banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0E1523] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Transparent Collaboration & Agreed Milestones
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No surprises or hidden fees. Scope, milestones, deliverables, and communication cadence are clearly agreed in writing before any development starts.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenIdeaModal}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Start with Step 01
          </button>
        </div>
      </div>
    </section>
  );
};
