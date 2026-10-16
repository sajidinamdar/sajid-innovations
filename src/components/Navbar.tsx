import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface NavbarProps {
  onOpenIdeaModal: (preselectedService?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenIdeaModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <a
          href="#"
          className="group flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <img
            src="/logo.png"
            alt={siteConfig.brandName}
            className="w-10 h-10 object-contain rounded-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col text-left">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              {siteConfig.brandName}
            </span>
            <span className="text-[11px] sm:text-xs font-normal text-slate-400 tracking-normal leading-tight">
              {siteConfig.brandSubtitle}
            </span>
          </div>
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <a
            href="#about"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
          >
            About
          </a>
          <a
            href="#services"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
          >
            Services
          </a>
          <a
            href="#projects"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
          >
            Projects
          </a>
          <a
            href="#process"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
          >
            FAQ
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button
            onClick={() => onOpenIdeaModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-md shadow-blue-600/25 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>Share Your Idea</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => onOpenIdeaModal()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md whitespace-nowrap"
          >
            Share Idea
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F17]/95 border-b border-slate-800 px-6 py-6 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-200">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              About Sajid
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Services & Capabilities
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Featured Projects
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Frequently Asked Questions
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Direct Contact
            </a>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenIdeaModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
              >
                <span>Share Your Idea</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <a
                href={siteConfig.getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-center text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
              >
                Chat on WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
