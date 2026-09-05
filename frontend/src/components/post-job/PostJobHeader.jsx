import React from "react";

/**
 * PostJobHeader Component
 * Compact header for the job creation page.
 */
const PostJobHeader = () => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Publish New Opportunity
          </h1>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
            Gemini AI
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Create a job listing, craft high-conversion descriptions with AI, and attract top-tier talent
        </p>
      </div>
    </div>
  );
};

export default PostJobHeader;
