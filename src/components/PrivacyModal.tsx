import React from 'react';
import { X, ShieldCheck, Mail, Lock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0B0F17] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 id="privacy-modal-title" className="text-xl font-bold text-white">
              Privacy Policy & Data Handling
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close privacy policy"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            This Privacy Policy explains how <strong>Sajid Inamdar</strong> ({siteConfig.brandName}) handles personal information submitted through this website.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-white text-sm">1. Information Collected</h3>
            <p className="text-slate-400">
              When you submit a project inquiry, we collect your name, email address, optional telephone number, company name, project title, and problem description. We do not collect payment card information, identity documents, or tracking cookies.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white text-sm">2. Purpose of Collection</h3>
            <p className="text-slate-400">
              Information is collected solely to evaluate your project feasibility, prepare proposals, and contact you via your selected channel (WhatsApp, email, or telephone). It is never sold, leased, or shared with third-party advertisers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white text-sm">3. Storage & Security</h3>
            <p className="text-slate-400">
              Inquiries are stored in a secure relational database with server-side validation and authentication protection. Private administrator notes are never accessible to the public.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white text-sm">4. Data Retention & Deletion</h3>
            <p className="text-slate-400">
              Inquiry records are retained only as long as needed to maintain project correspondence. You can request deletion of your submitted details at any time by sending an email with your Reference ID to{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-blue-400 hover:underline">
                {siteConfig.email}
              </a>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your submitted ideas are treated with professional respect and confidentiality.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
