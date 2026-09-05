import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  PlusCircle,
  Sparkles,
  Search,
  Clock,
  Archive,
  RotateCcw,
} from "lucide-react";
import api from "../services/api";
import PipelineModal from "../components/pipeline/PipelineModal";
import JobCard from "../components/common/JobCard";
import { getJobExpiryInfo } from "../utils/jobStatus";

/**
 * RecruiterJobs Page
 * Master hiring pipeline & candidate screening center for recruiters.
 */
const RecruiterJobs = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlJobId = searchParams.get("jobId");
  const urlAppId = searchParams.get("appId");

  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("active"); // "active" | "expired" | "all"

  // Hide browser window scrollbar when visiting this pipeline screen
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["recruiter-jobs"],
    queryFn: async () => {
      const { data } = await api.get("/job/getadminjobs");
      return data?.jobs || [];
    },
  });

  const handleCreateJob = () => {
    if (onNavigate) {
      onNavigate("post-job");
    } else {
      navigate("/post-job");
    }
  };

  // Group jobs by active vs expired/archived
  const activeJobs = jobs.filter((job) => getJobExpiryInfo(job).isActive);
  const expiredArchivedJobs = jobs.filter((job) => !getJobExpiryInfo(job).isActive);

  // Filter jobs by search query and active status tab
  const filteredJobs = jobs.filter((job) => {
    const expiry = getJobExpiryInfo(job);

    if (statusTab === "active" && !expiry.isActive) return false;
    if (statusTab === "expired" && expiry.isActive) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(q) ||
      job.company?.companyName?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    );
  });

  // Auto-open job pipeline modal if jobId is provided in URL query parameters (e.g. notification click)
  useEffect(() => {
    if (urlJobId && jobs.length > 0 && !selectedJob) {
      const match = jobs.find((j) => (j._id === urlJobId || j.id === urlJobId));
      if (match) {
        const expiry = getJobExpiryInfo(match);
        if (!expiry.isActive && statusTab === "active") {
          setStatusTab("all");
        }
        setSelectedJob(match);
      }
    }
  }, [urlJobId, jobs, selectedJob, statusTab]);

  // Calculate total applicants across all jobs
  const totalApplicants = jobs.reduce(
    (acc, job) => acc + (job.applications?.length || 0),
    0
  );

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Candidate Pipeline & Screening
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              {jobs.length} Positions
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live tracking and status updates for applicants, stages, and interviews
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateJob}
          className="btn-primary self-start text-xs sm:self-auto shrink-0"
        >
          <PlusCircle size={14} />
          <span>Post New Position</span>
        </button>
      </div>

      {/* Pipeline Summary Bar & Quick Search */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Positions
            </p>
            <p className="mt-1 text-xl font-black text-emerald-600 dark:text-cyan-400">
              {activeJobs.length}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-cyan-400">
            <Briefcase size={18} />
          </div>
        </div>

        <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Expired & Archived
            </p>
            <p className="mt-1 text-xl font-black text-slate-600 dark:text-slate-300">
              {expiredArchivedJobs.length}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Archive size={18} />
          </div>
        </div>

        <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Applicants
            </p>
            <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
              {totalApplicants}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
            <Users size={18} />
          </div>
        </div>

        {/* Search Field */}
        <div className="glass-panel p-2 flex items-center gap-2 min-w-0 w-full">
          <Search size={16} className="ml-2.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search positions..."
            className="w-0 flex-1 min-w-0 bg-transparent px-2 py-1 text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mr-2 shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={() => setStatusTab("active")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              statusTab === "active"
                ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-cyan-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Positions</span>
            <span className="rounded-md bg-slate-200/70 px-1.5 py-0.2 text-[10px] dark:bg-slate-700">
              {activeJobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusTab("expired")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              statusTab === "expired"
                ? "bg-white text-rose-600 shadow-sm dark:bg-slate-800 dark:text-rose-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Clock size={12} />
            <span>Expired & Archived</span>
            <span className="rounded-md bg-slate-200/70 px-1.5 py-0.2 text-[10px] dark:bg-slate-700">
              {expiredArchivedJobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusTab("all")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              statusTab === "all"
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span>All ({jobs.length})</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
            />
          ))}
        </div>
      ) : !filteredJobs.length ? (
        <div className="py-20 text-center glass-panel rounded-3xl p-6 sm:p-8 w-full min-w-0">
          <Briefcase className="mx-auto mb-3 text-slate-400 dark:text-slate-600" size={44} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {searchQuery ? "No Positions Match Your Search" : "No Published Positions Found"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {searchQuery
              ? "Try adjusting your search keywords to find the position you're looking for."
              : "Create your first job listing to start receiving and screening candidate applications."}
          </p>

          {!searchQuery && (
            <button
              type="button"
              onClick={handleCreateJob}
              className="btn-primary mt-5 text-xs"
            >
              <PlusCircle size={14} />
              <span>Create Your First Position</span>
            </button>
          )}
        </div>
      ) : (
        /* Unified Responsive Jobs Grid */
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onClick={() => setSelectedJob(job)}
              actionLabel="Open Pipeline Board"
            />
          ))}
        </div>
      )}

      {/* Recruiter Candidate Pipeline Modal Drawer */}
      {selectedJob && (
        <PipelineModal
          job={selectedJob}
          highlightApplicantId={urlAppId}
          onClose={() => {
            setSelectedJob(null);
            if (urlJobId) {
              navigate("/recruiter-jobs", { replace: true });
            }
          }}
        />
      )}
    </div>
  );
};

export default RecruiterJobs;
