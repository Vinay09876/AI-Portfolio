'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Mail, User, MessageSquare, ArrowRight, CornerDownLeft } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { submitContact, portfolio } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await submitContact(name, email, message);
      if (result) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-900/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900/60 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden grid grid-cols-1 md:grid-cols-5 min-h-[500px]">
        {/* Left column: Quick Contact Details */}
        <div className="md:col-span-2 bg-gradient-to-b from-teal-600 to-indigo-700 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient background blur circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl -ml-20 -mb-20" />

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-teal-100 text-[10px] font-bold tracking-widest uppercase inline-block">
                Get In Touch
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-none">Contact Vinay</h2>
            </div>
            <p className="text-sm text-teal-100 leading-relaxed font-medium">
              Have a role, a project in mind, or just want to say hello? Leave a message here and Vinay will reach back as soon as possible.
            </p>
          </div>

          <div className="space-y-4 pt-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Mail className="w-4.5 h-4.5 text-teal-200" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">Email Me</div>
                <a
                  href={`mailto:${portfolio.profile?.email ?? ''}`}
                  className="text-xs font-semibold hover:underline truncate block"
                >
                  {portfolio.profile?.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-teal-200" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">Based In</div>
                <span className="text-xs font-semibold block">{portfolio.profile?.location}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 text-xs text-teal-100/70 font-medium relative z-10">
            Typically responds in under 24 hours.
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
          {success ? (
            <div className="space-y-4 text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/30 rounded-full flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400 shadow-sm">
                <Send className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your submission is received and mock-logged (will store in Supabase `contact_submissions` later).
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <span>Send Another Message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  Your Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-zinc-900 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:bg-teal-800 transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Message</span>
                    <CornerDownLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
