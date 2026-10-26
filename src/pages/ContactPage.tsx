import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Mail,
  Phone,
  MessageSquare,
  Instagram,
  Github,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { api } from '../services/api';
import { CreateInquiryInput } from '../types';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

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

  useEffect(() => {
    if (serviceParam) {
      const matched = siteConfig.serviceCategories.find(c =>
        c.toLowerCase().includes(serviceParam.toLowerCase()) ||
        serviceParam.toLowerCase().includes(c.toLowerCase())
      );
      if (matched) {
        setFormData(prev => ({ ...prev, service_category: matched, title: `${matched} Inquiry` }));
      } else {
        setFormData(prev => ({ ...prev, title: `${serviceParam} Inquiry` }));
      }
    }
  }, [serviceParam]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.email.trim() && !formData.phone?.trim()) {
      errors.email = 'Please provide either an email or phone number.';
    } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.problem_description.trim() && !formData.desired_solution?.trim()) {
      errors.problem_description = 'Please describe your project idea, problem, or inquiry.';
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
      const inquiryTitle = formData.title.trim() || `${formData.service_category} Inquiry`;
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
        setServerError('Failed to submit inquiry. Please try again.');
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
    'name': 'Contact Sajid Innovations',
    'url': 'https://www.sajidinnovations.in/contact',
    'description': 'Contact Sajid Innovations for custom website design, software development, AI applications, or Sajinova Lab demo inquiries.',
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
        title="Contact | Sajid Innovations - Let's Build Your Project"
        description="Let's talk about what you want to build. Reach Sajid Innovations for client solutions, custom software, AI applications, or Sajinova Lab demos."
        canonicalUrl="https://www.sajidinnovations.in/contact"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Direct Collaboration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Let's Talk About What You Want to Build
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed">
            Have a project idea, business workflow requirement, or interest in Sajinova Lab? Reach out directly or fill out the inquiry form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Channels & Verified Info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* WhatsApp */}
            <a
              href={siteConfig.getWhatsAppUrl("Hi Sajid! I would like to discuss a project with Sajid Innovations.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/40 hover:border-emerald-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-900/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    WhatsApp Chat
                  </div>
                  <div className="text-xs text-emerald-400/90 font-mono">
                    {siteConfig.primaryPhone} · Quick response
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.email}?subject=Project%20Inquiry%20via%20Sajid%20Innovations`}
              className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Direct Email
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    {siteConfig.email}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Phone */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">Telephone Numbers</div>
                  <div className="text-xs text-slate-300 font-mono flex flex-wrap items-center gap-2 mt-0.5">
                    <a href={`tel:${siteConfig.primaryPhone.replace(/\s+/g, '')}`} className="hover:text-cyan-300 underline">
                      {siteConfig.primaryPhone}
                    </a>
                    <span className="text-slate-500">·</span>
                    <a href={`tel:${siteConfig.alternativePhone.replace(/\s+/g, '')}`} className="hover:text-cyan-300 underline">
                      {siteConfig.alternativePhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Assurance */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{siteConfig.location} · {siteConfig.timezone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No spam. We reply directly with practical guidance about your project or product inquiry.</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="font-semibold text-slate-300">Profiles:</span>
              <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline flex items-center gap-1.5">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>{siteConfig.instagramUsername}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-left">
            {submissionSuccess ? (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received Successfully</h3>
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
                    href={siteConfig.getWhatsAppUrl(`Hi Sajid! I submitted an inquiry for "${submissionSuccess.title}" with Reference ID: ${submissionSuccess.ref_id}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2"
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
                        title: '',
                        problem_description: '',
                        desired_solution: '',
                        requested_features: ''
                      }));
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-medium"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="pb-2 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">Project & Product Inquiry Form</h2>
                  <p className="text-xs text-slate-400">Share your details for a practical discussion and quote.</p>
                </div>

                {serverError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-name"
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
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none"
                    />
                    {fieldErrors.email && <p className="text-xs text-rose-400 mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="contact-phone"
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
                  <label htmlFor="contact-category" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Service or Product of Interest
                  </label>
                  <select
                    id="contact-category"
                    value={formData.service_category}
                    onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    {siteConfig.serviceCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message / Description */}
                <div>
                  <label htmlFor="contact-desc" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    What would you like to build or discuss? <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-desc"
                    required
                    rows={4}
                    value={formData.problem_description}
                    onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                    placeholder="Tell us about your business idea, requirements, or request a demo..."
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
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
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
