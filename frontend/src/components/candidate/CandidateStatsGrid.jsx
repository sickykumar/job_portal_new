import React from "react";
import { Briefcase, Calendar, CheckCircle2, Send } from "lucide-react";
import CandidateStatCard from "./CandidateStatCard";

/**
 * CandidateStatsGrid Component
 * Displays 4 responsive pulse cards representing the candidate's core metrics.
 */
const CandidateStatsGrid = ({ stats, loading }) => {
  const counts = stats?.statusCounts || {};
  const totalApplications = stats?.totalApplications || 0;
  const activeApplications = stats?.activeApplications ?? totalApplications;
  const interviews = stats?.scheduledInterviews || 0;
  const responseRate = stats?.responseRate || 0;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <CandidateStatCard
        icon={Briefcase}
        title="Applications"
        value={loading ? "—" : activeApplications}
        subtitle={`${totalApplications} total submitted`}
        iconStyle="indigo"
      />

      <CandidateStatCard
        icon={Calendar}
        title="Interviews"
        value={loading ? "—" : interviews}
        subtitle={interviews ? "Upcoming interviews" : "No interviews scheduled"}
        iconStyle="violet"
      />

      <CandidateStatCard
        icon={CheckCircle2}
        title="Shortlisted"
        value={loading ? "—" : counts.shortlisted || 0}
        subtitle="Applications shortlisted"
        iconStyle="cyan"
      />

      <CandidateStatCard
        icon={Send}
        title="Response Rate"
        value={loading ? "—" : `${responseRate}%`}
        subtitle="Recruiter response rate"
        iconStyle="emerald"
      />
    </div>
  );
};

export default CandidateStatsGrid;
