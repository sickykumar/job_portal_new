import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowUpRight, Briefcase } from "lucide-react";
import CandidateJobCard from "./CandidateJobCard";

/**
 * RecommendedJobsSection Component
 * Displays grid of high-affinity opportunities for the candidate with skeletons and empty states.
 */
const RecommendedJobsSection = ({ jobs = [], loading = false, onNavigate }) => {
  const navigate = useNavigate();
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="dashboard-card mt-6 overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-cyan-400">
            <Compass size={18} />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Recommended Jobs
            </h2>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
              Latest opportunities curated for your domain
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("explore")}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-300 dark:hover:text-cyan-400"
        >
          <span>Browse All</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Grid Content */}
      <div className="p-4 sm:p-5">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
              />
            ))}
          </div>
        ) : !jobs.length ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5">
              <Briefcase size={20} />
            </div>

            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No jobs available right now
            </p>

            <button
              type="button"
              onClick={() => onNavigate("explore")}
              className="mt-3 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              <span>Explore All Open Roles →</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {jobs.map((job) => (
              <CandidateJobCard
                key={job._id}
                job={job}
                onClick={() => navigate(`/description/${job._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default RecommendedJobsSection;
