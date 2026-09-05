import React from "react";
import { Search, Award, FileText, Rocket, Lightbulb, ChevronRight, Zap } from "lucide-react";

const PROMPT_GROUPS = [
  {
    title: "Job Search",
    icon: Search,
    prompts: [
      "How can I improve my job search strategy?",
      "How should I target high-paying engineering roles?",
      "How can I stand out from other applicants?",
    ],
  },
  {
    title: "Interview",
    icon: Award,
    prompts: [
      "Create an engineering interview study plan.",
      "What system design topics should I learn?",
      "How can I improve my behavioral interview answers?",
    ],
  },
  {
    title: "Resume",
    icon: FileText,
    prompts: [
      "How can I make my resume ATS-friendly?",
      "How should I describe my full-stack projects?",
      "What are common resume red flags to avoid?",
    ],
  },
  {
    title: "Skills",
    icon: Rocket,
    prompts: [
      "Which skills should I learn for modern full-stack development?",
      "What technologies should I learn after MERN stack?",
      "How can I level up my backend architecture skills?",
    ],
  },
];

const PromptLibrary = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-300">
          <Lightbulb size={15} />
        </div>
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
            Prompt Library & Recommended Topics
          </h3>
          <p className="text-[10px] text-slate-400">
            Click any question to ask your AI career coach immediately
          </p>
        </div>
      </div>

      {/* Row layout with 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PROMPT_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="glass-panel p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="mb-2.5 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-300">
                    <Icon size={12} />
                  </div>
                  <span>{group.title}</span>
                </div>

                <div className="space-y-1">
                  {group.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onSelect(prompt)}
                      className="group flex w-full items-start gap-1.5 rounded-lg p-1.5 text-left text-[11px] leading-snug text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-cyan-300"
                    >
                      <ChevronRight
                        size={12}
                        className="mt-0.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:group-hover:text-cyan-300"
                      />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-width Pro Tip Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 p-4 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:via-blue-500/5 dark:to-cyan-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Pro Career Strategy Tip
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Tailor your resume bullet points with quantifiable metrics and impact percentages to boost recruiter response by 3x.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptLibrary;
