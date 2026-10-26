import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Instagram, Github, ArrowUpRight, Sparkles, MapPin, ShieldCheck, Check } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface ContactProps {
  onOpenIdeaModal: (serviceTitle?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenIdeaModal }) => {
  const getCategoryEnquiryUrl = (category: string) => {
    switch (category) {
      case 'Website Design & Development': return '/enquire/website-development';
      case 'Custom Software Development': return '/enquire/custom-software';
      case 'AI Applications & Chatbots': return '/enquire/ai-solutions';
      case 'Business Automation': return '/enquire/business-automation';
      case 'Sajinova Lab Demo': return '/enquire/sajinova-lab-demo';
      default: return '/enquire/general';
    }
  };
  return (
    <section id="contact" className="py-16 sm:py-20 md:py-28 bg-[#0B0F17] border-t border-slate-900/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading and Messaging Channels */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Direct Communication</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
              Have an Idea? Let's Build It.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Tell us about your business idea, custom software requirement, or request a demo of Sajinova Lab. We will reply directly with practical guidance, estimated scope, and next steps.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Card */}
              <a
                href={siteConfig.getWhatsAppUrl("Hi Sajid! I would like to discuss a project with Sajid Innovations.")}
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
                    <div className="text-xs text-emerald-400/90 font-mono">
                      {siteConfig.primaryPhone} · Instant chat
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${siteConfig.email}?subject=Project%20Inquiry%20via%20Sajid%20Innovations`}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-b from-[#111827] to-[#0D131F] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all group min-h-[48px]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Direct Email
                    </div>
                    <div className="text-xs text-slate-300 font-mono truncate">
                      {siteConfig.email}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Phone Calling Card */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Direct Phone</div>
                    <div className="text-xs text-slate-300 font-mono flex flex-wrap items-center gap-2">
                      <a href={`tel:${siteConfig.primaryPhone.replace(/\s+/g, '')}`} className="hover:text-cyan-300 underline">
                        {siteConfig.primaryPhone}
                      </a>
                      <span className="text-slate-500">·</span>
                      <a href={`tel:${siteConfig.alternativePhone.replace(/\s+/g, '')}`} className="hover:text-cyan-300 underline">
                        Alt: {siteConfig.alternativePhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Assurance */}
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Location: {siteConfig.location} · Indian Standard Time ({siteConfig.timezone})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No spam. We reply directly with practical guidance about your project or product inquiry.</span>
              </div>
            </div>

            {/* Social media links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Verified Profiles:</span>
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
                <span>{siteConfig.instagramUsername}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Selector */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#111827] to-[#0E1523] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Start Your Inquiry Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Select your area of interest below to open our structured inquiry form. You will receive an instant Reference ID (e.g. SI-2026-XXXXXX) for direct tracking.
              </p>
            </div>

            {/* Quick Category Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {siteConfig.serviceCategories.map((category) => (
                <Link
                  key={category}
                  to={getCategoryEnquiryUrl(category)}
                  className="p-3 text-left rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-xs text-slate-200 hover:text-white flex items-center justify-between group"
                >
                  <span className="font-medium truncate">{category}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-1" />
                </Link>
              ))}
            </div>

            <Link
              to="/enquire/general"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[48px]"
            >
              <span>Open Complete Inquiry Form</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
