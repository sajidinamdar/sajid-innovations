import React from 'react';
import { ArrowRight, CheckCircle2, Code2, MessageSquare } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#090D14] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bio & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>About the Developer</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              A Developer Who Loves Turning Problems Into Solutions
            </h2>

            <div className="space-y-4 text-slate-300 text-base leading-relaxed">
              {siteConfig.aboutParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Quick Action Links */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-colors text-sm font-medium"
              >
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>See Past Work & Solutions</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href={siteConfig.getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Technology Matrix */}
          <div className="lg:col-span-6 bg-[#0E1523] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <Code2 className="w-5 h-5 text-blue-400" />
                <span>What I Build & Deliver</span>
              </div>
              <span className="text-xs text-slate-400">Reliable & Easy to Maintain</span>
            </div>

            <div className="space-y-6">
              {siteConfig.techStackGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {group.category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-800 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Clear communication, tested working software, and direct support on every project.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
