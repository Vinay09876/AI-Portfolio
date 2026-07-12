'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Chat } from '../data/portfolio';
import { Markdown } from './Markdown';
import {
  Menu,
  Sun,
  Moon,
  Send,
  ArrowUp,
  Loader2,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Briefcase,
  Terminal,
  Mail,
  FileDown,
  User,
  Copy,
  Pencil,
  Check
} from 'lucide-react';

function isLongMessage(content: string): boolean {
  return content.length > 180 || content.split('\n').length > 3;
}


export const ChatArea: React.FC = () => {
  const {
    chats,
    activeChatId,
    sendMessage,
    editMessage,
    isGenerating,
    setMobileSidebarOpen,
    theme,
    setTheme,
    createNewChat,
    mobileRightSidebarOpen,
    setMobileRightSidebarOpen
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async (chatId: string) => {
    if (!editingContent.trim() || !editingMessageId) return;
    const messageId = editingMessageId;
    setEditingMessageId(null);
    await editMessage(chatId, messageId, editingContent);
  };

  const toggleMessageExpanded = (id: string) => {
    setExpandedMessages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  // Retrieve active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages?.length, isGenerating]);

  // Handle auto-resizing textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const text = input;
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (!activeChat) {
      // Create new chat and send message
      createNewChat(text);
    } else {
      sendMessage(activeChat.id, text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    if (isGenerating) return;

    if (!activeChat) {
      createNewChat(prompt);
    } else {
      sendMessage(activeChat.id, prompt);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Starter prompts with icons
  const starterPrompts = [
    {
      text: "What projects have you worked on?",
      label: "Show projects",
      icon: <Sparkles className="w-4 h-4 text-teal-500" />
    },
    {
      text: "Tell me about your professional experience.",
      label: "Work history",
      icon: <Briefcase className="w-4 h-4 text-indigo-500" />
    },
    {
      text: "What are your technical skills?",
      label: "Tech stack",
      icon: <Terminal className="w-4 h-4 text-rose-500" />
    },
    {
      text: "How can I contact you?",
      label: "Contact details",
      icon: <Mail className="w-4 h-4 text-amber-500" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-zinc-900/40 relative overflow-hidden">

      {/* Header Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 select-none">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger menu for Mobile/Tablet */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            id="mobile-menu-btn"
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">
              {activeChat ? activeChat.title : "New Conversation"}
            </h1>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Vinay Ippakayala's AI Agent
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Resume Download Button */}
          <a
            href="/resume.pdf"
            download="Vinay_Ippakayala_Resume.pdf"
            id="header-resume-download-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-950/50 hover:border-teal-200 dark:hover:border-teal-900/60 transition-colors cursor-pointer shrink-0"
            title="Download Resume"
          >
            <FileDown className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Resume</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            id="header-theme-toggle-btn"
            className="p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          {/* Right Sidebar Mobile Trigger */}
          <button
            onClick={() => setMobileRightSidebarOpen(!mobileRightSidebarOpen)}
            id="mobile-right-sidebar-toggle-btn"
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer flex items-center justify-center"
            title="View Profile Summary"
          >
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Message List Panel */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
        {!activeChat || activeChat.messages.length === 0 ? (
          /* Empty Chat Area / Starter Prompts Page */
          <div className="max-w-2xl mx-auto h-full flex flex-col justify-center py-8">
            <div className="text-center space-y-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/10 mx-auto">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight">
                  Ask anything about Vinay Ippakayala
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Hi, I'm Vinay's AI portfolio assistant. Grounded directly in Vinay's experience, projects, and skills dataset. Let's get started:
                </p>
              </div>
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {starterPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(prompt.text)}
                  className="p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl hover:border-teal-500/60 dark:hover:border-teal-500/40 hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-none text-left flex items-start gap-3 transition-all duration-250 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/20 transition-colors shrink-0">
                    {prompt.icon}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
                      {prompt.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                      {prompt.text}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Thread Feed */
          <div className="max-w-3xl mx-auto space-y-6">
            {activeChat.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 group ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md shadow-teal-500/5 select-none">
                      AI
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {editingMessageId === msg.id ? (
                      /* Inline Edit Mode */
                      <div className="w-full min-w-[260px] rounded-2xl px-3 py-2.5 border border-teal-500 bg-white dark:bg-zinc-900 shadow-sm space-y-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit(activeChat!.id);
                            }
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          rows={3}
                          autoFocus
                          className="w-full bg-transparent border-0 outline-none resize-none text-sm text-slate-800 dark:text-zinc-100"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(activeChat!.id)}
                            disabled={!editingContent.trim()}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 text-white transition-colors cursor-pointer"
                          >
                            Save & Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Message Bubble container */}
                        <div className={`rounded-2xl px-4 py-3 shadow-xs border text-sm leading-relaxed transition-all duration-300
                          ${isUser
                            ? 'bg-slate-900 dark:bg-zinc-800 text-white border-transparent'
                            : 'bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 border-slate-200/60 dark:border-zinc-900'
                          }`}
                        >
                          {isUser ? (
                            <>
                              <p
                                className={`whitespace-pre-wrap break-words ${isLongMessage(msg.content) && !expandedMessages.has(msg.id) ? 'line-clamp-3' : ''
                                  }`}
                              >
                                {msg.content}
                              </p>
                              {isLongMessage(msg.content) && (
                                <button
                                  onClick={() => toggleMessageExpanded(msg.id)}
                                  className="mt-1.5 text-[11px] font-semibold text-teal-300 hover:text-teal-200 underline underline-offset-2 cursor-pointer"
                                >
                                  {expandedMessages.has(msg.id) ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </>
                          ) : (
                            <Markdown content={msg.content} />
                          )}
                        </div>

                        {/* Hover Action Row */}
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="p-1 rounded text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Copy"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-teal-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {isUser && (
                            <button
                              onClick={() => handleStartEdit(msg.id, msg.content)}
                              className="p-1 rounded text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Edit and resend"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>


              );
            })}

            {/* AI Generation/Thinking Bubble */}
            {isGenerating && (
              <div className="flex gap-3.5 justify-start animate-pulse">
                <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md shadow-teal-500/5 select-none">
                  AI
                </div>
                <div className="bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900 rounded-2xl px-5 py-4 flex items-center gap-1.5 shadow-xs">
                  <div className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Input Bar Panel */}
      <div className="p-4 sm:p-6 shrink-0 border-t border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto relative flex items-end bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about projects, skills, experience, or contact details..."
            disabled={isGenerating}
            className="flex-1 bg-transparent border-0 outline-0 ring-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 text-sm max-h-[180px] py-1 resize-none font-medium pr-10"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            id="chat-send-btn"
            className="absolute right-3.5 bottom-3 p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white transition-all cursor-pointer shadow-sm"
            title="Send Message"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 font-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
