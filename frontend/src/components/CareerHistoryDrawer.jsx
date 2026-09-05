import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  History, X, MapPin, Calendar, Video, ArrowUpRight,
  ChevronDown, MessageSquare, Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatIndianSalary } from "../utils/indianFormat";

/**
 * CareerHistoryItem Component
 * Single animated list row with accordion for employer review notes / feedback.
 */
const CareerHistoryItem = ({ app, index, isNoteOpen, onToggleNote }) => {
  const job = app.job;
  const isClosed = !job || job.isClosed;
  const noteText = app.feedback || app.interviewDetails?.notes;

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
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", damping: 20, stiffness: 240, delay: index * 0.03 },
        },
      }}
      whileHover={{ y: -1 }}
      className="group rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:p-4"
    >
      {/* Main List Row Header */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Title + Company Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/70 text-xs font-bold text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-400">
            {job?.company?.logo ? (
              <img
                src={job.company.logo}
                alt=""
                className="h-full w-full rounded-xl object-contain p-1"
              />
            ) : (
              (job?.company?.companyName || "C").charAt(0).toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {job?.title || "Archived Position"}
              </h4>
              {isClosed && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Closed
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {job?.company?.companyName || "Verified Employer"}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} />
                {job?.location || "Remote"}
              </span>
              {job?.salary && (
                <>
                  <span>•</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatIndianSalary(job.salary)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status Badge & Applied Date */}
        <div className="flex flex-col items-end shrink-0">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(
              app.status
            )}`}
          >
            {app.status || "pending"}
          </span>
          <span className="mt-1 text-[10px] text-slate-400">
            {new Date(app.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
      </div>

      {/* Inline Interview Tag */}
      {app.interviewDetails?.date && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-200/80 bg-violet-50/60 px-3 py-1.5 text-xs text-violet-800 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <Calendar size={13} className="text-violet-600 dark:text-violet-400" />
            <span>
              Interview: {app.interviewDetails.date} at {app.interviewDetails.time}
            </span>
          </div>

          {app.interviewDetails.meetingLink && (
            <a
              href={app.interviewDetails.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-violet-700 underline hover:text-violet-900 dark:text-violet-300 dark:hover:text-white"
            >
              <Video size={12} />
              <span>Join Meeting ↗</span>
            </a>
          )}
        </div>
      )}

      {/* Accordion Trigger for Employer Note / Feedback */}
      {noteText && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onToggleNote}
            className="flex w-full items-center justify-between text-left text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <div className="flex items-center gap-1.5">
              <MessageSquare size={13} />
              <span>{isNoteOpen ? "Hide Employer Note" : "View Employer Note / Feedback"}</span>
            </div>

            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isNoteOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Accordion Content with Spring Animation */}
          <AnimatePresence>
            {isNoteOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-2xl border border-indigo-100 bg-slate-50/80 p-4 text-xs shadow-inner dark:border-indigo-500/20 dark:bg-slate-950/60 sm:p-5">
                  {/* Highlighted Subject Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 rounded-md bg-indigo-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950">
                        Subject
                      </span>
                      <h5 className="truncate font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {app.status === "interview"
                          ? `Interview Preparation & Agenda for ${job?.title || "Role"}`
                          : app.status === "hired" || app.status === "accepted"
                          ? `Offer & Onboarding Instructions for ${job?.title || "Position"}`
                          : `Application Decision & Constructive Feedback for ${job?.title || "Position"}`}
                      </h5>
                    </div>

                    <span className="shrink-0 text-[10px] font-medium text-slate-400">
                      {app.reviewedAt
                        ? `Date: ${new Date(app.reviewedAt).toLocaleDateString("en-IN")}`
                        : `Date: ${new Date(app.createdAt).toLocaleDateString("en-IN")}`}
                    </span>
                  </div>

                  {/* Letter Body (Next Row) */}
                  <div className="pt-3 space-y-2.5">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      Dear Candidate,
                    </p>

                    <div className="rounded-xl border-l-4 border-indigo-500 bg-white/80 p-3.5 text-slate-700 shadow-sm dark:border-cyan-400 dark:bg-slate-900/80 dark:text-slate-200 sm:p-4">
                      <p className="whitespace-pre-line font-normal leading-6">
                        {noteText}
                      </p>
                    </div>

                    {/* Letter Sign-off Footer */}
                    <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <p className="font-medium">Sincerely,</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {job?.company?.companyName || "The Hiring Team"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

/**
 * CareerHistoryDrawer Component
 * Slide-out right panel displaying candidate's application history in a sleek list with accordion notes and animations.
 */
const CareerHistoryDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openNoteId, setOpenNoteId] = useState(null);

  // Auto-close open accordion when activeTab changes or drawer closes
  useEffect(() => {
    setOpenNoteId(null);
  }, [activeTab, isOpen]);

  // Fetch applicant's complete application records
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["candidate-career-history"],
    queryFn: async () => {
      const { data } = await api.get("/application/get");
      return data?.application || [];
    },
    enabled: isOpen,
  });

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Categorize applications
  const activeApps = applications.filter(
    (a) => a.job && !a.job.isClosed && a.status !== "rejected"
  );
  const interviewApps = applications.filter(
    (a) =>
      a.status === "interview" ||
      a.status === "hired" ||
      a.status === "accepted" ||
      a.interviewDetails?.date
  );
  const archivedApps = applications.filter(
    (a) => !a.job || a.job.isClosed || a.status === "rejected"
  );

  const displayedList =
    activeTab === "active"
      ? activeApps
      : activeTab === "interviews"
      ? interviewApps
      : activeTab === "archived"
      ? archivedApps
      : applications;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Slide-out Compact Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 z-[1010] flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-w-2xl"
          >
            {/* Drawer Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-cyan-400">
                  <History size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Career History & Applications
                    </h2>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-600 dark:bg-indigo-500/15 dark:text-cyan-400">
                      {applications.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Track all active and archived application records
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/jobs");
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <span>Explore Jobs</span>
                  <ArrowUpRight size={12} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex shrink-0 items-center gap-1.5 border-b border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-slate-900/40 sm:px-5">
              {[
                { id: "all", label: "All History", count: applications.length },
                { id: "active", label: "Active", count: activeApps.length },
                { id: "interviews", label: "Interviews", count: interviewApps.length },
                { id: "archived", label: "Archived", count: archivedApps.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-cyan-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="rounded-md bg-slate-100 px-1 py-0.2 text-[9px] dark:bg-slate-700">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Animated List Container */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 no-scrollbar">
              {isLoading ? (
                <div className="py-20 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                  Loading application history...
                </div>
              ) : displayedList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <Briefcase size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No records in this category
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Applications and employer responses will appear here.
                  </p>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.04 },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                  className="space-y-2.5"
                >
                  {displayedList.map((app, idx) => (
                    <CareerHistoryItem
                      key={app._id}
                      app={app}
                      index={idx}
                      isNoteOpen={openNoteId === app._id}
                      onToggleNote={() =>
                        setOpenNoteId((prev) => (prev === app._id ? null : app._id))
                      }
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CareerHistoryDrawer;
