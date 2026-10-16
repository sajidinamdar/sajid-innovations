import React from 'react';
import { ShieldCheck, MessageCircle, FileText, CheckCircle2, RefreshCw, Cpu, Award } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const Trust: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />;
      case 1: return <FileText className="w-5 h-5 text-indigo-400 shrink-0" />;
      case 2: return <Award className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 3: return <RefreshCw className="w-5 h-5 text-purple-400 shrink-0" />;
      case 4: return <Cpu className="w-5 h-5 text-amber-400 shrink-0" />;
      case 5: return <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />;
      default: return <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#090D14] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Trust & Transparency</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
            Clear Communication. Practical Solutions.
          </h2>

          <p className="text-sm sm:text-lg text-slate-400 leading-relaxed">
            Sajid Innovations is a growing software development brand focused on building useful digital solutions and establishing trust through transparent working practices.
          </p>
        </div>

        {/* 6 Trust Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {siteConfig.trustPrinciples.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#0E1523] border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
                  {getIcon(idx)}
                </div>
                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Commitment Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-indigo-950/30 border border-blue-900/40 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-base font-medium text-slate-200">
              We believe trust comes from honest communication, realistic commitments, and delivering the work agreed upon.
            </p>
          </div>
          <a
            href="#contact"
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs font-semibold text-center text-white bg-blue-600 hover:bg-blue-500 rounded-xl sm:rounded-lg whitespace-nowrap transition-colors shrink-0 min-h-[44px] sm:min-h-0 flex items-center justify-center"
          >
            Start a Conversation
          </a>
        </div>
      </div>
    </section>
  );
};
