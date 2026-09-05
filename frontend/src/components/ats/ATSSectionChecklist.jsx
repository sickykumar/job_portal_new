import React from "react";
import { CheckCircle, AlertOctagon, Lightbulb, FileText } from "lucide-react";

/**
 * Standalone ATSSectionChecklist Component
 * Detailed breakdown of Strengths, Critical ATS Red Flags, and Recommendations.
 */
const ATSSectionChecklist = ({ strengths = [], criticalGaps = [], formattingCritique = [], recommendations = [] }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Strengths & Formatting */}
      <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Resume Strengths & Formatting Health
          </h4>
        </div>

        <ul className="space-y-3">
          {strengths.map((item, idx) => (
            <li key={`s-${idx}`} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
          {formattingCritique.map((item, idx) => (
            <li key={`f-${idx}`} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Critical Gaps & Recommendations */}
      <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mb-4 flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-rose-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            ATS Gaps & Strategic Action Items
          </h4>
        </div>

        <ul className="space-y-3">
          {criticalGaps.map((item, idx) => (
            <li key={`g-${idx}`} className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-xs text-rose-700 dark:text-rose-300">
              <span className="mt-0.5 font-bold text-rose-500">•</span>
              <span>{item}</span>
            </li>
          ))}
          {recommendations.map((item, idx) => (
            <li key={`r-${idx}`} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ATSSectionChecklist;
