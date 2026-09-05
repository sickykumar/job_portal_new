import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Shield,
  FileText,
  Calendar,
  Video,
  ExternalLink,
  LayoutDashboard,
  Send,
  Compass,
  Zap,
  Sparkles,
  Layers,
  ArrowLeft,
  Briefcase,
  Search,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import CandidateStatsGrid from "../components/candidate/CandidateStatsGrid";
import ApplicationJourney from "../components/candidate/ApplicationJourney";
import CandidateResumeCard from "../components/candidate/CandidateResumeCard";
import RecentAppliedJobs from "../components/candidate/RecentAppliedJobs";
import RecommendedJobsSection from "../components/candidate/RecommendedJobsSection";
import CandidateOpportunitiesWidget from "../components/candidate/CandidateOpportunitiesWidget";

/**
 * CandidateDashboard Page
 * Master operating dashboard page for candidates & job seekers.
 */
const CandidateDashboard = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("all");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const firstName = user?.fullname?.split(" ")[0] || "Candidate";

  // 1. Fetch candidate application statistics & recent applied positions
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["candidate-stats"],
    queryFn: async () => {
      const { data } = await api.get("/application/stats");
      return data?.success
        ? { stats: data.stats, recentApplications: data.recentApplications || [] }
        : null;
    },
  });

  const stats = statsData?.stats;
  const recentApplications = statsData?.recentApplications || [];

  // 2. Fetch AI personalized candidate recommended jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["candidate-recommended-jobs"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/automation/recommendations", {
          params: { limit: 4 },
        });
        if (data?.success && data.recommendations?.length > 0) {
          return data.recommendations;
        }
      } catch (err) {
        // Fallback to general job feed
      }
      const { data: fallback } = await api.get("/job/get", { params: { limit: 4 } });
      return fallback?.success ? fallback.jobs || [] : [];
    },
  });

  // 3. Fetch scheduled upcoming interviews
  const { data: upcomingInterviews = [] } = useQuery({
    queryKey: ["candidate-upcoming-interviews"],
    queryFn: async () => {
      const { data } = await api.get("/interview/my-interviews");
      return data?.success ? (data.interviews || []).filter((i) => i.status === "scheduled") : [];
    },
  });

  // Determine which section to show via URL query param (from global sidebar)
  const searchParams = new URLSearchParams(window.location.search);
  const sectionParam = searchParams.get("section");

  // Use URL param if present, otherwise default to "all"
  const effectiveSection = sectionParam || activeSection;

  // Interview Banner Component
  const InterviewBanner = () => {
    if (upcomingInterviews.length === 0) return null;

    return (
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white truncate">
                Upcoming Interview: {upcomingInterviews[0].jobId?.title || "Technical Round"}
              </h3>
              <span className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase shrink-0">
                Confirmed
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              📅 {upcomingInterviews[0].date} at {upcomingInterviews[0].time} • {upcomingInterviews[0].jobId?.company?.companyName || "Employer"}
            </p>
          </div>
        </div>

        <a
          href={upcomingInterviews[0].meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold shrink-0 shadow-lg shadow-indigo-500/25 w-full sm:w-auto"
        >
          <Video size={13} />
          <span>Join Google Meet</span>
          <ExternalLink size={11} />
        </a>
      </div>
    );
  };

  // Profile Readiness Strip Component
  const ProfileReadinessStrip = () => (
    <div className="glass-panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Profile Readiness</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your candidate profile is{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">active</span>. Keep your bio, skills, and resume updated for maximum visibility.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("profile") : navigate("/profile"))}
          className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
        >
          <FileText size={13} />
          <span>Profile Settings</span>
        </button>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("account-settings") : navigate("/account-settings"))}
          className="btn-secondary text-xs px-3.5 py-2"
        >
          <Shield size={13} />
          <span>Account & Security</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full px-3 pt-1 sm:pt-2 pb-6 sm:px-6 lg:px-8 min-w-0">
      {/* Sleek Compact Header (Only on overview/dashboard tab, avoiding duplicate header on applied tab) */}
      {effectiveSection !== "applied" && (
        <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Candidate Career Hub
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active Seeker
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live tracking and status updates for your career journey
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 justify-center shadow-xs"
            >
              <Search size={13} />
              <span>Find Jobs</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 justify-center"
            >
              <User size={13} />
              <span>My Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Full-Width Content Area */}
      <div className="space-y-4 sm:space-y-6">
        {/* Section: Applied Jobs (via sidebar ?section=applied) */}
        {effectiveSection === "applied" ? (
          <RecentAppliedJobs
            applications={recentApplications}
            loading={statsLoading}
            onNavigate={onNavigate}
          />
        ) : effectiveSection === "resume" ? (
          <CandidateResumeCard onNavigate={onNavigate} />
        ) : effectiveSection === "profile" ? (
          <ProfileReadinessStrip />
        ) : (
          /* Default: Executive Hub Overview */
          <>
            {/* 4-Metric Pulse Grid */}
            <CandidateStatsGrid stats={stats} loading={statsLoading} />

            {/* Upcoming Virtual Interviews Alert Banner (if any) */}
            <InterviewBanner />

            {/* Application Journey Milestone Pipeline */}
            <ApplicationJourney
              counts={stats?.statusCounts}
              totalApplications={stats?.totalApplications || 0}
              onNavigate={onNavigate}
            />

            {/* Recent Applied Positions */}
            <RecentAppliedJobs
              applications={recentApplications}
              loading={statsLoading}
              onNavigate={onNavigate}
            />

            {/* Resume PDF Card */}
            <CandidateResumeCard onNavigate={onNavigate} />

            {/* Enrolled Challenges, Verified Badges & Internships */}
            <CandidateOpportunitiesWidget />

            {/* AI Recommended Jobs */}
            <RecommendedJobsSection
              jobs={jobs}
              loading={jobsLoading}
              onNavigate={onNavigate}
            />

            {/* Profile Readiness Strip */}
            <ProfileReadinessStrip />
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
