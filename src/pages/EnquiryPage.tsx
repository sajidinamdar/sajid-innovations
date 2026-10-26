import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Mail,
  Phone,
  MessageSquare,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ENQUIRY_CATEGORIES, getEnquiryConfigBySlug } from '../config/enquiryConfig';
import { api } from '../services/api';
import { CreateInquiryInput } from '../types';

export const EnquiryPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const config = getEnquiryConfigBySlug(categorySlug);

  const [formData, setFormData] = useState<CreateInquiryInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: config.defaultTitle,
    service_category: config.categoryName,
    problem_description: '',
    target_users: '',
    desired_solution: '',
    requested_features: '',
    existing_url: '',
    budget_range: siteConfig.budgetOptions[0],
    timeline: siteConfig.timelineOptions[0],
    preferred_contact: 'email',
    additional_details: '',
    consent: true,
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

  // Sync form state when categorySlug changes (e.g. user toggles category tabs or back/forward)
  useEffect(() => {
    const nextConfig = getEnquiryConfigBySlug(categorySlug);
    setFormData(prev => ({
      ...prev,
      service_category: nextConfig.categoryName,
      title: prev.title === config.defaultTitle || !prev.title.trim() ? nextConfig.defaultTitle : prev.title
    }));
    setFieldErrors({});
    setServerError(null);
  }, [categorySlug]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.email.trim() && !formData.phone?.trim()) {
      errors.email = 'Please provide either an email or phone number.';
    } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.problem_description.trim() && !formData.desired_solution?.trim()) {
      errors.problem_description = 'Please describe your requirements, challenge, or questions.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setServerError(null);

    try {
      const inquiryTitle = formData.title.trim() || config.defaultTitle;
      const response = await api.submitIdea({
        ...formData,
        title: inquiryTitle
      });

      if (response && response.success) {
        setSubmissionSuccess({
          ref_id: response.ref_id,
          message: response.message || 'Thank you for reaching out! Your inquiry has been submitted.',
          title: inquiryTitle
        });
      } else {
        setServerError('Failed to submit inquiry. Please try again or message via WhatsApp.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Network error occurred. Please try WhatsApp or email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submissionSuccess?.ref_id) {
      navigator.clipboard.writeText(submissionSuccess.ref_id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': config.pageTitle,
    'url': config.canonicalUrl,
    'description': config.metaDescription,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Sajid Innovations',
      'telephone': siteConfig.primaryPhone,
      'email': siteConfig.email,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Kharshindhe',
        'addressLocality': 'Sangamner',
        'addressRegion': 'Ahilyanagar, Maharashtra',
        'postalCode': '413738',
        'addressCountry': 'IN'
      }
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <SEO
        title={config.pageTitle}
        description={config.metaDescription}
        canonicalUrl={config.canonicalUrl}
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Category Navigation Pills */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Enquiry Area:
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {Object.values(ENQUIRY_CATEGORIES).map((cat) => {
              const isActive = (categorySlug || 'general') === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  to={`/enquire/${cat.slug}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat.badge}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Contextual details & direct contact */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 rounded-full">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{config.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
                {config.heading}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed">
                {config.subheading}
              </p>
            </div>

            {/* Key Focus Highlights */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                What to Expect
              </h3>
              <ul className="space-y-2.5">
                {config.focusHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Communication Channels */}
            <div className="space-y-3 pt-1">
              <a
                href={siteConfig.getWhatsAppUrl(`Hi Sajid! I would like to enquire about ${config.categoryName}.`)}
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
                      WhatsApp Instant Chat
                    </div>
                    <div className="text-xs text-emerald-400/90 font-mono">
                      {siteConfig.primaryPhone}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(config.defaultTitle)}`}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all group min-h-[48px]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Direct Email
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      {siteConfig.email}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            </div>

            {/* Reassurance */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No spam. We reply directly with practical guidance about your enquiry.</span>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7 bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-left">
            {submissionSuccess ? (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Enquiry Received Successfully</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {submissionSuccess.message}
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">Reference ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-cyan-400">{submissionSuccess.ref_id}</span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="text-xs text-slate-400 hover:text-white p-1"
                      title="Copy Reference ID"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={siteConfig.getWhatsAppUrl(`Hi Sajid! I submitted an enquiry for "${submissionSuccess.title}" with Reference ID: ${submissionSuccess.ref_id}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData(prev => ({
                        ...prev,
                        problem_description: '',
                        desired_solution: '',
                        requested_features: ''
                      }));
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-medium"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="pb-2 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">{config.badge} Form</h2>
                  <p className="text-xs text-slate-400">Please provide your details below. You'll receive a Reference ID for tracking.</p>
                </div>

                {serverError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="enquiry-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="enquiry-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none"
                  />
                  {fieldErrors.name && <p className="text-xs text-rose-400 mt-1">{fieldErrors.name}</p>}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enquiry-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none"
                    />
                    {fieldErrors.email && <p className="text-xs text-rose-400 mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="enquiry-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Service Category */}
                <div>
                  <label htmlFor="enquiry-category" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Enquiry Category
                  </label>
                  <select
                    id="enquiry-category"
                    value={formData.service_category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setFormData({ ...formData, service_category: newCategory });
                      // Find matching slug and navigate to it smoothly
                      const matchedEntry = Object.values(ENQUIRY_CATEGORIES).find(c => c.categoryName === newCategory);
                      if (matchedEntry) {
                        navigate(`/enquire/${matchedEntry.slug}`, { replace: true });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    {siteConfig.serviceCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="enquiry-title" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject / Project Title
                  </label>
                  <input
                    id="enquiry-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={config.defaultTitle}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none"
                  />
                </div>

                {/* Message / Description */}
                <div>
                  <label htmlFor="enquiry-desc" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Details or Requirements <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="enquiry-desc"
                    required
                    rows={4}
                    value={formData.problem_description}
                    onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                    placeholder="Describe your project requirements, problem to solve, or requested demo features..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none resize-y"
                  />
                  {fieldErrors.problem_description && (
                    <p className="text-xs text-rose-400 mt-1">{fieldErrors.problem_description}</p>
                  )}
                </div>

                {/* Honeypot field for bot protection */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
