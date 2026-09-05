import React from "react";
import { motion } from "framer-motion";
import { Clock3, CheckCircle2, Calendar, Send, XCircle, ChevronRight, Layers, Sparkles } from "lucide-react";

/**
 * ApplicationJourney Component
 * Visual breakdown of candidate's progress across hiring funnel stages.
 */
const ApplicationJourney = ({ counts = {}, totalApplications = 0, onNavigate }) => {
  const pipeline = [
    {
      label: "Pending",
      count: counts.pending || 0,
      icon: Clock3,
      style: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    },
    {
      label: "Shortlisted",
      count: counts.shortlisted || 0,
      icon: CheckCircle2,
      style: "bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20",
    },
    {
      label: "Interview",
      count: counts.interview || 0,
      icon: Calendar,
      style: "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20",
    },
    {
      label: "Hired",
      count: (counts.hired || 0) + (counts.accepted || 0),
      icon: Send,
      style: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    },
    {
      label: "Rejected",
      count: counts.rejected || 0,
      icon: XCircle,
      style: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
    },
    {
      label: "Total Apps",
      count: totalApplications || 0,
      icon: Layers,
      style: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-cyan-300 dark:border-indigo-500/20",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="dashboard-card p-3 sm:p-5 flex flex-col justify-start"
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
            Application Journey
          </h2>
          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Your current hiring pipeline progression
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("applied")}
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer shrink-0"
        >
          <span>View All</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* 2-Row Grid: 2 columns on small mobile, 3 columns on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {pipeline.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-xl border p-2 sm:p-2.5 transition hover:-translate-y-0.5 ${item.style}`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Icon size={14} className="shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold truncate">{item.label}</span>
              </div>
              <span className="text-xs sm:text-sm md:text-base font-black shrink-0 ml-1.5 sm:ml-2">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Conversion & Velocity Highlight Banner */}
      <div className="mt-3 sm:mt-4 flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center gap-2 sm:gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-2.5 sm:p-3.5 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-teal-500/5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="grid h-7 w-7 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Sparkles size={14} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-white truncate">
              {(counts.shortlisted || 0) + (counts.interview || 0) > 0
                ? `${(counts.shortlisted || 0) + (counts.interview || 0)} opportunities active in pipeline!`
                : "Ready to accelerate your hiring pipeline?"}
            </p>

            <p className="mt-0.5 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {totalApplications > 0
                ? `${Math.round((((counts.hired || 0) + (counts.interview || 0) + (counts.shortlisted || 0)) / (totalApplications || 1)) * 100)}% positive funnel progression`
                : "Discover open positions & track applications here"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("applied")}
          className="shrink-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer self-end min-[420px]:self-auto"
        >
          <span>Details →</span>
        </button>
      </div>
    </motion.section>
  );
};

export default ApplicationJourney;
