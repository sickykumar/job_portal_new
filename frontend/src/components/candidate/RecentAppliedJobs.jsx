import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookmarkCheck,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Video,
} from "lucide-react";
import { formatIndianSalary } from "../../utils/indianFormat";
import { getJobExpiryInfo } from "../../utils/jobStatus";

/**
 * RecentAppliedJobs Component
 * Dedicated dashboard showcase for candidate's applied roles.
 * Provides instant status visibility and one-click deep redirection.
 */
const RecentAppliedJobs = ({ applications = [], loading = false, onNavigate }) => {
  const navigate = useNavigate();

  const handleCardClick = (app) => {
    const targetPath = `/applied?jobId=${app.job?._id || ""}&appId=${app._id}`;
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      navigate(targetPath);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "hired" || s === "accepted") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20";
    }
    if (s === "interview") {
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/20";
    }
    if (s === "shortlisted") {
      return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/20";
    }
    if (s === "rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/20";
    }
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="dashboard-card overflow-hidden mt-1 mb-4 sm:mb-6"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-2.5 border-b border-slate-200 p-3 sm:p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-cyan-400">
            <BookmarkCheck size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                My Applied Positions
              </h2>
              {applications.length > 0 && (
                <span className="rounded-full bg-indigo-100 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300 shrink-0">
                  {applications.length} Active
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Live tracking and status updates for your submitted applications
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("applied") : navigate("/applied"))}
          className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 text-[10px] sm:text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-300 dark:hover:text-cyan-400 cursor-pointer w-full sm:w-auto shrink-0"
        >
          <span>View All ({applications.length})</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-5">
        {loading ? (
          <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 sm:h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
              />
            ))}
          </div>
        ) : !applications.length ? (
          <div className="py-6 sm:py-8 text-center">
            <div className="mx-auto mb-2.5 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5">
              <BookmarkCheck size={20} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              No Applications Submitted Yet
            </h3>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Explore open positions and submit your profile to begin tracking interviews and recruiter decisions.
            </p>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate("explore") : navigate("/jobs"))}
              className="btn-primary mt-3 text-xs py-2 px-4 shadow-sm"
            >
              Explore Job Openings
            </button>
          </div>
        ) : (
          <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2">
            {applications.map((app) => {
              const expiry = getJobExpiryInfo(app.job);
              const isExpiredOrArchived = !expiry.isActive;

              return (
                <div
                  key={app._id}
                  onClick={() => handleCardClick(app)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/70 p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 cursor-pointer min-w-0"
                >
                  <div className="min-w-0">
                    {/* Top Row: Logo, Title, Status */}
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        {app.job?.company?.logo ? (
                          <img
                            src={app.job.company.logo}
                            alt=""
                            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-xl object-contain bg-white p-1 border border-slate-200 dark:border-slate-800"
                          />
                        ) : (
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-slate-800 dark:text-cyan-400">
                            <Building2 size={16} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors">
                            {app.job?.title || "Role Application"}
                          </h4>
                          <p className="truncate text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                            {app.job?.company?.companyName || "Employer"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status || "pending"}
                      </span>
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-2 sm:mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                      {app.job?.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={10} />
                          <span className="truncate max-w-[120px]">{app.job.location}</span>
                        </span>
                      )}
                      {app.job?.salary && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatIndianSalary(app.job.salary)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Activity & Action Strip */}
                  <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      {app.interviewDetails?.date ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-violet-700 dark:text-violet-300">
                          <Calendar size={10} /> Interview {app.interviewDetails.date}
                        </span>
                      ) : app.feedback ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-indigo-700 dark:text-cyan-300">
                          <MessageSquare size={10} /> Feedback Added
                        </span>
                      ) : isExpiredOrArchived ? (
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                          Closed / Archived
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] text-slate-400">
                          Applied {new Date(app.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-indigo-600 group-hover:translate-x-0.5 dark:text-cyan-400 transition-transform shrink-0">
                      <span>Track Details</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default RecentAppliedJobs;
