import React from 'react';
import { Mail, Phone, MessageSquare, Instagram, Github, Linkedin, ArrowUpRight, Sparkles, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface ContactProps {
  onOpenIdeaModal: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenIdeaModal }) => {
  return (
    <section id="contact" className="py-14 sm:py-20 md:py-28 bg-[#0B0F17] border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading and Messaging Channels */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Direct Communication</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
              Let's Discuss Your Project
            </h2>

            <div className="text-base sm:text-lg font-medium text-slate-200">
              Have an idea, a business problem, or a software requirement?
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Tell me what you want to build. I'll review your requirements and discuss the possible approach, estimated scope, and next steps.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Card */}
              <a
                href={siteConfig.getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/40 hover:border-emerald-800 transition-all group min-h-[48px]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/60 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      WhatsApp Message
                    </div>
                    <div className="text-xs text-emerald-400/80 font-mono">
                      {siteConfig.primaryPhone} · Instant chat
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${siteConfig.email}?subject=Project%20Inquiry%20via%20Sajid%20Innovations`}
                className="flex items-center justify-between p-4 rounded-xl bg-[#111827] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all group min-h-[48px]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      Email Inquiry
                    </div>
                    <div className="text-xs text-slate-400 font-mono truncate">
                      {siteConfig.email}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Phone Calling Card */}
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-indigo-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Telephone</div>
                    <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-2">
                      <a href={`tel:${siteConfig.primaryPhone.replace(/\s+/g, '')}`} className="hover:text-white underline">
                        {siteConfig.primaryPhone}
                      </a>
                      <span>·</span>
                      <a href={`tel:${siteConfig.alternativePhone.replace(/\s+/g, '')}`} className="hover:text-white underline">
                        Alt: {siteConfig.alternativePhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social media links */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Social Profiles:</span>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>
              {siteConfig.linkedinUrl && (
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Idea Submission Callout Box */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#111827] to-[#0E1523] border border-slate-800 rounded-2xl p-5 sm:p-7 md:p-9 space-y-5 sm:space-y-6 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Have a Detailed Idea or Requirements?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Use the guided inquiry submission form to describe your problem, requested features, timeline preference, and estimated budget. You'll receive a unique Reference ID for quick tracking.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Strictly confidential and private idea discussion</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Instant Reference ID generated (e.g. SI-2026-XXXXXX)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>1-click WhatsApp follow-up with your reference number</span>
              </div>
            </div>

            <button
              onClick={onOpenIdeaModal}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-h-[48px]"
            >
              <span>Open Project Inquiry Form</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
