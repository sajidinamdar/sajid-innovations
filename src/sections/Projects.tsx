import React, { useState } from 'react';
import { Github, ExternalLink, ArrowRight, Layers, X, Code, Check } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ProjectItem } from '../types';

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All Projects');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filterCategories = [
    { key: 'All Projects', label: 'All Solutions' },
    { key: 'Web Development', label: 'Websites & Apps' },
    { key: 'Backend', label: 'Core Engines' },
    { key: 'AI Applications', label: 'Smart AI Tools' },
    { key: 'Automation', label: 'Automated Workflows' }
  ];

  const filteredProjects = activeFilter === 'All Projects'
    ? siteConfig.projects
    : siteConfig.projects.filter(p => p.category === activeFilter);

  const getStatusColor = (status: ProjectItem['status']) => {
    switch (status) {
      case 'Working Demo': return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
      case 'In Development': return 'text-blue-400 border-blue-800/60 bg-blue-950/40';
      case 'Prototype': return 'text-amber-400 border-amber-800/60 bg-amber-950/40';
      case 'Personal Project': return 'text-purple-400 border-purple-800/60 bg-purple-950/40';
      default: return 'text-slate-400 border-slate-800 bg-slate-900';
    }
  };

  return (
    <section id="projects" className="py-20 md:py-28 bg-[#090D14] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Developer Portfolio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
            Personal Projects & Demonstrations
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Explore projects I've developed or am developing to demonstrate my technical skills, experiment with technologies, and explore solutions to practical problems. These projects represent my own development work and demonstrations.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl w-fit">
          {filterCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeFilter === cat.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="flex flex-col justify-between bg-[#0E1523] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-8 transition-all duration-200 group"
            >
              <div>
                {/* Status & Category */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-400">{project.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className={`px-2 py-0.5 text-[11px] font-mono rounded border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  {project.shortDescription}
                </p>

                {/* Problem Addressed & What It Does */}
                <div className="space-y-3 mb-5 text-xs text-slate-400">
                  <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
                    <span className="font-semibold text-slate-300 block mb-1">Problem Addressed:</span>
                    <p className="leading-relaxed">{project.problemStatement}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
                    <span className="font-semibold text-slate-300 block mb-1">What It Does & Approach:</span>
                    <p className="leading-relaxed">{project.solution}</p>
                  </div>
                </div>

                {/* Technologies used */}
                <div className="mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Technologies Used:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[11px] font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom buttons: View Project & View Source Code */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {(project.demoUrl || project.liveUrl) && (
                    <a
                      href={project.demoUrl || project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Project</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl bg-[#0E1523] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-blue-400">{selectedProject.category}</span>
                  <span>·</span>
                  <span className={`px-2 py-0.5 text-[11px] font-mono rounded border ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedProject.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Summary
                </h4>
                <p className="leading-relaxed">{selectedProject.shortDescription}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-200 block mb-1">Business Problem:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedProject.problemStatement}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-200 block mb-1">Delivered Solution:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedProject.solution}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Key Capabilities Built
                </h4>
                <ul className="space-y-2">
                  {selectedProject.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Components & Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Need something similar built for your business?</span>
              <a
                href={siteConfig.getWhatsAppUrl(`Hi Sajid! I saw your ${selectedProject.name} solution and would like to build something similar for my business.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Discuss Similar Project
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
