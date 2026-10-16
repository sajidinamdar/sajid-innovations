import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, Mail, Sparkles, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface FloatingContactWidgetProps {
  onOpenIdeaModal: () => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ onOpenIdeaModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <aside
      aria-label="Quick Contact Assistance"
      ref={widgetRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end print:hidden select-none"
    >
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="mb-3 w-[calc(100vw-2rem)] max-w-[280px] sm:w-64 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl shadow-black/60 p-3 space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="px-2 py-1 text-xs font-semibold text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
            <span>Quick Connect</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
              aria-label="Close contact menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* WhatsApp option */}
          <a
            href={siteConfig.getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">WhatsApp Chat</span>
              <span className="text-[10px] text-emerald-400/80">Direct mobile chat</span>
            </div>
          </a>

          {/* Share Idea Form trigger */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenIdeaModal();
            }}
            role="menuitem"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/40 rounded-lg transition-colors text-left"
          >
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Share Your Idea</span>
              <span className="text-[10px] text-blue-400/80">Submit project details</span>
            </div>
          </button>

          {/* Email option */}
          <a
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry%20from%20Portfolio`}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col truncate">
              <span className="font-semibold">Send Email</span>
              <span className="text-[10px] text-slate-400 truncate">{siteConfig.email}</span>
            </div>
          </a>

          {/* Call option */}
          <a
            href={`tel:${siteConfig.primaryPhone.replace(/\s+/g, '')}`}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Call Directly</span>
              <span className="text-[10px] text-slate-400">{siteConfig.primaryPhone}</span>
            </div>
          </a>
        </div>
      )}

      {/* Main floating trigger pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Open contact and messaging options"
        className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs rounded-full shadow-xl shadow-emerald-950/50 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageSquare className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
        <span className="hidden sm:inline font-semibold tracking-wide">Have an Idea? Let's Talk</span>
        <span className="sm:hidden font-semibold">Talk</span>
      </button>
    </aside>
  );
};
