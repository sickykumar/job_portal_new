import React from "react";
import JobCard from "../common/JobCard";

/**
 * RecruiterJobCard Component
 * Wraps the universal JobCard component for recruiter views.
 */
const RecruiterJobCard = ({ job, onNavigate, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onNavigate) {
      onNavigate("recruiter-jobs");
    }
  };

  return (
    <JobCard
      job={job}
      onClick={handleClick}
      actionLabel="Review Pipeline"
      showApplicants={true}
    />
  );
};

export default RecruiterJobCard;
