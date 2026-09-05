import React from "react";
import { motion } from "framer-motion";

/**
 * RecruiterStatCard Component
 * Displays a single key hiring metric (Candidates, Active Jobs, Interviews, Hired) with hover effects.
 */
const RecruiterStatCard = ({ title, value, text, icon: Icon, color = "text-indigo-600" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel flex min-w-0 items-center justify-between p-3 sm:p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="min-w-0 flex-1 mr-2">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
          {title}
        </p>

        <p className={`mt-0.5 text-xl sm:text-2xl font-black ${color}`}>
          {value}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
          {text}
        </p>
      </div>

      <div className={`shrink-0 rounded-xl bg-slate-100 p-2 sm:p-3 dark:bg-white/5 ${color}`}>
        <Icon size={18} />
      </div>
    </motion.div>
  );
};

export default RecruiterStatCard;
