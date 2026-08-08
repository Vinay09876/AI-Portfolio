'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Github, Sparkles, Code } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
    const { portfolio } = useApp();
    const { projects } = portfolio;
    const [showAll, setShowAll] = useState(false);

    const visibleProjects = showAll ? projects : projects.slice(0, 4);

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-900/40 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-8 py-4">
                {/* Page Header */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Portfolio
                        </span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-zinc-100 md:text-4xl">
                        Featured Projects
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        A curated selection of applications and systems I have designed and engineered, showcasing modern full-stack methodologies, AI integrations, and real-time collaborative state.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visibleProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group flex flex-col bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            {/* Project Image Panel */}
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-900">
                                {project.image_url ? (
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-800">
                                        <Code className="w-8 h-8 text-slate-300 dark:text-zinc-700" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <div className="flex gap-2">
                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                Live Demo
                                            </a>
                                        )}
                                        {!project.live_url && project.repo_url && (
                                            <a
                                                href={project.repo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-950 transition-colors border border-white/10"
                                            >
                                                <Github className="w-3.5 h-3.5" />
                                                View on GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed text-justify">
                                        {project.description}
                                    </p>

                                    {project.highlights && project.highlights.length > 0 && (
                                        <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-zinc-900/60">
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Key Highlights</span>
                                            <ul className="space-y-1">
                                                {project.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="text-xs text-slate-600 dark:text-zinc-400 flex items-start gap-1.5">
                                                        <span className="text-teal-500 font-semibold shrink-0 mt-0.5">•</span>
                                                        <span className="leading-relaxed">{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Tech Stack Tags & Footer Actions */}
                                <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-zinc-900/60 shrink-0">
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tech_stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-55 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800/60"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 pt-1 text-xs">
                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                Live Demo
                                            </a>
                                        )}
                                        {project.repo_url && (
                                            <a
                                                href={project.repo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-600 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300 font-semibold flex items-center gap-1 transition-colors"
                                            >
                                                <Github className="w-3.5 h-3.5" />
                                                View Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More / Show Less Toggle */}
                {projects.length > 4 && (
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                        >
                            {showAll ? 'Show Less' : `Show ${projects.length - 4} More Projects`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
