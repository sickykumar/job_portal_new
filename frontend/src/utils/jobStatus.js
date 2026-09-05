/**
 * Centralized Job Status & Expiry Intelligence
 * Single source of truth for computing active, urgent, expired, and archived states
 * across Candidate feeds, Recruiter pipeline, and Applied tracking.
 */
export const getJobExpiryInfo = (job) => {
  if (!job) {
    return {
      isActive: false,
      isExpired: false,
      isArchived: false,
      isClosed: true,
      daysLeft: 0,
      label: "Position Concluded",
      badgeClass: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      dotColor: "bg-slate-400",
    };
  }

  const now = new Date();
  const expiresAt = job.expiresAt ? new Date(job.expiresAt) : null;
  const isExpired = job.status === "expired" || (expiresAt && expiresAt <= now);
  const isArchived = job.status === "archived";
  const isClosed = job.isClosed || job.status === "closed";
  const isActive = (job.status === "published" || !job.status) && !isExpired && !isArchived && !isClosed;

  if (isArchived) {
    return {
      isActive: false,
      isExpired: false,
      isArchived: true,
      isClosed: false,
      daysLeft: 0,
      label: "Archived",
      badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
      dotColor: "bg-amber-500",
    };
  }

  if (isExpired) {
    return {
      isActive: false,
      isExpired: true,
      isArchived: false,
      isClosed: false,
      daysLeft: 0,
      label: "Expired",
      badgeClass: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30",
      dotColor: "bg-rose-500",
    };
  }

  if (isClosed) {
    return {
      isActive: false,
      isExpired: false,
      isArchived: false,
      isClosed: true,
      daysLeft: 0,
      label: "Closed",
      badgeClass: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      dotColor: "bg-slate-400",
    };
  }

  // Active Job with Days calculation
  let daysLeft = 30;
  if (expiresAt) {
    const diffMs = expiresAt.getTime() - now.getTime();
    daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  if (daysLeft <= 3) {
    return {
      isActive: true,
      isExpired: false,
      isArchived: false,
      isClosed: false,
      daysLeft,
      label: `Expiring Soon · ${daysLeft}d left`,
      badgeClass: "bg-amber-500/15 text-amber-600 border-amber-400/40 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/50 shadow-sm shadow-amber-500/10 animate-pulse",
      dotColor: "bg-amber-500",
    };
  }

  return {
    isActive: true,
    isExpired: false,
    isArchived: false,
    isClosed: false,
    daysLeft,
    label: `Active · ${daysLeft}d left`,
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30",
    dotColor: "bg-emerald-400",
  };
};
