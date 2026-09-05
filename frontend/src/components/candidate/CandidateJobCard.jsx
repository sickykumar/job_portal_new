import React from "react";
import { motion } from "framer-motion";
import { Compass, ChevronRight } from "lucide-react";
import { formatIndianSalary } from "../../utils/indianFormat";

/**
 * CandidateJobCard Component
 * Modern card displaying individual job recommendations for candidates.
 */
const CandidateJobCard = ({ job, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-500/30"
    >
      {/* Top Gradient Accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

      {/* Badges: Job Type, Affinity Score & Salary */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="truncate rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[9px] font-bold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            {job.jobType || "Full Time"}
          </span>
          {job.affinityScore && (
            <span className="truncate rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-black text-cyan-500 dark:text-cyan-400">
              ⚡ {job.affinityScore}% Fit
            </span>
          )}
        </div>

        <span className="max-w-[40%] truncate text-[10px] font-black text-emerald-600 dark:text-emerald-400">
          {formatIndianSalary(job.salary) || "Competitive"}
        </span>
      </div>

      {/* Job Title & Company */}
      <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
        {job.title}
      </h3>

      <p className="mt-1 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {job.company?.companyName || "Verified Company"}
      </p>

      {/* Match Reason or Location */}
      {job.matchReason ? (
        <p className="mt-1 text-[10px] text-indigo-500 dark:text-indigo-400 truncate font-semibold">
          ✓ {job.matchReason}
        </p>
      ) : (
        <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-slate-400">
          <Compass size={11} />
          <span>{job.location || "Remote"}</span>
        </p>
      )}

      {/* Footer Call to Action */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
        <span className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400">
          View Position
        </span>

        <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-white/5 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-cyan-400">
          <ChevronRight size={13} />
        </div>
      </div>
    </motion.button>
  );
};

export default CandidateJobCard;
