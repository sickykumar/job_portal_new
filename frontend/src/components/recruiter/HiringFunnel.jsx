import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * HiringFunnel Component
 * Visual breakdown of candidate conversion across the 5 hiring funnel stages.
 */
const HiringFunnel = ({ stages = [], total = 0, onNavigate }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel mb-6 p-4 sm:p-6 w-full min-w-0 overflow-hidden"
    >
      {/* Funnel Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
            Hiring Pipeline Funnel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Application → Review → Interview → Offer
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("recruiter-jobs")}
          className="btn-secondary self-start sm:self-auto text-xs shrink-0"
        >
          <span>Manage Pipeline</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* 5-Stage Visualizer Cards: 2 cols on mobile, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full min-w-0">
        {stages.map(([name, count, color], i) => {
          const percent = total ? Math.round((count / total) * 100) : 0;
          // Last stage spans full width on 2-col mobile
          const isLast = i === stages.length - 1;

          return (
            <div
              key={name}
              className={`rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-white/10 dark:bg-black/20 min-w-0 ${
                isLast ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                Stage {i + 1}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white truncate">
                {name}
              </p>

              <div className="mt-1.5 flex items-end justify-between">
                <b className="text-lg sm:text-xl text-slate-900 dark:text-white">{count}</b>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  {percent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                <div
                  className={`h-full ${color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default HiringFunnel;
