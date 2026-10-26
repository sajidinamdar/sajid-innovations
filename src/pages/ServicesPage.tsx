import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Globe,
  Server,
  Bot,
  Cpu,
  ArrowUpRight,
  Check,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface ServicesPageProps {
  onOpenIdeaModal: (serviceTitle?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenIdeaModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'Server': return <Server className="w-6 h-6 text-blue-400" />;
      case 'Bot': return <Bot className="w-6 h-6 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-emerald-400" />;
      default: return <Server className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getEnquiryUrl = (serviceId: string) => {
    switch (serviceId) {
      case 'website-development': return '/enquire/website-development';
      case 'custom-software-development': return '/enquire/custom-software';
      case 'ai-applications': return '/enquire/ai-solutions';
      case 'business-automation': return '/enquire/business-automation';
      default: return '/enquire/general';
    }
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Sajid Innovations Client Services',
    'url': 'https://www.sajidinnovations.in/services',
    'description':
      'Custom website design, software development, AI chatbots, and business automation solutions engineered for practical business operations.',
    'provider': {
      '@type': 'Organization',
      'name': 'Sajid Innovations',
      'url': 'https://www.sajidinnovations.in/'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Technology Services',
      'itemListElement': siteConfig.services.map((svc) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': svc.title,
          'description': svc.shortDescription
        }
      }))
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <SEO
        title="Services | Sajid Innovations - Website, Custom Software & AI Development"
        description="Practical technology solutions built around your business needs: Website Design & Development, Custom Software, AI Applications & Chatbots, and Business Automation."
        canonicalUrl="https://www.sajidinnovations.in/services"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero */}
        <div className="max-w-3xl mb-16 sm:mb-20 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Direction A · Client Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Practical Technology Solutions for Real Business Needs
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed">
            We help businesses establish a credible digital presence, engineer purpose-built custom software, implement useful AI workflows, and automate repetitive operational bottlenecks.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Direct Technical Communication
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Tailored Architecture
            </span>
            <span>·</span>
            <span className="text-slate-400">Fixed Milestone Scopes</span>
          </div>
        </div>

        {/* Detailed 4 Services List */}
        <div className="space-y-12 sm:space-y-16">
          {siteConfig.services.map((service, index) => (
            <div
              key={service.id}
              id={service.slug}
              className="rounded-3xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left details */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-cyan-400">Service 0{index + 1}</span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-base text-slate-300 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Typical Problems Solved */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      Problems This Service Solves
                    </h3>
                    <ul className="space-y-2">
                      {service.typicalProblems.map((prob, pIdx) => (
                        <li key={pIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <Link
                      to={getEnquiryUrl(service.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 min-h-[44px]"
                    >
                      <span>Discuss Your Project</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={siteConfig.getWhatsAppUrl(`Hi Sajid! I would like to inquire about ${service.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/40 rounded-xl transition-colors min-h-[44px]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Inquire via WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Right deliverables list */}
                <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-5">
                  <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Deliverables & Capabilities
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Verified</span>
                  </div>

                  <ul className="space-y-3">
                    {service.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                    Every project begins with a structured discussion to determine requirements, timeline, and exact deliverables.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 sm:mt-20 p-8 rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Looking for a custom software solution?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Tell us what challenges you're facing in your business. We will discuss realistic ways technology can solve them.
            </p>
          </div>

          <Link
            to="/enquire/general"
            className="w-full md:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all whitespace-nowrap text-center shrink-0 min-h-[44px] flex items-center justify-center gap-2"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
