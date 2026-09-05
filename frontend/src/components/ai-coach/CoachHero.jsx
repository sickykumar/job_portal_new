import React from "react";
import { Sparkles } from "lucide-react";

/**
 * CoachHero Component
 * Compact header for AI Career Coach.
 */
const CoachHero = () => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            AI Career Operating Coach
          </h1>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
            Gemini Flash
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Personalized intelligence for technical interviews, negotiation, and career strategy
        </p>
      </div>
    </div>
  );
};

export default CoachHero;
