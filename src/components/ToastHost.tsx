'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const ToastHost: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 animate-slide-in max-w-sm"
    >
      {toast.type === 'success' && (
        <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
      )}
      {toast.type === 'error' && (
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
      )}
      {toast.type === 'info' && (
        <Info className="w-5 h-5 text-indigo-500 shrink-0" />
      )}

      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 pr-2">
        {toast.message}
      </span>

      <button
        onClick={hideToast}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
