'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Briefcase, Heart, Code2, Milestone } from 'lucide-react';

interface JourneyMilestone {
    sortKey: string;
    year: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    tags: string[];
}

export const AboutPage: React.FC = () => {
    const { portfolio } = useApp();
    const { profile, skills, experience, education } = portfolio;
    const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(Number.MAX_SAFE_INTEGER);

    // Build the timeline from real education + experience rows, sorted chronologically (oldest first)
    const educationMilestones: JourneyMilestone[] = education.map((ed) => ({
        sortKey: ed.end_date,
        year: ed.end_date,
        title: ed.degree,
        subtitle: ed.institution,
        description: `Completed with a result of ${ed.result}.`,
        icon: <GraduationCap className="w-4 h-4" />,
        tags: []
    }));

    const experienceMilestones: JourneyMilestone[] = experience.map((exp) => ({
        sortKey: exp.start_date,
        year: exp.end_date.toLowerCase() === 'present' ? `${exp.start_date} – Present` : `${exp.start_date} – ${exp.end_date}`,
        title: exp.role,
        subtitle: exp.company,
        description: exp.description,
        icon: <Briefcase className="w-4 h-4" />,
        tags: exp.tech_stack
    }));

    const journeyTimeline = [...educationMilestones, ...experienceMilestones].sort((a, b) =>
        a.sortKey.localeCompare(b.sortKey)
    );

    // Default to the most recent milestone once real data has loaded; clamp so an empty/loading array can't crash the page
    const effectiveIndex = journeyTimeline.length > 0
        ? Math.min(activeMilestoneIndex, journeyTimeline.length - 1)
        : 0;

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-900/40 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-10 py-4">

                {/* Intro Banner Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-teal-500 text-teal-500" />
                                The Person Behind The Code
                            </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-zinc-100 md:text-4xl">
                            Hello, I'm Vinay Ippakayala
                        </h1>
                        <div className="space-y-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed text-justify">
                            <p>{profile?.bio}</p>
                        </div>
                    </div>

                    {/* Profile Quick Stats Card */}
                    <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl p-5 shadow-sm space-y-5">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.name}
                                className="w-24 h-24 rounded-full object-cover mx-auto border border-slate-200 dark:border-zinc-800"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full mx-auto bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800" />
                        )}
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base">{profile?.name}</h3>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{profile?.title}</p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-900 text-xs text-slate-500 dark:text-zinc-400">
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-400 dark:text-zinc-500">Based in:</span>
                                <span className="text-slate-700 dark:text-zinc-300 font-semibold">{profile?.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-400 dark:text-zinc-500">Experience:</span>
                                <span className="text-slate-700 dark:text-zinc-300 font-semibold">4+ Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-400 dark:text-zinc-500">Specialty:</span>
                                <span className="text-teal-600 dark:text-teal-400 font-semibold">React.js + Next.js</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Bento Grid Category Lists */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-teal-500" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Technical Skill Matrix</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {skills.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                        {category.category}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {category.items.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 text-xs rounded-md bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800/80 hover:border-teal-100 hover:text-teal-600 dark:hover:border-teal-900/30 dark:hover:text-teal-400 transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interactive Timeline of My Journey */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-900/80">
                    <div className="flex items-center gap-2">
                        <Milestone className="w-5 h-5 text-teal-500" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Timeline of My Journey</h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Click on any milestone below to travel through different eras of my engineering evolution and view specific highlights.
                    </p>

                    {journeyTimeline.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-zinc-500 py-6">Loading timeline...</p>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
                        {/* Left Column: Interactive Milestone Selectors */}
                        <div className="md:col-span-5 flex flex-col gap-2.5">
                            {journeyTimeline.map((item, index) => {
                                const isActive = effectiveIndex === index;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setActiveMilestoneIndex(index)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group
                      ${isActive
                                                ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-400 shadow-sm'
                                                : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                        ${isActive
                                                    ? 'bg-teal-500 text-white'
                                                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-500 group-hover:bg-teal-500 group-hover:text-white'
                                                }`}
                                            >
                                                {item.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`text-[10px] font-bold uppercase tracking-wider transition-colors
                          ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-zinc-500'}`}
                                                >
                                                    {item.year}
                                                </div>
                                                <div className="text-sm font-bold truncate">{item.title}</div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Column: Display Details of Active Milestone */}
                        <div className="md:col-span-7 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                                            {journeyTimeline[effectiveIndex].year}
                                        </span>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">
                                            {journeyTimeline[effectiveIndex].title}
                                        </h3>
                                        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
                                            {journeyTimeline[effectiveIndex].subtitle}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify italic">
                                    "{journeyTimeline[effectiveIndex].description}"
                                </p>

                                {journeyTimeline[effectiveIndex].tags.length > 0 && (
                                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-900">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Tech Stack</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {journeyTimeline[effectiveIndex].tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-50 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800/60"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
                </div>

            </div>
        </div>
    );
};
