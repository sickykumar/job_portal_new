import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Building2, Users, Clock } from "lucide-react";
import { formatIndianSalary } from "../../utils/indianFormat";
import { getJobExpiryInfo } from "../../utils/jobStatus";

/**
 * Universal JobCard Component
 * 100% responsive across mobile (tested down to 280px Fold screens), tablet, and desktop.
 * Single source of truth for rendering job cards across the platform.
 */
const JobCard = ({
  job,
  onClick,
  actionLabel = "Open Pipeline Board",
  showApplicants = true,
  className = "",
}) => {
  if (!job) return null;

  const applicantsCount = job.applications?.length || 0;
  const companyName = job.company?.companyName || "Verified Company";
  const location = job.location || "Remote";
  const jobType = job.jobType || "Full-Time";
  const expiryInfo = getJobExpiryInfo(job);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-panel glass-panel-interactive group relative flex w-full min-w-0 max-w-full box-border flex-col justify-between overflow-hidden p-3.5 sm:p-5 text-left transition hover:border-indigo-300 dark:hover:border-slate-700 ${className}`}
    >
      <div className="w-full min-w-0">
        {/* Top Badges Row */}
        <div className="flex w-full items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="badge badge-role shrink-0 text-[10px] sm:text-xs">
              {jobType}
            </span>

            {/* Dynamic Expiry Highlight Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold shrink-0 transition-all ${expiryInfo.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${expiryInfo.dotColor}`} />
              <Clock size={10} className="shrink-0" />
              <span>{expiryInfo.label}</span>
            </span>
          </div>

          {showApplicants && (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-300 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Users size={11} className="shrink-0" />
              <span>{applicantsCount} {applicantsCount === 1 ? "Applicant" : "Applicants"}</span>
            </span>
          )}
        </div>

        {/* Job Title */}
        <h3
          className="mt-2.5 text-sm sm:text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400 line-clamp-2 break-words"
          title={job.title}
        >
          {job.title}
        </h3>

        {/* Company & Location Metadata */}
        <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Building2 size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{companyName}</span>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Salary */}
        {job.salary && (
          <p className="mt-2.5 truncate text-xs font-black text-emerald-600 dark:text-emerald-400">
            {formatIndianSalary(job.salary)}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-indigo-600 dark:border-white/10 dark:text-cyan-400">
        <span className="truncate mr-1">{actionLabel}</span>
        <ChevronRight size={14} className="shrink-0 transition group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
};

export default JobCard;
