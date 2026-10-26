import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Instagram, Github, ShieldCheck, ArrowUpRight, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface FooterProps {
  onOpenPrivacyModal?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onNavigateToAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070A10] border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 text-left">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt={siteConfig.brandName}
                className="w-10 h-10 object-contain rounded-full shadow-sm"
              />
              <div className="flex flex-col text-left">
                <span className="text-base font-bold text-white tracking-tight leading-tight">
                  {siteConfig.brandName}
                </span>
                <span className="text-[11px] text-cyan-400 font-normal leading-tight">
                  Technology Solutions & Software Products
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              We turn ideas into practical digital solutions that help businesses grow and solve real-world problems through technology and innovation.
            </p>
            <div className="text-xs text-slate-400 font-medium">
              Founder: <span className="text-white font-semibold">{siteConfig.founderName}</span>
            </div>
            <div className="text-xs text-slate-500">
              {siteConfig.location} · {siteConfig.timezone}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Website Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  Client Services
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-400 transition-colors">
                  Our Software Products
                </Link>
              </li>
              <li>
                <Link to="/sajinova-lab" className="hover:text-cyan-400 transition-colors">
                  Sajinova Lab (Product)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  About Sajid Innovations
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Products */}
          <div className="text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Solutions & Software
            </h4>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.services.map((svc) => (
                <li key={svc.id}>
                  <Link to={`/services#${svc.slug}`} className="hover:text-cyan-400 transition-colors">
                    {svc.title}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-800/80">
                <Link to="/sajinova-lab" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Sajinova Lab (Laboratory Management)
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Channels & Verification */}
          <div className="text-left space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteConfig.location}</span>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.getWhatsAppUrl("Hi Sajid! I would like to inquire about Sajid Innovations.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>WhatsApp: {siteConfig.primaryPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.primaryPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{siteConfig.primaryPhone}</span>
                </a>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-slate-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with Privacy, Sitemap, and Admin access */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left space-y-1">
            <div>
              <span>© {currentYear} {siteConfig.brandName}. All rights reserved.</span>
            </div>
            <div className="text-slate-400">
              <span>{siteConfig.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            {onOpenPrivacyModal && (
              <button
                type="button"
                onClick={onOpenPrivacyModal}
                className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Privacy Policy</span>
              </button>
            )}

            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
              Sitemap
            </a>

            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="text-slate-400 hover:text-slate-400 transition-colors cursor-pointer text-[11px]"
              >
                Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
