import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-28 bg-[#090D14] border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Bio & Core Mission */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>About Sajid Innovations</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
              {siteConfig.aboutHeading}
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {siteConfig.aboutParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="text-white font-bold">{siteConfig.founderName}</div>
                <div className="text-slate-400">{siteConfig.founderRole} · Ahilyanagar, Maharashtra, India</div>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 min-h-[44px]"
              >
                <span>Learn More About Sajid Innovations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/enquire/general"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors min-h-[44px]"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Two Business Directions Breakdown */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">Our Two Business Directions</h3>
              <p className="text-xs text-slate-400">One technology brand with dedicated focus areas</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">A. Client Services</span>
                  <span className="text-[10px] text-slate-400 font-mono">Custom Built</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tailored web development, custom software, business automation, and conversational AI chatbots designed around specific business needs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">B. Software Products</span>
                  <span className="text-[10px] text-slate-400 font-mono">In-House</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Specialized software products like Sajinova Lab for pathology laboratories, solving industry problems with offline resilience and local data security.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Direct communication and ongoing practical support.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
