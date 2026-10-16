import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Copy, Check, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { api } from '../services/api';
import { CreateInquiryInput } from '../types';

interface IdeaSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const IdeaSubmissionModal: React.FC<IdeaSubmissionModalProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  // Form State
  const [formData, setFormData] = useState<CreateInquiryInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    service_category: siteConfig.serviceCategories[0],
    problem_description: '',
    target_users: '',
    desired_solution: '',
    requested_features: '',
    existing_url: '',
    budget_range: siteConfig.budgetOptions[0],
    timeline: siteConfig.timelineOptions[0],
    preferred_contact: 'email',
    additional_details: '',
    consent: false,
    honeypot: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    ref_id: string;
    message: string;
    title: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Prepopulate service category if requested
  useEffect(() => {
    if (preselectedService) {
      // Find matching category or set custom
      const matched = siteConfig.serviceCategories.find(c =>
        c.toLowerCase().includes(preselectedService.toLowerCase()) ||
        preselectedService.toLowerCase().includes(c.toLowerCase())
      );
      if (matched) {
        setFormData(prev => ({ ...prev, service_category: matched }));
      }
    }
  }, [preselectedService, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    if (!formData.title.trim()) {
      errors.title = 'Please provide a project or idea title.';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }

    if (!formData.problem_description.trim()) {
      errors.problem_description = 'Please describe the problem you are solving.';
    } else if (formData.problem_description.trim().length < 10) {
      errors.problem_description = 'Please provide at least 10 characters describing the problem.';
    }

    if (!formData.consent) {
      errors.consent = 'You must confirm that your details can be used to contact you.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await api.submitIdea(formData);
      setSubmissionSuccess({
        ref_id: response.ref_id,
        message: response.message,
        title: formData.title
      });
    } catch (err: any) {
      // Preserve form values; only set error banner
      setServerError(err?.message || 'Failed to submit idea. Please check your connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (!submissionSuccess) return;
    navigator.clipboard.writeText(submissionSuccess.ref_id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleResetForm = () => {
    setSubmissionSuccess(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      service_category: siteConfig.serviceCategories[0],
      problem_description: '',
      target_users: '',
      desired_solution: '',
      requested_features: '',
      existing_url: '',
      budget_range: siteConfig.budgetOptions[0],
      timeline: siteConfig.timelineOptions[0],
      preferred_contact: 'email',
      additional_details: '',
      consent: false,
      honeypot: ''
    });
    setFieldErrors({});
    setServerError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="idea-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#0B0F17] flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Inquiry</span>
            </div>
            <h2 id="idea-modal-title" className="text-xl sm:text-2xl font-bold text-white">
              Tell Me About Your Idea
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Share details about your business problem or software concept. I'll review and reply via your preferred contact channel.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {/* SUCCESS VIEW */}
          {submissionSuccess ? (
            <div className="py-4 sm:py-6 space-y-5 sm:space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Idea Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {submissionSuccess.message}
                </p>
              </div>

              {/* Reference ID card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                    Your Reference ID
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-blue-400 select-all">
                    {submissionSuccess.ref_id}
                  </span>
                </div>

                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Fast WhatsApp Followup CTA */}
              <div className="pt-2 max-w-md mx-auto space-y-3">
                <a
                  href={siteConfig.getInquiryWhatsAppUrl(submissionSuccess.ref_id, submissionSuccess.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl shadow-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Follow Up on WhatsApp with Ref ID</span>
                </a>

                <div className="flex items-center justify-center gap-4 pt-2 text-xs">
                  <button
                    onClick={handleResetForm}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Submit another idea
                  </button>
                  <span className="text-slate-600">·</span>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Close window
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Server error banner */}
              {serverError && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 flex items-start gap-3 text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <span className="font-semibold block">Submission Error</span>
                    <p className="text-xs text-rose-300/90">{serverError}</p>
                  </div>
                </div>
              )}

              {/* Anti-spam honeypot (hidden from human visitors) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_fax_code">Leave this blank</label>
                <input
                  type="text"
                  id="website_fax_code"
                  name="website_fax_code"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={e => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              {/* Step 1: Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  1. Your Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        fieldErrors.name ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        fieldErrors.email ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Phone / WhatsApp Number <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Company / Startup Name <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. NextGen Robotics"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Project Specifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  2. Project Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Project or Idea Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Online Customer Booking App, Business Website, or Smart Document Search"
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        fieldErrors.title ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {fieldErrors.title && (
                      <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.title}</p>
                    )}
                  </div>

                  {/* Service Category */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Service Category <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.service_category}
                      onChange={e => setFormData({ ...formData, service_category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {siteConfig.serviceCategories.map((cat, idx) => (
                        <option key={idx} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Preferred Contact Channel <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['email', 'whatsapp', 'phone'] as const).map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferred_contact: method })}
                          className={`py-2 px-2 text-xs font-medium rounded-lg capitalize border text-center transition-colors cursor-pointer ${
                            formData.preferred_contact === method
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      What problem does this solve? <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.problem_description}
                      onChange={e => setFormData({ ...formData, problem_description: e.target.value })}
                      placeholder="Explain what challenges you face, who the users are, or what product functionality you need..."
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        fieldErrors.problem_description ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {fieldErrors.problem_description && (
                      <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.problem_description}</p>
                    )}
                  </div>

                  {/* Target Users */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Target Audience / Users <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.target_users}
                      onChange={e => setFormData({ ...formData, target_users: e.target.value })}
                      placeholder="e.g. Clinic receptionists, lawyers, retail shoppers"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border border-slate-800 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>

                  {/* Existing URL */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Existing Website / App URL <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.existing_url}
                      onChange={e => setFormData({ ...formData, existing_url: e.target.value })}
                      placeholder="e.g. https://mycurrentsite.com"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900/90 border border-slate-800 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>

                  {/* Budget Estimate */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Estimated Budget Range <span className="text-slate-500 font-normal">(Planning guide)</span>
                    </label>
                    <select
                      value={formData.budget_range}
                      onChange={e => setFormData({ ...formData, budget_range: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900 border border-slate-800 rounded-lg text-white"
                    >
                      {siteConfig.budgetOptions.map((b, idx) => (
                        <option key={idx} value={b} className="bg-slate-900 text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline Preference */}
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Expected Timeline <span className="text-slate-500 font-normal">(Preference)</span>
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-900 border border-slate-800 rounded-lg text-white"
                    >
                      {siteConfig.timelineOptions.map((t, idx) => (
                        <option key={idx} value={t} className="bg-slate-900 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I agree to share these details with Sajid Inamdar for discussing potential software solutions. I understand my contact info will be kept private and never sold or shared.
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.consent}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2.5 text-xs font-medium text-slate-400 hover:text-white rounded-xl sm:rounded-lg transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-2.5 text-sm sm:text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl sm:rounded-lg shadow-md transition-all cursor-pointer min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit My Idea</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
