import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  BookmarkCheck,
  Building2,
  MapPin,
  Archive,
  Calendar,
  Video,
  History,
  Briefcase,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  MessageSquare,
  Sparkles,
  Eye,
  X,
  ExternalLink,
  Globe,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { formatIndianSalary } from "../utils/indianFormat";
import { getJobExpiryInfo } from "../utils/jobStatus";

/**
 * AppliedJobs Page
 * Full portfolio & tracking view of all applications submitted by the candidate.
 * Enhanced with direct deep-linking from notifications, auto-highlight, and full Job Details modal.
 */
const AppliedJobs = () => {
  const [searchParams] = useSearchParams();
  const targetJobId = searchParams.get("jobId");
  const targetAppId = searchParams.get("appId");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'history' | 'all'
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [highlightedId, setHighlightedId] = useState(null);
  const [selectedJobModal, setSelectedJobModal] = useState(null);

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const { data } = await api.get("/application/get");
        setApplications(data?.application || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplied();
  }, []);

  // Auto-scroll and expand target application from notification or dashboard deep-link
  useEffect(() => {
    if (!loading && applications.length > 0 && (targetJobId || targetAppId)) {
      const match = applications.find(
        (a) =>
          (targetAppId && a._id === targetAppId) ||
          (targetJobId && (a.job?._id === targetJobId || a.job === targetJobId))
      );
      if (match) {
        const expiry = getJobExpiryInfo(match.job);
        if (!expiry.isActive && activeTab === "active") {
          setActiveTab("history");
        }
        setExpandedIds((prev) => new Set([...prev, match._id]));
        setHighlightedId(match._id);

        setTimeout(() => {
          const el = document.getElementById(`app-card-${match._id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 250);
      }
    }
  }, [loading, applications, targetJobId, targetAppId]);

  const isInactiveApplication = (app) => {
    if (!app.job) return true;
    const expiry = getJobExpiryInfo(app.job);
    return !expiry.isActive;
  };

  const activeApplications = applications.filter((app) => !isInactiveApplication(app));
  const historyApplications = applications.filter((app) => isInactiveApplication(app));

  const displayedApplications =
    activeTab === "active"
      ? activeApplications
      : activeTab === "history"
      ? historyApplications
      : applications;

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(displayedApplications.map((a) => a._id)));
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
    <div className="w-full px-3 pt-1 sm:pt-2 pb-6 sm:px-6 lg:px-8 min-w-0">
      {/* Header & Tabs */}
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              My Applied Positions
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              {activeApplications.length} Active
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live tracking and status updates for your submitted applications
          </p>
        </div>

        {/* Tab Switcher & Accordion Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {displayedApplications.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronsUpDown size={14} className="text-indigo-500" />
              <span>{expandedIds.size > 0 ? "Collapse All" : "Expand All"}</span>
            </button>
          )}

          <div className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/80">
            {[
              { id: "active", label: "Active Roles", count: activeApplications.length },
              { id: "history", label: "History & Closed", count: historyApplications.length, icon: History },
              { id: "all", label: "All", count: applications.length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-cyan-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {Icon && <Icon size={13} />}
                  <span>{tab.label}</span>
                  <span className="rounded-md bg-slate-200/60 px-1.5 py-0.2 text-[10px] dark:bg-slate-700">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* History Archive Alert */}
      {activeTab === "history" && historyApplications.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60">
          <Archive size={18} className="shrink-0 text-indigo-600 dark:text-cyan-400 mt-0.5" />
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">
              Application History Archive:
            </span>{" "}
            These positions have concluded, been filled, or were closed by the employer. Your submission timestamps, interview history, and recruiter feedback remain permanently recorded.
          </p>
        </div>
      )}

      {/* Content Stream */}
      {loading ? (
        <div className="py-20 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Synchronizing application portfolio...
        </div>
      ) : displayedApplications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <BookmarkCheck size={44} className="mx-auto mb-3 text-slate-400 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeTab === "history"
              ? "No archived applications in history"
              : "No active applications right now"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {activeTab === "history"
              ? "When positions you applied for conclude, they will automatically appear here."
              : "Explore open positions in the directory and apply to start tracking your progress."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedApplications.map((app) => {
            const expiry = getJobExpiryInfo(app.job);
            const isNoLongerAvailable = !expiry.isActive;
            const hasDetails = Boolean(app.feedback || app.interviewDetails?.date);
            const isExpanded = expandedIds.has(app._id);

            return (
              <div
                key={app._id}
                id={`app-card-${app._id}`}
                className={`glass-panel overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                  highlightedId === app._id
                    ? "ring-2 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.35)] dark:ring-cyan-400 dark:shadow-[0_0_30px_rgba(6,182,212,0.35)] border-indigo-500 dark:border-cyan-400 bg-indigo-50/10 dark:bg-cyan-950/15"
                    : "border-slate-200/90 bg-white/80 dark:border-slate-800/90 dark:bg-slate-900/80"
                } ${isNoLongerAvailable ? "opacity-90" : ""}`}
              >
                {/* Clickable Header Row / Accordion Trigger */}
                <div
                  onClick={() => hasDetails && toggleExpand(app._id)}
                  className={`p-5 transition ${
                    hasDetails ? "cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/30" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Company Logo & Job Title */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {app.job?.company?.logo ? (
                        <img
                          src={app.job.company.logo}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-xl object-contain bg-white p-1 border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-slate-800 dark:text-cyan-400">
                          {isNoLongerAvailable ? <Archive size={20} /> : <Building2 size={20} />}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            onClick={(e) => {
                              if (app.job) {
                                e.stopPropagation();
                                setSelectedJobModal({ ...app.job, application: app });
                              }
                            }}
                            className="truncate text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-cyan-400 transition-colors cursor-pointer"
                            title="Click to view full job description & requirements"
                          >
                            {app.job?.title || "Position No Longer Available"}
                          </h3>

                          {highlightedId === app._id && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-cyan-400 animate-pulse">
                              <Sparkles size={11} />
                              <span>Target Role</span>
                            </span>
                          )}

                          {isNoLongerAvailable && (
                            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${expiry.badgeClass}`}>
                              {expiry.label === "Expired" ? "Position Expired" : expiry.label === "Archived" ? "Archived by Recruiter" : expiry.label}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {app.job?.company?.companyName || "Original Employer"}
                          </span>
                          {app.job?.location && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={11} /> {app.job.location}
                              </span>
                            </>
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

                        {/* Collapsed Preview Badges */}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {app.interviewDetails?.date && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300">
                              <Calendar size={11} /> Interview Scheduled ({app.interviewDetails.date})
                            </span>
                          )}
                          {app.feedback && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-cyan-300">
                              <MessageSquare size={11} /> Hiring Review Note
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge, View Job Details Button, & Responsive Action Controls */}
                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between sm:justify-center shrink-0 gap-2.5 w-full sm:w-auto mt-2 sm:mt-0 pt-2.5 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-2">
                        {app.job && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJobModal({ ...app.job, application: app });
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:text-cyan-400 dark:hover:bg-slate-800 cursor-pointer"
                            title="View complete job description & qualifications"
                          >
                            <Eye size={13} className="text-indigo-500 dark:text-cyan-400" />
                            <span>Job Details</span>
                          </button>
                        )}

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status || "pending"}
                        </span>

                        {/* Accordion Chevron Trigger */}
                        {hasDetails && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                            <ChevronDown
                              size={15}
                              className={`transform transition-transform duration-300 ${
                                isExpanded ? "rotate-180 text-indigo-600 dark:text-cyan-400" : ""
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Applied on {new Date(app.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible Accordion Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && hasDetails && (
                    <motion.div
                      key={`content-${app._id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="border-t border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-950/40 space-y-3.5"
                    >
                      {/* Recruiter Feedback Note */}
                      {app.feedback && (
                        <div className="rounded-2xl border border-indigo-100 bg-white/90 p-4 text-xs shadow-sm dark:border-indigo-500/20 dark:bg-indigo-950/20">
                          <p className="font-bold text-indigo-700 dark:text-cyan-300 mb-1.5 flex items-center gap-1.5">
                            <MessageSquare size={13} />
                            {app.status === "rejected"
                              ? "Constructive Recruiter Feedback:"
                              : "Hiring Team Review Note:"}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {app.feedback}
                          </p>
                        </div>
                      )}

                      {/* Interview Details if Scheduled */}
                      {app.interviewDetails?.date && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-cyan-500/10 p-4.5 dark:border-violet-500/30">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                              <Calendar size={16} className="text-violet-600 dark:text-violet-400" />
                              <span>
                                Interview Session: {app.interviewDetails.date}{" "}
                                {app.interviewDetails.time && `at ${app.interviewDetails.time}`}
                              </span>
                            </div>
                            {app.interviewDetails.notes && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {app.interviewDetails.notes}
                              </p>
                            )}
                          </div>

                          {app.interviewDetails.meetingLink && (
                            <a
                              href={app.interviewDetails.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary inline-flex items-center gap-2 self-start text-xs font-bold py-2.5 px-4 shadow-lg shadow-indigo-500/25 sm:self-auto"
                            >
                              <Video size={14} />
                              <span>Join Interview Meeting</span>
                            </a>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Job Details Modal for Applied Position */}
      <AnimatePresence>
        {selectedJobModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3.5 min-w-0">
                  {selectedJobModal.company?.logo ? (
                    <img
                      src={selectedJobModal.company.logo}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-2xl object-contain bg-white p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-cyan-400 font-bold shadow-sm">
                      <Building2 size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                      {selectedJobModal.title}
                    </h2>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {selectedJobModal.company?.companyName || "Employer"}
                      </span>
                      {selectedJobModal.location && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} /> {selectedJobModal.location}
                          </span>
                        </>
                      )}
                      {selectedJobModal.company?.website && (
                        <>
                          <span>•</span>
                          <a
                            href={selectedJobModal.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-cyan-400 hover:underline"
                          >
                            <Globe size={12} />
                            <span>Website</span>
                            <ExternalLink size={10} />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJobModal(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                {/* Meta Highlights Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary</p>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                      {formatIndianSalary(selectedJobModal.salary)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white capitalize truncate">
                      {selectedJobModal.jobType || "Full-Time"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {selectedJobModal.experienceLevel ? `${selectedJobModal.experienceLevel} Years` : "Open"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-cyan-400 uppercase truncate">
                      {selectedJobModal.application?.status || "Applied"}
                    </p>
                  </div>
                </div>

                {/* Application Journey Snapshot */}
                {selectedJobModal.application && (
                  <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-cyan-50/60 p-4 dark:border-indigo-500/30 dark:from-indigo-950/30 dark:to-cyan-950/20">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <span className="text-xs font-bold text-indigo-900 dark:text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        Application Status: <span className="uppercase font-black">{selectedJobModal.application.status || "Pending"}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Submitted on {new Date(selectedJobModal.application.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    {selectedJobModal.application.feedback && (
                      <div className="mt-2 rounded-xl bg-white/90 p-3 text-xs text-slate-700 dark:bg-slate-900/80 dark:text-slate-300 border border-indigo-100 dark:border-slate-800">
                        <span className="font-bold text-indigo-600 dark:text-cyan-400 block mb-1">Hiring Note:</span>
                        {selectedJobModal.application.feedback}
                      </div>
                    )}

                    {selectedJobModal.application.interviewDetails?.date && (
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-violet-500/10 border border-violet-500/30 p-3 text-xs">
                        <div>
                          <span className="font-bold text-violet-700 dark:text-violet-300 block">
                            Interview: {selectedJobModal.application.interviewDetails.date} ({selectedJobModal.application.interviewDetails.time || "Time TBA"})
                          </span>
                          {selectedJobModal.application.interviewDetails.notes && (
                            <span className="text-slate-600 dark:text-slate-400 text-[11px] block mt-0.5">
                              {selectedJobModal.application.interviewDetails.notes}
                            </span>
                          )}
                        </div>
                        {selectedJobModal.application.interviewDetails.meetingLink && (
                          <a
                            href={selectedJobModal.application.interviewDetails.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3 self-start sm:self-auto"
                          >
                            <Video size={13} />
                            <span>Join Meeting</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Job Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Job Description & Scope
                  </h4>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 whitespace-pre-line">
                    {selectedJobModal.description || "No detailed description provided."}
                  </div>
                </div>

                {/* Job Requirements */}
                {selectedJobModal.requirements && selectedJobModal.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Key Qualifications & Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobModal.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-cyan-300"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 p-4 sm:px-6 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
                <button
                  type="button"
                  onClick={() => setSelectedJobModal(null)}
                  className="btn-secondary text-xs px-4 py-2 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppliedJobs;
