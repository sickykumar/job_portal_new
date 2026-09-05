import React from "react";
import { Sparkles } from "lucide-react";

/**
 * JobAiDescriptionField Component
 * Key requirements input and AI-powered job description textarea with Gemini auto-generation.
 */
const JobAiDescriptionField = ({
  requirements, setRequirements,
  description, setDescription,
  generatingJd, handleAiGenerate,
}) => {
  return (
    <div className="space-y-4">
      {/* Key Requirements */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Key Requirements / Skills (Comma-separated)
        </label>
        <input
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="e.g. React, Node.js, MongoDB, AWS, TypeScript"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Description Textarea + AI Generation Trigger */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Job Description *
          </label>

          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={generatingJd}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-500/20 dark:bg-indigo-500/15 dark:text-cyan-300"
          >
            <Sparkles size={13} className={generatingJd ? "animate-spin" : ""} />
            <span>{generatingJd ? "Drafting with AI..." : "Generate with AI"}</span>
          </button>
        </div>

        <textarea
          required
          rows={7}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed job description, responsibilities, culture, and requirements..."
          className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white leading-relaxed"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Tip: AI will structure this in clean, professional plain text with bullet points.
        </p>
      </div>
    </div>
  );
};

export default JobAiDescriptionField;
