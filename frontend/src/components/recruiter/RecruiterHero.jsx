import React from "react";
import { motion } from "framer-motion";
import { Sparkles, PlusCircle, Users } from "lucide-react";

/**
 * RecruiterHero Component
 * Top operating console hero banner for recruiters with quick actions to post jobs and view pipelines.
 */
const RecruiterHero = ({ onNavigate }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-6 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-cyan-500/10 p-5 shadow-xl sm:p-8"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400">
            <Sparkles size={13} />
            <span>AI Talent Acquisition</span>
          </span>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
            Recruiter Operating Console
          </h1>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Screen candidates, manage your hiring funnel and move talent from application to offer faster with AI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate("post-job")}
            className="btn-primary text-xs sm:text-sm"
          >
            <PlusCircle size={16} />
            <span>Create Position</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("recruiter-jobs")}
            className="btn-secondary text-xs sm:text-sm"
          >
            <Users size={16} />
            <span>Pipeline</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default RecruiterHero;
