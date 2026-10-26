import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, MessageSquare, Layers, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const Trust: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Target className="w-5 h-5 text-cyan-400 shrink-0" />;
      case 1: return <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />;
      case 2: return <Layers className="w-5 h-5 text-indigo-400 shrink-0" />;
      case 3: return <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />;
      default: return <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[#090D14] border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3.5 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Why Sajid Innovations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
            Practical Thinking. Purposeful Technology.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We focus on software that solves real operational bottlenecks, built with transparency and dependable craftsmanship.
          </p>
        </div>

        {/* 4 Honest Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {siteConfig.whyPrinciples.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-3.5"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                  {getIcon(idx)}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-0 sm:pl-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Commitment Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/20 via-slate-900/80 to-blue-950/20 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
              We believe trust comes from honest communication, realistic commitments, and delivering tested, dependable work.
            </p>
          </div>
          <Link
            to="/about"
            className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold text-center text-white bg-blue-600 hover:bg-blue-500 rounded-xl whitespace-nowrap transition-colors shrink-0 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>Learn More About Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
