import React from "react";
import { motion } from "framer-motion";

/**
 * CandidateStatCard Component
 * Displays a single key metric with animated hover state and theme-aware color styling.
 */
const CandidateStatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  iconStyle = "indigo",
}) => {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {value}
          </p>

          <p className="mt-0.5 sm:mt-1 truncate text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`grid h-7 w-7 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl transition group-hover:scale-105 ${styles[iconStyle] || styles.indigo}`}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateStatCard;
