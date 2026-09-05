import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Shield,
  Video,
  ExternalLink,
  TrendingUp,
  Calendar,
  Sparkles,
  PlusCircle,
  Users,
} from "lucide-react";
import api from "../services/api";
import RecruiterStatsGrid from "../components/recruiter/RecruiterStatsGrid";
import HiringFunnel from "../components/recruiter/HiringFunnel";
import ActivePositionsSection from "../components/recruiter/ActivePositionsSection";
import RecruiterOpportunitiesHub from "../components/recruiter/RecruiterOpportunitiesHub";

/**
 * RecruiterDashboard Page
 * Master operating console page for recruiters & hiring managers.
 */
const RecruiterDashboard = ({ onNavigate }) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const sectionParam = searchParams.get("section");
  const [activeSection, setActiveSection] = useState(sectionParam || "all");

  // Fetch recruiter analytics and active jobs concurrently
  const { data = {}, isLoading } = useQuery({
    queryKey: ["recruiter-dashboard"],
    queryFn: async () => {
      const [statsRes, jobsRes] = await Promise.all([
        api.get("/application/recruiter-stats"),
        api.get("/job/getadminjobs"),
      ]);

      return {
        stats: statsRes.data?.success ? statsRes.data.stats : {},
        jobs: jobsRes.data?.success ? jobsRes.data.jobs || [] : [],
      };
    },
  });

  // Fetch upcoming scheduled interviews for recruiter
  const { data: upcomingInterviews = [] } = useQuery({
    queryKey: ["recruiter-upcoming-interviews"],
    queryFn: async () => {
      const res = await api.get("/interview/my-interviews");
      return res.data?.success ? res.data.interviews : [];
    },
    staleTime: 30 * 1000,
  });

  const { stats = {}, jobs = [] } = data;
  const funnel = stats.funnel || {};
  const total = stats.totalApplicants || 0;
  const hired = (funnel.hired || 0) + (funnel.accepted || 0);
  const activeJobs = stats.activeJobsCount ?? jobs.length;
  const activeInternships = jobs.filter(
    (j) => (j.jobType || "").toLowerCase() === "internship"
  );

  const stages = [
    ["Applications", total, "bg-blue-500"],
    ["Pending", funnel.pending || 0, "bg-amber-500"],
    ["Shortlisted", funnel.shortlisted || 0, "bg-cyan-500"],
    ["Interview", funnel.interview || 0, "bg-violet-500"],
    ["Hired", hired, "bg-emerald-500"],
  ];

  const effectiveSection = sectionParam || activeSection;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
        Loading recruiter operating console...
      </div>
    );
  }

  // Interview Banner Component
  const InterviewBanner = () => {
    if (upcomingInterviews.length === 0) {
      if (activeSection === "interviews") {
        return (
          <div className="dashboard-card p-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
              <Calendar size={28} />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">No Scheduled Interviews</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              You do not have any upcoming technical interviews right now. Shortlist candidates and schedule interviews from your active postings.
            </p>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-transparent p-4 sm:p-5 backdrop-blur-md shadow-xl shadow-violet-500/5">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
            <Video size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Upcoming Technical Interview: {upcomingInterviews[0].candidateId?.fullname || "Candidate"}
              </h3>
              <span className="rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2 py-0.5 text-[10px] font-black uppercase">
                Confirmed Schedule
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              📅 {upcomingInterviews[0].date} at {upcomingInterviews[0].time} • Role: {upcomingInterviews[0].jobId?.title || "Engineering Position"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {upcomingInterviews[0].meetingLink && (
            <a
              href={upcomingInterviews[0].meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/25 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
            >
              <Video size={14} />
              <span>Launch Google Meet</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    );
  };

  // Company Profile Strip Component
  const CompanyStrip = () => (
    <div className="glass-panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">
          <Building2 size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Organization Profile & Hiring Team Settings
            </h3>
            <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-black text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400">
              Verified Recruiter
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            Update company branding, hiring department specializations, and applicant influx alerts.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("profile") : navigate("/profile"))}
          className="btn-secondary text-xs px-3.5 py-2"
        >
          <Building2 size={13} />
          <span>Company Profile</span>
        </button>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("account-settings") : navigate("/account-settings"))}
          className="btn-secondary text-xs px-3.5 py-2"
        >
          <Shield size={13} />
          <span>Hiring Security & Alerts</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0">
      {/* Sleek Compact Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Recruiter Command Center
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {activeJobs} Active Roles
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live tracking and status updates for your candidate pipeline
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate("post-job") : navigate("/post-job"))}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 justify-center shadow-xs"
          >
            <PlusCircle size={14} />
            <span>Create Position</span>
          </button>
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate("recruiter-jobs") : navigate("/recruiter-jobs"))}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 justify-center"
          >
            <Users size={14} />
            <span>Pipeline</span>
          </button>
        </div>
      </div>

      {/* Full-Width Main Content Area */}
      <div className="w-full space-y-6">
        {effectiveSection === "jobs" ? (
          <ActivePositionsSection
            jobs={jobs}
            onNavigate={onNavigate}
          />
        ) : effectiveSection === "funnel" ? (
          <HiringFunnel
            stages={stages}
            total={total}
            onNavigate={onNavigate}
          />
        ) : effectiveSection === "interviews" ? (
          <InterviewBanner />
        ) : effectiveSection === "metrics" ? (
          <RecruiterStatsGrid
            total={total}
            activeJobs={activeJobs}
            interviews={funnel.interview || 0}
            hired={hired}
          />
        ) : effectiveSection === "company" ? (
          <CompanyStrip />
        ) : (
          /* Default: Executive Hub Overview */
          <div className="space-y-6">
            {/* Upcoming Interviews Live Action Banner (if any) */}
            <InterviewBanner />

            {/* 4-Metric Pulse Grid */}
            <RecruiterStatsGrid
              total={total}
              activeJobs={activeJobs}
              interviews={funnel.interview || 0}
              hired={hired}
            />

            {/* 5-Stage Recruitment Funnel Visualizer */}
            <HiringFunnel
              stages={stages}
              total={total}
              onNavigate={onNavigate}
            />

            {/* Active Positions Summary */}
            <ActivePositionsSection
              jobs={jobs}
              onNavigate={onNavigate}
            />

            {/* Opportunities Hub: Internships, Hackathons, Screening Quizzes */}
            <RecruiterOpportunitiesHub activeInternships={activeInternships} />

            {/* Executive Action Summary Card */}
            <div className="dashboard-card p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Talent Acquisition Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You have <strong className="text-slate-900 dark:text-white font-bold">{activeJobs} active job postings</strong> with a total influx of <strong className="text-slate-900 dark:text-white font-bold">{total} applicants</strong>. Manage applicants, schedule technical interviews, or broadcast notifications directly from your pipeline.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate("post-job") : navigate("/post-job"))}
                  className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
                >
                  <PlusCircle size={13} />
                  <span>Post New Role</span>
                </button>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate("recruiter-jobs") : navigate("/recruiter-jobs"))}
                  className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
                >
                  <TrendingUp size={13} />
                  <span>View Pipeline</span>
                </button>
              </div>
            </div>

            {/* Organization Profile & Settings Strip */}
            <CompanyStrip />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
