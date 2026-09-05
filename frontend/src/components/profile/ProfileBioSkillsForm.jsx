import React from "react";
import { Sparkles, Code } from "lucide-react";

/**
 * ProfileBioSkillsForm Component
 * Professional summary textarea with Gemini AI enhancement and technical skills input.
 */
const ProfileBioSkillsForm = ({
  bio, skills, update,
  isRecruiter,
  onAiBio, aiLoading,
}) => {
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Professional Bio & Expertise
        </h3>

        {!isRecruiter && (
          <button
            type="button"
            onClick={onAiBio}
            disabled={aiLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-500/20 dark:bg-indigo-500/15 dark:text-cyan-300"
          >
            <Sparkles size={13} className={aiLoading ? "animate-spin" : ""} />
            <span>{aiLoading ? "Enhancing..." : "Enhance Bio with AI"}</span>
          </button>
        )}
      </div>

      {/* Bio Textarea */}
      <div>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="Brief professional overview of your background, experience, and domain interests..."
          className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white leading-relaxed"
        />
      </div>

      {/* Skills Input */}
      {!isRecruiter && (
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Technical Skills (Comma-separated)
          </label>
          <div className="relative">
            <Code size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={skills}
              onChange={(e) => update("skills", e.target.value)}
              placeholder="e.g. React, Node.js, Python, TypeScript, Docker"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Skill Tag Pills Preview */}
          {skillList.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {skillList.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileBioSkillsForm;
