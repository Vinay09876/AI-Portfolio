'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
    X,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Mail,
    Github,
    Linkedin,
    Twitter,
    Instagram,
    ExternalLink,
    Sparkles,
    Award
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
    const {
        rightSidebarExpanded,
        setRightSidebarExpanded,
        mobileRightSidebarOpen,
        setMobileRightSidebarOpen,
        portfolio
    } = useApp();

    const { profile, skills } = portfolio;

    // Render social icon based on platform
    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'github':
                return <Github className="w-4 h-4" />;
            case 'linkedin':
                return <Linkedin className="w-4 h-4" />;
            case 'twitter':
                return <Twitter className="w-4 h-4" />;
            case 'instagram':
                return <Instagram className="w-4 h-4" />;
            default:
                return <ExternalLink className="w-4 h-4" />;
        }
    };

    const rightSidebarWidthClass = rightSidebarExpanded ? 'w-[280px]' : 'w-[72px]';

    // Highlight key skills for the compact/expanded views
    const topSkills = skills.flatMap(cat => cat.items).slice(0, 6);

    return (
        <>
            {/* Right Sidebar Backdrop for Mobile */}
            {mobileRightSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setMobileRightSidebarOpen(false)}
                    id="mobile-right-sidebar-backdrop"
                />
            )}

            {/* Right Sidebar Aside */}
            <aside
                id="app-right-sidebar"
                className={`fixed inset-y-0 right-0 bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 z-50 flex flex-col transition-all duration-300 ease-in-out
          lg:static ${rightSidebarWidthClass}
          ${mobileRightSidebarOpen ? 'translate-x-0 w-[280px]' : 'translate-x-full lg:translate-x-0'}
          ${!mobileRightSidebarOpen && !rightSidebarExpanded ? 'md:w-[72px]' : 'md:w-[280px] lg:static'}
        `}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-900 min-h-[64px] shrink-0">
                    {/* Collapse Button for Desktop / Tablet */}
                    <button
                        onClick={() => setRightSidebarExpanded(!rightSidebarExpanded)}
                        id="right-sidebar-toggle-btn"
                        className="hidden md:flex items-center justify-center p-1.5 rounded-md text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                        title={rightSidebarExpanded ? "Collapse Profile" : "Expand Profile"}
                    >
                        {rightSidebarExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    {(rightSidebarExpanded || mobileRightSidebarOpen) && (
                        <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-teal-500" />
                            Profile Summary
                        </span>
                    )}

                    {/* Close Button for Mobile Drawer */}
                    <button
                        onClick={() => setMobileRightSidebarOpen(false)}
                        id="right-sidebar-close-mobile-btn"
                        className="lg:hidden flex md:hidden items-center justify-center p-1.5 rounded-md text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
                    {rightSidebarExpanded || mobileRightSidebarOpen ? (
                        /* EXPANDED PROFILE VIEW */
                        <div className="p-5 space-y-6">
                            {/* Profile Avatar & Intro */}
                            <div className="text-center space-y-3.5">
                                <div className="relative inline-block">
                                    {profile?.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.name}
                                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-slate-100 dark:border-zinc-800 shadow-sm"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full mx-auto bg-slate-100 dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 shadow-sm" />
                                    )}
                                    <div className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-teal-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-sm" title="Available for projects" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-100">
                                        {profile?.name}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                                        {profile?.title}
                                    </p>
                                </div>
                            </div>

                            {/* Bio Statement */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">About Me</span>
                                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify">
                                    {profile?.bio}
                                </p>
                            </div>

                            {/* Quick Contacts */}
                            <div className="space-y-3 border-t border-b border-slate-100 dark:border-zinc-900 py-4">
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-zinc-400">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>{profile?.location}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-zinc-400">
                                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                    <a href={`mailto:${profile?.email ?? ''}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate">
                                        {profile?.email}
                                    </a>
                                </div>
                            </div>

                            {/* Highlight Core Skills */}
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Featured Skills</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {topSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800/80 hover:border-teal-100 hover:text-teal-600 dark:hover:border-teal-900/30 dark:hover:text-teal-400 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Social Networking Links */}
                            <div className="space-y-3 pt-2">
                                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Social Presence</span>
                                <div className="flex items-center gap-2">
                                    {(profile?.social_links ?? []).map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/30 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-100 dark:hover:border-teal-900/30 transition-all duration-200"
                                            title={link.platform}
                                        >
                                            {getSocialIcon(link.platform)}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Indicator */}
                            <div className="rounded-lg bg-teal-50/50 dark:bg-teal-950/10 border border-teal-100/20 dark:border-teal-900/20 p-3 text-center">
                                <p className="text-[11px] font-medium text-teal-800 dark:text-teal-400 flex items-center justify-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0" />
                                    Available for new contracts
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* COLLAPSED/ICON RAIL VIEW */
                        <div className="py-6 flex flex-col items-center gap-6">
                            {/* Mini Avatar */}
                            <div className="relative inline-block">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.name}
                                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-800 shadow-sm"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm" />
                                )}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-500 border border-white dark:border-zinc-950 rounded-full shadow-sm" />
                            </div>

                            {/* Vertical Divider */}
                            <div className="w-8 border-b border-slate-100 dark:border-zinc-900" />

                            {/* Location Mini */}
                            <div className="group relative flex justify-center">
                                <MapPin className="w-4 h-4 text-slate-400 cursor-pointer hover:text-teal-500 transition-colors" />
                                <span className="absolute left-12 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                    {profile?.location}
                                </span>
                            </div>

                            {/* Mail Mini */}
                            <div className="group relative flex justify-center">
                                <Mail className="w-4 h-4 text-slate-400 cursor-pointer hover:text-teal-500 transition-colors" />
                                <span className="absolute left-12 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                    {profile?.email}
                                </span>
                            </div>

                            {/* Top Skill Indicator */}
                            <div className="group relative flex justify-center">
                                <Award className="w-4 h-4 text-slate-400 cursor-pointer hover:text-teal-500 transition-colors" />
                                <div className="absolute left-12 bg-slate-800 text-white text-[10px] py-2 px-3 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 w-44 space-y-1 shadow-md">
                                    <span className="font-bold border-b border-slate-700 pb-1 block mb-1 uppercase tracking-wider">Top Skills</span>
                                    {topSkills.map((s, idx) => (
                                        <div key={idx} className="truncate">• {s}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Vertical Divider */}
                            <div className="w-8 border-b border-slate-100 dark:border-zinc-900" />

                            {/* Social Stack */}
                            <div className="flex flex-col gap-3">
                                {(profile?.social_links ?? []).map((link, index) => (
                                    <div key={index} className="group relative flex justify-center">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-teal-500 transition-colors"
                                        >
                                            {getSocialIcon(link.platform)}
                                        </a>
                                        <span className="absolute left-12 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                            {link.platform}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};
