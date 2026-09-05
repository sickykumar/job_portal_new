import React from "react";
import { motion } from "framer-motion";
import { Briefcase, PlusCircle } from "lucide-react";
import RecruiterJobCard from "./RecruiterJobCard";

/**
 * ActivePositionsSection Component
 * Displays active published roles with applicant counters, quick post action, and zero state.
 */
const ActivePositionsSection = ({ jobs = [], onNavigate }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-panel w-full min-w-0 p-4 sm:p-6 overflow-hidden"
    >
      {/* Section Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
            Active Published Roles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor incoming applications and manage applicant pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("post-job")}
          className="btn-primary self-start sm:self-auto text-xs shrink-0"
        >
          <PlusCircle size={14} />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {!jobs.length ? (
        <div className="py-12 text-center">
          <Briefcase className="mx-auto mb-3 text-slate-400 dark:text-slate-600" size={40} />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            No active positions posted yet.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("post-job")}
            className="btn-primary mt-4 text-xs"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
          {jobs.map((job) => (
            <RecruiterJobCard
              key={job._id}
              job={job}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default ActivePositionsSection;
