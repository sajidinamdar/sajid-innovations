import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-28 bg-[#090D14] border-t border-slate-900/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3.5 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Clear Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Straightforward answers about our services, software products like Sajinova Lab, project scoping, and getting started.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {siteConfig.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl min-h-[48px]"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-100">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-5 sm:px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions prompt */}
        <div className="mt-12 text-center text-xs sm:text-sm text-slate-400">
          <span>Have a question not listed here? </span>
          <a
            href={siteConfig.getWhatsAppUrl("Hi Sajid! I have a question about Sajid Innovations.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1.5 ml-1"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask directly on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
