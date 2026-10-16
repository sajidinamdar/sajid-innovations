import React from 'react';
import { 
  Globe, 
  Server, 
  Bot, 
  Cpu, 
  Rocket, 
  Wrench, 
  ArrowUpRight, 
  Check, 
  MessageSquare 
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ServiceItem } from '../types';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Server': return <Server className="w-5 h-5 text-indigo-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Rocket': return <Rocket className="w-5 h-5 text-amber-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-cyan-400" />;
      default: return <Server className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Custom Services</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
            What Can I Build for You?
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every business and idea has different requirements. I work on custom solutions based on the problem you want to solve.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {siteConfig.services.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="flex flex-col justify-between bg-[#111827] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 group"
            >
              <div>
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-xs font-mono text-slate-500">Service</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Capabilities list */}
                <div className="mb-6 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    What's Included
                  </div>
                  <ul className="space-y-1.5">
                    {service.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Discuss This Service</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={siteConfig.getServiceWhatsAppUrl(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Discuss ${service.title} on WhatsApp`}
                  className="p-2.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-900/50 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
