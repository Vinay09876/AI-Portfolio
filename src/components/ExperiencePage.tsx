'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
    const { portfolio } = useApp();
    const { experience } = portfolio;

    // Format date string from YYYY-MM to elegant string
    const formatDate = (dateStr: string) => {
        if (dateStr.toLowerCase() === 'present') return 'Present';
        const [year, month] = dateStr.split('-');
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const monthIndex = parseInt(month, 10) - 1;
        return `${months[monthIndex]} ${year}`;
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-900/40 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8 py-4">
                {/* Page Header */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Career Path
                        </span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-zinc-100 md:text-4xl">
                        Professional Experience
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        A comprehensive look at my professional engineering roles, leadership responsibilities, and architectural milestones in full-stack engineering and product intelligence.
                    </p>
                </div>

                {/* Timeline Layout */}
                <div className="relative border-l-2 border-slate-200 dark:border-zinc-800 ml-4 md:ml-6 pl-6 md:pl-10 py-2 space-y-10">
                    {experience.map((exp, index) => {
                        const isLatest = index === 0;
                        return (
                            <div key={exp.id} className="relative group">
                                {/* Timeline Dot Anchor */}
                                <div className={`absolute -left-[31px] md:-left-[47px] top-1.5 w-5 h-5 rounded-full border-2 bg-white dark:bg-zinc-950 transition-colors duration-300 flex items-center justify-center
                  ${isLatest
                                        ? 'border-teal-500 ring-4 ring-teal-500/10 dark:ring-teal-500/5'
                                        : 'border-slate-300 dark:border-zinc-700 group-hover:border-teal-400'
                                    }`}
                                >
                                    <Briefcase className={`w-2.5 h-2.5 ${isLatest ? 'text-teal-500' : 'text-slate-400'}`} />
                                </div>

                                {/* Experience Card */}
                                <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">

                                    {/* Card Title & Dates Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {exp.role}
                                            </h3>
                                            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                                                {exp.company}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-900/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-zinc-800/40 w-fit shrink-0">
                                            <Calendar className="w-3.5 h-3.5 text-teal-500" />
                                            <span>{formatDate(exp.start_date)}</span>
                                            <span>—</span>
                                            <span className={exp.end_date.toLowerCase() === 'present' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}>
                                                {formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Impact Description */}
                                    <div className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify space-y-2">
                                        <p>{exp.description}</p>
                                    </div>

                                    {/* Core Technologies Tagging */}
                                    <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-zinc-900/40">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Technologies Employed</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {exp.tech_stack.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-55 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800/60 hover:text-teal-500 dark:hover:text-teal-400 hover:border-teal-100 transition-colors"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
