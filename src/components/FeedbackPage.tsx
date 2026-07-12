'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { submitFeedback } = useApp();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [thumbs, setThumbs] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 && thumbs === null) return;

    setIsSubmitting(true);
    try {
      const result = await submitFeedback(rating, thumbs, comment);
      if (result) {
        setSubmitted(true);
        setRating(0);
        setThumbs(null);
        setComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-900/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900/60 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-teal-500 to-indigo-500" />

        {submitted ? (
          <div className="space-y-5 py-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30 rounded-full flex items-center justify-center mx-auto text-amber-500 dark:text-amber-400 shadow-sm">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Feedback Received!</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Thank you so much! Your response helps me iterate and improve this portfolio experience. Submissions are saved locally and ready for Supabase mapping.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Submit More Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Heart className="w-5 h-5 text-amber-500 fill-amber-500/10 shrink-0" />
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight">
                  Share Your Feedback
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md">
                How was your conversation with the portfolio assistant? Help me refine its responses and capabilities.
              </p>
            </div>

            <div className="space-y-5">
              {/* Question 1: Experience rating */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  1. Rate your experience
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-300 hover:text-amber-400 dark:text-zinc-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-transform duration-100 ${
                            isFilled ? 'text-amber-400 fill-amber-400 scale-110' : ''
                          }`}
                        />
                      </button>
                    );
                  })}
                  {rating > 0 && (
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 pl-2">
                      {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                    </span>
                  )}
                </div>
              </div>

              {/* Question 2: Helpful / accurate? */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  2. Was the assistant helpful and accurate?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setThumbs('up')}
                    className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                      ${thumbs === 'up'
                        ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${thumbs === 'up' ? 'fill-teal-500/10' : ''}`} />
                    <span>Yes, very helpful</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThumbs('down')}
                    className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                      ${thumbs === 'down'
                        ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }`}
                  >
                    <ThumbsDown className={`w-4 h-4 ${thumbs === 'down' ? 'fill-rose-500/10' : ''}`} />
                    <span>No, needs work</span>
                  </button>
                </div>
              </div>

              {/* Question 3: Comments */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  3. Any comments or suggestions? (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell me what you liked, what can be improved, or suggestions for additional skills/projects to showcase..."
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (rating === 0 && thumbs === null)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 dark:disabled:bg-zinc-900 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:bg-teal-800 transition-all duration-200 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
