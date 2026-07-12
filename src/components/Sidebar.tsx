'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Chat } from '../data/portfolio';
import {
  MessageSquare,
  Plus,
  Mail,
  MessageCircle,
  Settings,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  HeartHandshake,
  FolderCode,
  Briefcase,
  User
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    portfolio,
    sidebarExpanded,
    setSidebarExpanded,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    setSettingsOpen,
    chats,
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    renameChat
  } = useApp();

  // Local state for inline renaming
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    router.push('/');
    setMobileSidebarOpen(false); // Close drawer on mobile click
  };

  // Group chats by date helper
  const groupChats = () => {
    const groups: { [key: string]: Chat[] } = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: []
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOfSevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;

    // Sort chats by date descending
    const sortedChats = [...chats].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    sortedChats.forEach((chat) => {
      const chatTime = new Date(chat.created_at).getTime();
      if (chatTime >= startOfToday) {
        groups['Today'].push(chat);
      } else if (chatTime >= startOfYesterday) {
        groups['Yesterday'].push(chat);
      } else if (chatTime >= startOfSevenDaysAgo) {
        groups['Previous 7 Days'].push(chat);
      } else {
        groups['Older'].push(chat);
      }
    });

    return groups;
  };

  const groupedChats = groupChats();

  const sidebarWidthClass = sidebarExpanded ? 'w-[260px]' : 'w-[72px]';

  // Common navigation styles
  const getNavClass = (href: string) => {
    const isActive = pathname === href;
    return `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
      ${isActive
        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-100/30 dark:border-teal-900/30 shadow-sm'
        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
      }`;
  };

  return (
    <>
      {/* Sidebar overlay for Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
          id="mobile-sidebar-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-900 z-50 flex flex-col transition-all duration-300 ease-in-out
          lg:static ${sidebarWidthClass}
          ${mobileSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Header Section */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-zinc-900 min-h-[64px]">
          {sidebarExpanded || mobileSidebarOpen ? (
            <div className="flex items-center gap-2.5 pl-1.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-md shadow-teal-500/10 text-white font-bold text-sm shrink-0">
                VI
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate">
                  {portfolio.profile?.name ?? 'Loading...'}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 truncate">
                  AI Portfolio
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-md shadow-teal-500/10 text-white font-bold text-sm shrink-0">
                VI
              </div>
            </div>
          )}

          {/* Toggle Button for Desktop */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            id="sidebar-toggle-btn"
            className="hidden lg:flex items-center justify-center p-1.5 rounded-md text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Close Button for Mobile Drawer */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            id="sidebar-close-mobile-btn"
            className="lg:hidden flex items-center justify-center p-1.5 rounded-md text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button Section */}
        <div className="p-3.5 space-y-2 shrink-0">
          <button
            onClick={() => {
              createNewChat();
              setMobileSidebarOpen(false);
            }}
            id="new-chat-btn"
            className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm
              ${sidebarExpanded || mobileSidebarOpen
                ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-teal-500/10'
                : 'bg-teal-600 hover:bg-teal-700 text-white w-10 h-10 mx-auto p-0 rounded-lg'
              }`}
            title="Start New Chat"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {(sidebarExpanded || mobileSidebarOpen) && <span>New Chat</span>}
          </button>

          {/* Core Tabs Menu */}
          <div className="pt-2 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileSidebarOpen(false)}
              id="sidebar-tab-chat"
              className={getNavClass('/')}
              title="Assistant Chat"
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-teal-500 dark:text-teal-400" />
              {(sidebarExpanded || mobileSidebarOpen) ? (
                <span>AI Assistant</span>
              ) : (
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  AI Assistant
                </span>
              )}
            </Link>

            <Link
              href="/projects"
              onClick={() => setMobileSidebarOpen(false)}
              id="sidebar-tab-projects"
              className={getNavClass('/projects')}
              title="My Projects"
            >
              <FolderCode className="w-4 h-4 shrink-0 text-violet-500 dark:text-violet-400" />
              {(sidebarExpanded || mobileSidebarOpen) ? (
                <span>Projects</span>
              ) : (
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Projects
                </span>
              )}
            </Link>

            <Link
              href="/experience"
              onClick={() => setMobileSidebarOpen(false)}
              id="sidebar-tab-experience"
              className={getNavClass('/experience')}
              title="Work Experience"
            >
              <Briefcase className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
              {(sidebarExpanded || mobileSidebarOpen) ? (
                <span>Experience</span>
              ) : (
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Experience
                </span>
              )}
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileSidebarOpen(false)}
              id="sidebar-tab-about"
              className={getNavClass('/about')}
              title="About Me"
            >
              <User className="w-4 h-4 shrink-0 text-blue-500 dark:text-blue-400" />
              {(sidebarExpanded || mobileSidebarOpen) ? (
                <span>About</span>
              ) : (
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  About
                </span>
              )}
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileSidebarOpen(false)}
              id="sidebar-tab-contact"
              className={getNavClass('/contact')}
              title="Contact Me"
            >
              <Mail className="w-4 h-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
              {(sidebarExpanded || mobileSidebarOpen) ? (
                <span>Contact Vinay</span>
              ) : (
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Contact Vinay
                </span>
              )}
            </Link>

            <Link
              href="/feedback"
              onClick={() => setMobileSidebarOpen(false)}
              id="sidebar-tab-feedback"
              className={getNavClass('/feedback')}
              title="Send Feedback"
            >
              <HeartHandshake className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
              {(sidebarExpanded || mobileSidebarOpen) ? (
                <span>Feedback</span>
              ) : (
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Feedback
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Middle Section: Scrollable Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
          {(sidebarExpanded || mobileSidebarOpen) ? (
            <div className="space-y-4">
              {Object.entries(groupedChats).map(([groupName, groupChatsList]) => {
                if (groupChatsList.length === 0) return null;

                return (
                  <div key={groupName} className="space-y-1.5">
                    <h5 className="px-2.5 text-[11px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                      {groupName}
                    </h5>
                    <div className="space-y-0.5">
                      {groupChatsList.map((chat) => {
                        const isSelected = activeChatId === chat.id && pathname === '/';
                        const isEditing = editingChatId === chat.id;

                        return (
                          <div
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`group/item flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 relative
                              ${isSelected
                                ? 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-semibold'
                                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-slate-900 dark:hover:text-zinc-200'
                              }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <MessageCircle className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-teal-500' : 'text-slate-400'}`} />
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(e as any, chat.id);
                                    if (e.key === 'Escape') handleCancelRename(e as any);
                                  }}
                                  className="bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-teal-500 rounded px-1.5 py-0.5 w-full focus:outline-none text-[11px]"
                                  autoFocus
                                />
                              ) : (
                                <span className="truncate pr-4">{chat.title}</span>
                              )}
                            </div>

                            {/* Hover Actions */}
                            {!isEditing && (
                              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden group-hover/item:flex items-center gap-1 bg-gradient-to-l from-slate-50 via-slate-50 to-transparent pl-4 dark:from-zinc-950 dark:via-zinc-950 h-full">
                                <button
                                  onClick={(e) => handleStartRename(e, chat)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
                                  title="Rename chat"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
                                  title="Delete chat"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {isEditing && (
                              <div className="flex items-center gap-0.5 shrink-0 ml-1">
                                <button
                                  onClick={(e) => handleSaveRename(e, chat.id)}
                                  className="p-1 rounded bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400 hover:bg-teal-200 transition-colors"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={handleCancelRename}
                                  className="p-1 rounded bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-slate-200 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {chats.length === 0 && (
                <div className="text-center py-6 px-4">
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">No chat history. Start a new conversation!</p>
                </div>
              )}
            </div>
          ) : (
            // Collapsed view icons representation
            <div className="flex flex-col items-center gap-3.5 py-4">
              <span className="w-6 h-px bg-slate-200 dark:bg-zinc-800 block" />
              {chats.length > 0 && (
                <div className="space-y-2">
                  {chats.slice(0, 5).map((chat) => {
                    const isSelected = activeChatId === chat.id && pathname === '/';
                    return (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative
                          ${isSelected
                            ? 'bg-slate-100 dark:bg-zinc-900 text-teal-500'
                            : 'text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-800 dark:hover:text-zinc-200'}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                          {chat.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Bottom Section */}
        <div className="p-3.5 border-t border-slate-100 dark:border-zinc-900 shrink-0 bg-white dark:bg-zinc-950">
          {(sidebarExpanded || mobileSidebarOpen) ? (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {portfolio.profile?.avatar_url ? (
                  <img
                    src={portfolio.profile.avatar_url}
                    alt={portfolio.profile.name}
                    className="w-8.5 h-8.5 rounded-full object-cover border border-slate-100 dark:border-zinc-800 shadow-sm"
                  />
                ) : (
                  <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                    Visitor Account
                  </span>
                  <div className="flex items-center gap-1">
                    <CircleDot className="w-2.5 h-2.5 text-teal-500 fill-teal-500 shrink-0 animate-pulse" />
                    <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Connected
                    </span>
                  </div>
                </div>
              </div>

              {/* Settings Action */}
              <button
                onClick={() => setSettingsOpen(true)}
                id="sidebar-settings-btn"
                className="p-2 rounded-lg text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-800 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {portfolio.profile?.avatar_url ? (
                <img
                  src={portfolio.profile.avatar_url}
                  alt={portfolio.profile.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-zinc-800 shadow-sm"
                  title="Visitor Account"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm"
                  title="Visitor Account"
                />
              )}
              <button
                onClick={() => setSettingsOpen(true)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-800 dark:hover:text-zinc-200 transition-all cursor-pointer relative group"
                title="Settings"
              >
                <Settings className="w-4.5 h-4.5" />
                <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Settings
                </span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
