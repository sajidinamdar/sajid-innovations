import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface NavbarProps {
  onOpenIdeaModal: (preselectedService?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenIdeaModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route or hash change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/#faq' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path && !location.hash;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-[#0B0F17]/70 backdrop-blur-sm border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-8">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 sm:gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
        >
          <img
            src="/logo.png"
            alt={siteConfig.brandName}
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-full shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col text-left">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              {siteConfig.brandName}
            </span>
            <span className="text-xs font-normal text-slate-400 tracking-normal leading-tight hidden sm:block">
              {siteConfig.brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Navigation Links for Desktop */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${
                isActive(link.path)
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                  : 'hover:text-cyan-400 text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions CTA (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/enquire/general"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 min-h-[40px]"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to="/enquire/general"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg min-h-[36px] flex items-center"
          >
            Let's Talk
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090D14]/98 border-b border-slate-800 px-5 pt-4 pb-6 space-y-3 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-slate-900/90 font-semibold'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/enquire/general"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-2"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenIdeaModal();
              }}
              className="w-full py-3 text-center text-xs font-medium text-slate-300 hover:text-white bg-slate-900 rounded-xl border border-slate-800"
            >
              Quick Inquiry Form
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
