import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Server, 
  Bot, 
  Cpu, 
  ArrowUpRight, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ServiceItem } from '../types';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'Server': return <Server className="w-5 h-5 text-blue-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      default: return <Server className="w-5 h-5 text-cyan-400" />;
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

  return (
    <section id="services" className="py-16 sm:py-20 md:py-28 bg-[#0B0F17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Exact copy from Master Prompt */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Direction A · Client Services</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
              Technology Solutions Built Around Your Needs
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              From a strong online presence to custom software and AI-powered workflows, we help turn business requirements into practical digital solutions.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 group self-start md:self-auto"
          >
            <span>View All Service Capabilities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {siteConfig.services.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="flex flex-col justify-between bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:shadow-xl hover:shadow-black/50 group"
            >
              <div>
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:scale-105 transition-all">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                    Service
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Capabilities list */}
                <div className="mb-6 space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Key Capabilities
                  </div>
                  <ul className="space-y-2">
                    {service.capabilities.slice(0, 4).map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  to={getEnquiryUrl(service.id)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-colors min-h-[44px]"
                >
                  <span>Discuss Your Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors min-h-[44px]"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
