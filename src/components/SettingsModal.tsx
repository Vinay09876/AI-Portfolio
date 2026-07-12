'use client';

import React, { useState } from 'react';
import { useApp, ThemeType } from '../context/AppContext';
import { X, Sun, Moon, Laptop, Trash2, User, Mail, ShieldAlert } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    theme,
    setTheme,
    clearChatHistory
  } = useApp();

  const [confirmClear, setConfirmClear] = useState(false);

  if (!settingsOpen) return null;

  const handleClearHistory = () => {
    clearChatHistory();
    setConfirmClear(false);
    setSettingsOpen(false);
  };

  const themes: { value: ThemeType; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4.5 h-4.5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4.5 h-4.5" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-4.5 h-4.5" /> }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          setSettingsOpen(false);
          setConfirmClear(false);
        }}
      />

      {/* Modal Card */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative z-10 transition-transform duration-300 scale-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-900 shrink-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50">Settings</h3>
          <button
            onClick={() => {
              setSettingsOpen(false);
              setConfirmClear(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Section: Profile info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              User Profile
            </h4>
            <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-400 dark:text-zinc-500">Full Name</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-zinc-200 truncate">Vinay Srinivas Ippakayala</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-400 dark:text-zinc-500">Email Address</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-zinc-200 truncate">vinayippakayala01@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Theme Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Interface Theme
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => {
                const isSelected = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                      ${isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Danger Zone / History management */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              Danger Zone
            </h4>
            <div className="border border-rose-100 dark:border-rose-950/30 bg-rose-50/30 dark:bg-rose-950/10 rounded-xl p-4">
              {!confirmClear ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">Clear Conversations</div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                      Permanently delete all chat histories in this browser session. This cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2.5 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-xs font-bold">Are you absolutely sure?</div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                        This action will wipe out all conversations stored in your current session context.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-1.5 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-md text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearHistory}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      Yes, Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
