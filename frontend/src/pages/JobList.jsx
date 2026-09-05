import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Sparkles,
  CheckCircle,
  ChevronRight,
  X,
  Upload,
  Trash2,
  UserCheck,
  FileText,
  Bookmark,
  Users,
  AlertCircle,
  Building2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { formatIndianSalary } from "../utils/indianFormat";
import { getJobExpiryInfo } from "../utils/jobStatus";
import { useToast } from "../context/ToastContext";

/* =========================
   MAIN COMPONENT
========================= */

const JobList = ({ appliedJobIds = [], initialShowSaved = false }) => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeJobId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryKeyword = searchParams.get("keyword") || "";
  const queryLocation = searchParams.get("location") || "";
  const queryJobType = searchParams.get("jobType") || "";
  const activeJobId = routeJobId || searchParams.get("jobId");

  // Local filter state synchronized with URL query params
  const [filters, setFilters] = useState({
    keyword: queryKeyword,
    location: queryLocation,
    jobType: queryJobType,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [showSaved, setShowSaved] = useState(initialShowSaved);
  const [showApply, setShowApply] = useState(false);

  // Sync filters whenever query params change
  useEffect(() => {
    setFilters({
      keyword: searchParams.get("keyword") || "",
      location: searchParams.get("location") || "",
      jobType: searchParams.get("jobType") || "",
    });
  }, [searchParams]);

  const handleClearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("keyword");
    next.delete("location");
    next.delete("jobType");
    setSearchParams(next);
    setFilters({ keyword: "", location: "", jobType: "" });
  };

  const handleRemoveFilter = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const [profile, setProfile] = useState({
    fullname: "",
    phone: "",
    bio: "",
    skills: "",
    resumeFile: null,
    resumeUrl: "",
    resumeName: "",
  });

  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBioLoading, setAiBioLoading] = useState(false);

  /* =========================
     GET JOBS
  ========================= */

  const jobsQuery = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const params = {};

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;

      const { data } = await api.get("/job/get", { params });

      return data?.success ? data.jobs || [] : [];
    },
  });

  /* =========================
     GET SAVED JOBS
  ========================= */

  const savedQuery = useQuery({
    queryKey: ["savedJobs"],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await api.get("/job/saved");

      return data?.success
        ? (data.jobs || []).map((job) => job?._id || job)
        : [];
    },
    enabled: !!user,
  });

  const jobs = jobsQuery.data || [];
  const savedJobs = savedQuery.data || [];

  /* =========================
     SAVE / UNSAVE JOB
  ========================= */

  const saveJob = useMutation({
    mutationFn: (jobId) => api.post(`/job/save/${jobId}`),

    onSuccess: ({ data }, jobId) => {
      queryClient.setQueryData(["savedJobs"], (oldJobs = []) => {
        if (data.isSaved) {
          return [...oldJobs, jobId];
        }

        return oldJobs.filter((id) => id !== jobId);
      });
    },
  });

  /* =========================
     APPLY JOB
  ========================= */

  const applyJob = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("fullname", profile.fullname);
      formData.append("phoneNumber", profile.phone);
      formData.append("bio", profile.bio);
      formData.append("skills", profile.skills);

      if (profile.resumeFile) {
        formData.append("profilePhoto", profile.resumeFile);
      }

      if (!profile.resumeFile && !profile.resumeUrl) {
        formData.append("removeResume", "true");
      }

      const profileResponse = await api.post(
        "/user/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (profileResponse.data?.success) {
        updateUser(profileResponse.data.user);
      }

      return api.post(`/application/apply/${selectedJob._id}`);
    },

    onSuccess: () => {
      setShowApply(false);

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });


  /* =========================
     AUTO-OPEN JOB FROM ROUTE OR QUERY PARAM
  ========================= */

  useEffect(() => {
    if (!activeJobId) return;

    // First check if the job is already present in loaded jobs
    const existing = jobs.find((j) => (j._id || j.id) === activeJobId);
    if (existing) {
      setSelectedJob(existing);
      return;
    }

    // Otherwise, fetch the single job details by ID from backend
    let isCancelled = false;
    api
      .get(`/job/get/${activeJobId}`)
      .then((res) => {
        if (!isCancelled && res.data?.success && res.data.job) {
          setSelectedJob(res.data.job);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch job details for:", activeJobId, err);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeJobId, jobs]);

  /* =========================
     OPEN / CLOSE JOB
  ========================= */

  const openJob = (job) => {
    setSelectedJob(job);
    setAiResult(null);
  };

  const handleCloseJob = () => {
    setSelectedJob(null);
    setAiResult(null);
    if (routeJobId) {
      navigate("/jobs", { replace: true });
    } else if (searchParams.get("jobId")) {
      const next = new URLSearchParams(searchParams);
      next.delete("jobId");
      setSearchParams(next, { replace: true });
    }
  };

  /* =========================
     OPEN APPLY MODAL
  ========================= */

  const openApplyModal = () => {
    if (!user) {
      toast.requireAuth("Please sign in as a candidate to apply.");
      return;
    }

    setProfile({
      fullname: user.fullname || "",
      phone: user.phoneNumber || "",
      bio: user.profile?.bio || "",
      skills: user.profile?.skills?.join(", ") || "",
      resumeFile: null,
      resumeUrl: user.profile?.resume || "",
      resumeName:
        user.profile?.resumeOriginalname || "Uploaded_Resume.pdf",
    });

    setShowApply(true);
  };

  /* =========================
     AI MATCH
  ========================= */

  const checkAiMatch = async () => {
    if (!selectedJob) return;

    setAiLoading(true);

    try {
      const { data } = await api.post("/ai/match", {
        jobId: selectedJob._id,
      });

      if (data?.success) {
        setAiResult(data);
      }
    } catch (error) {
      console.error("AI Match Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  /* =========================
     AI BIO
  ========================= */

  const enhanceBio = async () => {
    setAiBioLoading(true);

    try {
      const { data } = await api.post("/ai/generate-bio", {
        currentBio: profile.bio,
        currentSkills: profile.skills,
      });

      if (data?.success) {
        setProfile({
          ...profile,
          bio: data.bio || profile.bio,
          skills: data.skills || profile.skills,
        });
      }
    } catch (error) {
      console.error("AI Bio Error:", error);
    } finally {
      setAiBioLoading(false);
    }
  };

  /* =========================
     FILTER JOBS (EXCLUDE INTERNSHIPS)
  ========================= */

  // Strictly regular jobs (internships are exclusively hosted on /internships)
  const regularJobs = jobs.filter((job) => {
    const type = (job.jobType || "").toLowerCase();
    const title = (job.title || "").toLowerCase();
    return !type.includes("intern") && !title.includes("internship");
  });

  const displayedJobs = showSaved
    ? regularJobs.filter((job) => savedJobs.includes(job._id))
    : regularJobs;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent px-3 pt-1 sm:pt-2 pb-6 sm:px-6 lg:px-8">
      <div className="w-full min-w-0">

        {/* Compact Header */}
        <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Find Jobs & Opportunities
              </h1>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
                {displayedJobs.length} Available
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live listings, verified employers, and instant AI skill match
            </p>
          </div>
        </div>

        {/* JOB CONTROLS (TABS & ACTIVE FILTER TAGS - NO SEARCH BOX) */}
        <JobControls
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearFilters={handleClearFilters}
          showSaved={showSaved}
          setShowSaved={setShowSaved}
          jobCount={regularJobs.length}
          savedCount={savedJobs.length}
        />

        {/* JOB LIST */}
        {jobsQuery.isLoading ? (
          <JobSkeleton />
        ) : displayedJobs.length === 0 ? (
          <EmptyState saved={showSaved} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedJobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                saved={savedJobs.includes(job._id)}
                onSave={(e) => {
                  e.stopPropagation();

                  if (!user) {
                    toast.requireAuth("Please sign in to bookmark jobs.");
                    return;
                  }

                  saveJob.mutate(job._id);
                }}
                onClick={() => openJob(job)}
              />
            ))}
          </div>
        )}
      </div>

      {/* JOB DETAILS */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetails
            job={selectedJob}
            user={user}
            saved={savedJobs.includes(selectedJob._id)}
            aiResult={aiResult}
            aiLoading={aiLoading}
            applied={appliedJobIds.includes(selectedJob._id)}
            onClose={handleCloseJob}
            onSave={() => {
              if (!user) {
                toast.requireAuth("Please sign in to bookmark jobs.");
                return;
              }

              saveJob.mutate(selectedJob._id);
            }}
            onAiMatch={checkAiMatch}
            onApply={openApplyModal}
          />
        )}
      </AnimatePresence>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {showApply && selectedJob && (
          <ApplyModal
            job={selectedJob}
            profile={profile}
            setProfile={setProfile}
            loading={applyJob.isPending}
            error={applyJob.error}
            aiLoading={aiBioLoading}
            onAiBio={enhanceBio}
            onClose={() => setShowApply(false)}
            onSubmit={(e) => {
              e.preventDefault();
              applyJob.mutate();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};



/* =========================
   JOB CONTROLS / TABS (NO SEARCH BOX)
========================= */

const JobControls = ({
  filters,
  onRemoveFilter,
  onClearFilters,
  showSaved,
  setShowSaved,
  jobCount,
  savedCount,
}) => {
  const hasActiveFilters = Boolean(filters.keyword || filters.location || filters.jobType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-7 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Category Tabs: All Jobs vs Saved */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowSaved(false)}
          className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all ${
            !showSaved
              ? "btn-primary shadow-xs"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>All Jobs ({jobCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSaved(true)}
          className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all ${
            showSaved
              ? "btn-primary shadow-xs"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Saved ({savedCount})</span>
        </button>
      </div>

      {/* Active Filter Indicators (synchronously populated from Top Navbar Search) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">
            Filtered by:
          </span>

          {filters.keyword && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-cyan-400">
              <span>"{filters.keyword}"</span>
              <button
                type="button"
                onClick={() => onRemoveFilter("keyword")}
                className="hover:opacity-75"
                title="Remove keyword filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.location && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              <MapPin className="h-3 w-3" />
              <span>{filters.location}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter("location")}
                className="hover:opacity-75"
                title="Remove location filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.jobType && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">
              <span>{filters.jobType}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter("jobType")}
                className="hover:opacity-75"
                title="Remove job type filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 ml-1 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {!hasActiveFilters && (
        <span className="text-[11px] text-slate-400">
          Showing verified career opportunities
        </span>
      )}
    </motion.div>
  );
};

/* =========================
   JOB CARD
========================= */

const JobCard = ({ job, index, saved, onSave, onClick }) => {
  const expiryInfo = getJobExpiryInfo(job);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10 sm:p-5 dark:border-slate-700/70 dark:bg-slate-950/75"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-violet-500/20" />

      <div className="relative">
      {/* Company */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo company={job.company} />

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                {job.company?.companyName || "Verified Employer"}
              </p>
              <ShieldCheck className="h-3 w-3 shrink-0 text-cyan-500" />
            </div>

            <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-400">
              <MapPin className="h-3 w-3 shrink-0" />
              {job.location}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          className={`relative z-10 shrink-0 rounded-xl border p-2 transition ${saved
              ? "border-amber-400/30 bg-amber-400/10 text-amber-500"
              : "border-slate-200 bg-slate-50 text-slate-400 hover:border-amber-300 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-900"
            }`}
        >
          <Bookmark
            className="h-3.5 w-3.5"
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Type */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-[9px] font-bold text-blue-500">
          {job.jobType}
        </span>

        <span className="flex items-center gap-1 text-[9px] text-slate-400">
          <Clock className="h-3 w-3" />
          {job.experienceLevel} yrs
        </span>

        <span className="flex items-center gap-1 text-[9px] text-slate-400">
          <Users className="h-3 w-3" />
          {job.position} openings
        </span>

        {/* Dynamic Expiry Highlight Badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-extrabold transition-all ${expiryInfo.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${expiryInfo.dotColor}`} />
          <span>{expiryInfo.label}</span>
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 text-base font-black text-slate-900 dark:text-white">
        {job.title}
      </h3>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
        {job.description}
      </p>

      {/* Skills */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {job.requirements?.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {skill}
          </span>
        ))}

        {job.requirements?.length > 4 && (
          <span className="px-1 py-1 text-[9px] text-slate-400">
            +{job.requirements.length - 4}
          </span>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="relative flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-slate-700/60">
      <div>
        <p className="text-sm font-black text-emerald-500">
          {formatIndianSalary(job.salary)}
        </p>

        <span className="text-[8px] font-bold tracking-wide text-emerald-500/70">
          COMPETITIVE PACKAGE
        </span>
      </div>

      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 transition-all group-hover:gap-2">
        Explore
        <ChevronRight className="h-3.5 w-3.5" />
      </span>
    </div>
  </motion.div>
  );
};

/* =========================
   JOB DETAILS
========================= */

const JobDetails = ({
  job,
  user,
  saved,
  aiResult,
  aiLoading,
  applied,
  onClose,
  onSave,
  onAiMatch,
  onApply,
}) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-md"
    />

    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28 }}
      className="fixed right-0 top-0 z-[1000] flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950/95"
    >
      {/* HEADER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <CompanyLogo company={job.company} large />

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[8px] font-bold text-cyan-500">
                  VERIFIED
                </span>
              </div>

              <h2 className="text-xl font-black leading-tight text-slate-900 sm:text-2xl dark:text-white">
                {job.title}
              </h2>

              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {job.company?.companyName} • {job.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-2.5 min-[390px]:grid-cols-3">
          <Stat
            icon={IndianRupee}
            title="Salary"
            value={formatIndianSalary(job.salary)}
          />

          <Stat
            icon={Clock}
            title="Experience"
            value={`${job.experienceLevel} Years`}
          />

          <Stat
            icon={Users}
            title="Openings"
            value={job.position}
          />
        </div>

        {/* AI MATCH */}
        {user?.role === "student" && (
          <div className="mb-6 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  AI Career Match
                </p>

                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  See how well your profile fits this position.
                </p>
              </div>

              <button
                onClick={onAiMatch}
                disabled={aiLoading}
                className="btn-primary !h-9 !rounded-xl px-4 text-[10px]"
              >
                {aiLoading ? "Analyzing..." : "Analyze My Fit"}
              </button>
            </div>

            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 border-t border-slate-200/50 pt-4 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 text-lg font-black ${aiResult.matchPercentage >= 70
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-500"
                        : "border-amber-400/30 bg-amber-400/10 text-amber-500"
                      }`}
                  >
                    {aiResult.matchPercentage}%
                  </div>

                  <p className="text-[11px] leading-5 text-slate-600 dark:text-slate-300">
                    {aiResult.summary}
                  </p>
                </div>

                {aiResult.matchingSkills?.length > 0 && (
                  <div className="mt-3 rounded-xl bg-emerald-500/10 p-2.5 text-[10px] text-emerald-500">
                    <b>✓ Your strengths:</b>{" "}
                    {aiResult.matchingSkills.join(", ")}
                  </div>
                )}

                {aiResult.missingSkills?.length > 0 && (
                  <div className="mt-2 rounded-xl bg-rose-500/10 p-2.5 text-[10px] text-rose-500">
                    <b>⚡ Skill gaps:</b>{" "}
                    {aiResult.missingSkills.join(", ")}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        <Section title="About this role">
          <p className="whitespace-pre-wrap text-xs leading-6 text-slate-600 sm:text-sm dark:text-slate-300">
            {job.description}
          </p>
        </Section>

        <Section title="Skills & Qualifications">
          <div className="flex flex-wrap gap-2">
            {job.requirements?.map((skill, index) => (
              <span
                key={index}
                className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        {/* EXTRA INFO */}
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox
            icon={Briefcase}
            title="Work Arrangement"
            value={job.jobType}
          />

          <InfoBox
            icon={MapPin}
            title="Location"
            value={job.location}
          />
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="border-t border-slate-200 bg-white/95 p-3 dark:border-slate-800 dark:bg-slate-950/95 sm:p-5">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="btn-secondary flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-[10px] sm:px-5"
          >
            <Bookmark
              className="h-3.5 w-3.5"
              fill={saved ? "currentColor" : "none"}
            />

            <span className="hidden min-[390px]:inline">
              {saved ? "Saved" : "Save"}
            </span>
          </button>

          <button
            disabled={user?.role === "recruiter" || applied}
            onClick={onApply}
            className="btn-primary h-11 flex-1 rounded-xl text-xs"
          >
            {applied
              ? "Already Applied"
              : user?.role === "recruiter"
                ? "Recruiters Cannot Apply"
                : "Review Profile & Apply"}
          </button>
        </div>
      </div>
    </motion.aside>
  </>
);

/* =========================
   APPLY MODAL
========================= */

const ApplyModal = ({
  job,
  profile,
  setProfile,
  loading,
  error,
  aiLoading,
  onAiBio,
  onClose,
  onSubmit,
}) => {
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  const update = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const selectResume = (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.warning("Resume must be smaller than 10MB.");
      return;
    }

    update("resumeFile", file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1050] flex items-center justify-center bg-slate-950/80 p-2 pt-20 backdrop-blur-lg sm:p-5 sm:pt-20"
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onSubmit={onSubmit}
        className="flex max-h-[calc(100vh-100px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-slate-950"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-cyan-500">
              <UserCheck className="h-3 w-3" />
              APPLICATION REVIEW
            </div>

            <h3 className="text-base font-black text-slate-900 sm:text-lg dark:text-white">
              Check Your Profile
            </h3>

            <p className="mt-1 truncate text-[10px] text-slate-500">
              {job.title} • {job.company?.companyName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 text-slate-500 dark:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-3 sm:p-5">
          <div className="mb-4 flex gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-[10px] leading-4 text-blue-500">
            <UserCheck className="h-4 w-4 shrink-0" />
            Your saved profile is already filled in. Update anything you want
            before applying.
          </div>

          {error && (
            <div className="mb-4 flex gap-2 rounded-xl bg-rose-500/10 p-3 text-[10px] text-rose-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error?.response?.data?.message ||
                "Failed to submit application."}
            </div>
          )}

          {/* PERSONAL INFO */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                required
                className="form-input !h-10 !rounded-xl text-xs"
                value={profile.fullname}
                onChange={(e) => update("fullname", e.target.value)}
              />
            </Field>

            <Field label="Phone Number">
              <input
                required
                type="tel"
                className="form-input !h-10 !rounded-xl text-xs"
                placeholder="+91 98765 43210"
                value={profile.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
          </div>

          {/* AI BIO */}
          <div className="my-4 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />

                <div>
                  <p className="text-[10px] font-black text-slate-800 dark:text-white">
                    AI Profile Enhancement
                  </p>

                  <p className="text-[9px] text-slate-500">
                    Improve your bio and skills automatically.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={aiLoading}
                onClick={onAiBio}
                className="btn-secondary !h-8 !rounded-lg px-3 text-[9px]"
              >
                {aiLoading ? "Improving..." : "Enhance with AI"}
              </button>
            </div>
          </div>

          <Field label="Professional Bio">
            <textarea
              rows={4}
              className="form-input !rounded-xl text-xs"
              placeholder="Tell the employer about yourself..."
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value)}
            />
          </Field>

          <div className="mt-4">
            <Field label="Key Skills">
              <input
                className="form-input !h-10 !rounded-xl text-xs"
                placeholder="React, Node.js, MongoDB, AWS..."
                value={profile.skills}
                onChange={(e) => update("skills", e.target.value)}
              />
            </Field>
          </div>

          {/* RESUME */}
          <div className="mt-4">
            <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-300">
              Resume
            </label>

            {profile.resumeFile || profile.resumeUrl ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-400/20 bg-indigo-500/5 p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-500">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-bold text-slate-800 dark:text-white">
                      {profile.resumeFile?.name || profile.resumeName}
                    </p>

                    <p className="text-[9px] text-emerald-500">
                      {profile.resumeFile
                        ? "New resume selected"
                        : "Current profile resume"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      resumeFile: null,
                      resumeUrl: "",
                      resumeName: "",
                    })
                  }
                  className="shrink-0 rounded-lg bg-rose-500/10 p-2 text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  selectResume(e.dataTransfer.files?.[0]);
                }}
                onClick={() =>
                  document.getElementById("resume-input").click()
                }
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${dragging
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900"
                  }`}
              >
                <Upload className="mx-auto mb-2 h-6 w-6 text-slate-400" />

                <p className="text-[10px] font-bold text-slate-700 dark:text-white">
                  Drop your resume here or{" "}
                  <span className="text-cyan-500 underline">
                    browse files
                  </span>
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  PDF, DOC, DOCX • Maximum 10MB
                </p>

                <input
                  id="resume-input"
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => selectResume(e.target.files?.[0])}
                />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800 sm:justify-end sm:p-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary h-10 flex-1 rounded-xl text-xs sm:flex-none sm:px-5"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="btn-primary h-10 flex-1 rounded-xl text-xs sm:flex-none sm:px-6"
          >
            {loading ? "Submitting..." : "Confirm & Apply"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

/* =========================
   SMALL COMPONENTS
========================= */

const CompanyLogo = ({ company, large }) =>
  company?.logo ? (
    <img
      src={company.logo}
      alt=""
      className={`${large ? "h-12 w-12" : "h-10 w-10"
        } shrink-0 rounded-xl bg-white object-cover p-1`}
    />
  ) : (
    <div
      className={`${large ? "h-12 w-12 text-lg" : "h-10 w-10 text-sm"
        } flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 font-black text-blue-500`}
    >
      {company?.companyName?.charAt(0) || "C"}
    </div>
  );

const Stat = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-900">
    <Icon className="mb-1.5 h-3.5 w-3.5 text-blue-500" />

    <p className="text-[8px] uppercase tracking-wide text-slate-400">
      {title}
    </p>

    <p className="mt-0.5 truncate text-[10px] font-black text-slate-800 dark:text-white">
      {value}
    </p>
  </div>
);

const InfoBox = ({ icon: Icon, title, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
    <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
      <Icon className="h-4 w-4" />
    </div>

    <div className="min-w-0">
      <p className="text-[8px] uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="truncate text-[11px] font-bold text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <section className="mb-7">
    <h4 className="mb-2.5 text-sm font-black text-slate-900 dark:text-white">
      {title}
    </h4>

    {children}
  </section>
);

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-300">
      {label}
    </label>

    {children}
  </div>
);

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ saved }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl border border-white/70 bg-white/75 p-10 text-center shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/70"
  >
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
      {saved ? (
        <Bookmark className="h-7 w-7 text-violet-500" />
      ) : (
        <Briefcase className="h-7 w-7 text-slate-400" />
      )}
    </div>

    <h3 className="text-base font-black text-slate-900 dark:text-white">
      {saved
        ? "No saved jobs yet"
        : "No opportunities found"}
    </h3>

    <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-slate-500 dark:text-slate-400">
      {saved
        ? "Save interesting jobs and come back to them later."
        : "Try different keywords, locations or work arrangements."}
    </p>
  </motion.div>
);

/* =========================
   LOADING
========================= */

const JobSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div
        key={item}
        className="h-64 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60"
      />
    ))}
  </div>
);

export default JobList;
