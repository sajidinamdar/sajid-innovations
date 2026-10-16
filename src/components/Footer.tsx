import React from 'react';
import { Mail, Phone, MessageSquare, Instagram, Github, Linkedin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface FooterProps {
  onOpenPrivacyModal?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onNavigateToAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080B11] border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt={siteConfig.brandName}
                className="w-10 h-10 object-contain rounded-full shadow-sm"
              />
              <div className="flex flex-col text-left">
                <span className="text-base font-bold text-white tracking-tight leading-tight">{siteConfig.brandName}</span>
                <span className="text-[11px] text-slate-400 font-normal leading-tight">{siteConfig.brandPositioning}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Building practical websites, custom applications, intelligent tools, and digital products based on real requirements.
            </p>
            <div className="text-xs text-slate-400 font-medium">
              Founder: <span className="text-white font-semibold">{siteConfig.founderName}</span>
            </div>
            <div className="text-xs text-slate-500">
              {siteConfig.location} · {siteConfig.timezone}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#about" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition-colors">Projects</a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Solutions & Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Software Solutions
            </h4>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.services.map(svc => (
                <li key={svc.id}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {svc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Channels */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Connect Directly
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors text-emerald-400/90"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ({siteConfig.primaryPhone})</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.primaryPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Call: {siteConfig.primaryPhone}</span>
                </a>
              </li>
              <li className="pt-2 flex items-center gap-3">
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                {siteConfig.linkedinUrl && (
                  <a
                    href={siteConfig.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>© {currentYear} {siteConfig.brandName}. All rights reserved.</span>
            <span>·</span>
            <span className="text-slate-600">No cookies or tracking pixels collected</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacyModal}
              className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={onNavigateToAdmin}
              className="hover:text-slate-300 transition-colors cursor-pointer text-slate-500 hover:text-blue-400"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
