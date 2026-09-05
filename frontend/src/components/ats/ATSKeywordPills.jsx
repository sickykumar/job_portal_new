import React, { useState } from "react";
import { Check, Copy, AlertTriangle, CheckCircle2 } from "lucide-react";

/**
 * Standalone ATSKeywordPills Component
 * Visual comparison of keywords detected in resume vs expected industry keywords.
 */
const ATSKeywordPills = ({ matched = [], missing = [] }) => {
  const [copiedKey, setCopiedKey] = useState("");

  const handleCopy = (word) => {
    navigator.clipboard.writeText(word);
    setCopiedKey(word);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Matched Keywords */}
      <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/[0.03] p-5 dark:border-emerald-500/15 dark:bg-emerald-950/10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Matched Keywords ({matched.length})
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500">
            Detected in Resume
          </span>
        </div>

        {matched.length === 0 ? (
          <p className="text-xs text-slate-400">No matching technical keywords detected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matched.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                <Check className="h-3 w-3 text-emerald-500" />
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Keywords */}
      <div className="rounded-[24px] border border-amber-500/25 bg-amber-500/[0.03] p-5 dark:border-amber-500/15 dark:bg-amber-950/10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Missing High-Value Keywords ({missing.length})
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-500">
            Click to Copy
          </span>
        </div>

        {missing.length === 0 ? (
          <p className="text-xs text-emerald-500">Outstanding! Your resume contains all critical target keywords.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <button
                type="button"
                key={i}
                onClick={() => handleCopy(kw)}
                title="Click to copy keyword"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-500/20 dark:text-amber-300 cursor-pointer"
              >
                {copiedKey === kw ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-amber-500 opacity-60 group-hover:opacity-100" />
                )}
                {kw}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSKeywordPills;
