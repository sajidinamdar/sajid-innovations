import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  User,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Code2,
  MessageSquare,
  ArrowRight,
  ArrowUpRight,
  Target,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface AboutPageProps {
  onOpenIdeaModal: (serviceTitle?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenIdeaModal }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Sajid Innovations',
    'url': 'https://www.sajidinnovations.in/about',
    'description':
      'Sajid Innovations is a technology brand founded by Sajid Inamdar, focused on building practical digital solutions for businesses and developing specialized software products like Sajinova Lab.',
    'mainEntity': {
      '@type': 'Person',
      'name': 'Sajid Inamdar',
      'jobTitle': 'Founder & Software Developer',
      'worksFor': {
        '@type': 'Organization',
        'name': 'Sajid Innovations'
      }
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <SEO
        title="About Us | Sajid Innovations - Technology & Practical Software"
        description="Learn about Sajid Innovations, our two core business directions (client digital solutions & in-house software products), and founder Sajid Inamdar."
        canonicalUrl="https://www.sajidinnovations.in/about"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Page Hero */}
        <div className="max-w-3xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Brand Story & Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Building Practical Technology With Purpose
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed">
            Sajid Innovations is a technology brand founded by Sajid Inamdar. We turn ideas into practical digital solutions that help businesses grow and solve real-world problems through technology and innovation.
          </p>
        </div>

        {/* 1. Who We Are */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Who We Are
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              <p>
                Based in Kharshindhe, Sangamner (Ahilyanagar, Maharashtra), Sajid Innovations was created with a clear belief: technology is most powerful when it is built around actual operational requirements, not unnecessary complexity.
              </p>
              <p>
                Rather than acting as a generic freelance portfolio or overpromising enterprise capabilities, we operate with transparent engineering principles. Every software system, website, or product we deliver is designed for dependable performance, clear usability, and direct support.
              </p>
              <p>
                We collaborate closely with small business owners, emerging startups, and healthcare providers to engineer software that works reliably day in and day out.
              </p>
            </div>
          </div>

          {/* Quick stats / facts card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Verified Brand Facts
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Brand Name</span>
                <span className="font-semibold text-white">Sajid Innovations</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Founder</span>
                <span className="font-semibold text-white">{siteConfig.founderName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 shrink-0">Headquarters</span>
                <span className="font-semibold text-white text-right max-w-[240px] leading-relaxed">{siteConfig.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Core Focus</span>
                <span className="font-semibold text-white">Client Solutions & Software Products</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Communication</span>
                <span className="font-semibold text-white">Direct Technical Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Two Business Directions */}
        <div className="space-y-8 text-left">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Our Two Business Directions
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              We operate two complementary focus areas under one technology brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Direction A · Client Services
              </span>
              <h3 className="text-xl font-bold text-white">
                Custom Web, Software & AI Solutions
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We partner with businesses to build responsive websites, custom operational software, AI chatbots, and workflow automations tailored to their exact processes.
              </p>
              <div className="pt-2">
                <Link
                  to="/services"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
                >
                  <span>Explore Client Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Direction B · In-House Software Products
              </span>
              <h3 className="text-xl font-bold text-white">
                Sajinova Lab & Industry Tools
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We develop and distribute our own proprietary software products. Our featured product, Sajinova Lab, provides offline-first laboratory management for diagnostic centers.
              </p>
              <div className="pt-2">
                <Link
                  to="/sajinova-lab"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5"
                >
                  <span>Explore Sajinova Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. How We Work */}
        <div className="space-y-8 text-left">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Our Working Principles
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              How we approach technology, architecture, and client partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Understand Before Coding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We clarify the business challenge, user priorities, and technical scope thoroughly before writing a single line of code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">Practical Tech Choices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We choose technologies for proven reliability, fast performance, and simple maintenance—not just fleeting industry hype.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Direct Communication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You communicate directly with the software developer who designs and builds your system. No account managers or delayed handoffs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-base font-bold text-white">Software Built to Last</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We deliver clean code, secure local database protections, automated backups, and thorough documentation for lasting value.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Founder Profile */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#111827] via-[#0E1523] to-[#111827] border border-slate-800 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Founder Profile</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {siteConfig.founderName}
              </h2>
              <p className="text-sm font-medium text-slate-300">
                {siteConfig.founderRole} · {siteConfig.professionalTitle}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sajid Inamdar leads architecture, design, and software development at Sajid Innovations. With a focus on full-stack web platforms, native desktop software engineering, and intelligent automation, he brings hands-on craftsmanship to every client deliverable and in-house product.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {siteConfig.location}
                </span>
                <span>·</span>
                <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                  GitHub Profile
                </a>
                <span>·</span>
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                  {siteConfig.instagramUsername}
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/enquire/general"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Let's Discuss Your Idea</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
