import React from "react";
import { motion } from "framer-motion";
import { Search, FileText, UserRound, ChevronRight, Calendar, FileCheck2, Bell, Sparkles } from "lucide-react";

/**
 * QuickActionItem Helper
 */
const QuickActionItem = ({ icon: Icon, title, text, onClick, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex min-w-0 items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3.5 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md dark:border-white/10 dark:bg-white/[.03] dark:hover:border-indigo-500/20 dark:hover:bg-indigo-500/10 cursor-pointer"
  >
    <div className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-white/5 dark:text-cyan-300">
      <Icon size={15} />
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5 flex-wrap">
        <p className="truncate text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-white">
          {title}
        </p>
        {badge && (
          <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-indigo-500 shrink-0">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-0.5 truncate text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>

    <ChevronRight
      size={13}
      className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-500"
    />
  </button>
);

/**
 * CandidateQuickActions Component
 * Shortcuts for frequent workflows and real-time interview alert banners.
 */
const CandidateQuickActions = ({ interviews = 0, onNavigate }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="dashboard-card p-3 sm:p-5"
    >
      <div className="mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
          Quick Actions & Tools
        </h2>
        <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">
          Continue where you left off with smart career tools
        </p>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid gap-2 sm:gap-2.5 grid-cols-1 min-[440px]:grid-cols-2">
        <QuickActionItem
          icon={FileCheck2}
          title="ATS Resume Scanner"
          text="Score & optimize for ATS"
          badge="AI Powered"
          onClick={() => onNavigate("ats-checker")}
        />

        <QuickActionItem
          icon={Sparkles}
          title="AI Career Coach"
          text="Mock interview & salary prep"
          badge="AI Powered"
          onClick={() => onNavigate("ai-coach")}
        />

        <QuickActionItem
          icon={Search}
          title="Find Jobs"
          text="Discover new opportunities"
          onClick={() => onNavigate("explore")}
        />

        <QuickActionItem
          icon={FileText}
          title="My Applications"
          text="Track hiring pipeline"
          onClick={() => onNavigate("applied")}
        />
      </div>

      {/* Interview Highlight Callout */}
      <div className="mt-3 sm:mt-4 flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center gap-2 sm:gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-2.5 sm:p-3.5 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-blue-500/5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="grid h-7 w-7 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-300">
            <Calendar size={14} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-white truncate">
              {interviews
                ? `You have ${interviews} upcoming interview${interviews > 1 ? "s" : ""}`
                : "No upcoming interviews"}
            </p>

            <p className="mt-0.5 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {interviews
                ? "Check your applications for meeting links"
                : "Keep applying to increase your interview chances"}
            </p>
          </div>
        </div>

        {interviews > 0 && (
          <button
            type="button"
            onClick={() => onNavigate("applied")}
            className="shrink-0 text-[10px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline self-end min-[420px]:self-auto"
          >
            <span>View Details →</span>
          </button>
        )}
      </div>
    </motion.section>
  );
};

export default CandidateQuickActions;
