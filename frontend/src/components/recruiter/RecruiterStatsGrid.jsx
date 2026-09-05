import React from "react";
import { Users, Briefcase, Calendar, UserCheck } from "lucide-react";
import RecruiterStatCard from "./RecruiterStatCard";

/**
 * RecruiterStatsGrid Component
 * Displays 4 responsive pulse cards representing the recruiter's core metrics.
 */
const RecruiterStatsGrid = ({ total = 0, activeJobs = 0, interviews = 0, hired = 0 }) => {
  const cards = [
    {
      title: "Candidates",
      value: total,
      text: "Across published roles",
      icon: Users,
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      text: "Receiving applicants",
      icon: Briefcase,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Interviews",
      value: interviews,
      text: "Candidates in interview",
      icon: Calendar,
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Hired",
      value: hired,
      text: total ? `${Math.round((hired / total) * 100)}% conversion` : "Offers accepted",
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <RecruiterStatCard
          key={card.title}
          title={card.title}
          value={card.value}
          text={card.text}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
};

export default RecruiterStatsGrid;
