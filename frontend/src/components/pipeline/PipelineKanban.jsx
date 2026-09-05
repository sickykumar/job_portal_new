import React from "react";
import CandidateCard from "./CandidateCard";

const columns = [
  { id: "pending", title: "Pending Review", color: "border-amber-500", countBadge: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
  { id: "shortlisted", title: "Shortlisted", color: "border-cyan-500", countBadge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300" },
  { id: "interview", title: "Interview", color: "border-violet-500", countBadge: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300" },
  { id: "hired", title: "Hired / Accepted", color: "border-emerald-500", countBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { id: "rejected", title: "Rejected", color: "border-rose-500", countBadge: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300" },
];

const PipelineKanban = ({
  applicants,
  scores,
  selectedIds,
  highlightApplicantId,
  onToggleSelect,
  onOpenModal,
  onDownloadResume,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 w-full no-scrollbar pb-2">
      {columns.map((col) => {
        const columnApps = applicants.filter((a) => {
          const s = (a.status || "pending").toLowerCase();
          if (col.id === "hired") return s === "hired" || s === "accepted";
          return s === col.id;
        });

        return (
          <div
            key={col.id}
            className={`w-full min-w-0 rounded-2xl border-t-4 ${col.color} border-x border-b border-slate-200 bg-slate-50/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60`}
          >
            {/* Column Header */}
            <div className="mb-2.5 flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate mr-1">
                {col.title}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${col.countBadge}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-2.5 max-h-[calc(100vh-270px)] overflow-y-auto no-scrollbar pr-0.5">
              {columnApps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  No candidates
                </div>
              ) : (
                columnApps.map((app) => (
                  <CandidateCard
                    key={app._id}
                    app={app}
                    columnId={col.id}
                    score={scores[app._id]}
                    selected={selectedIds.includes(app._id)}
                    highlighted={highlightApplicantId === app._id}
                    onToggleSelect={onToggleSelect}
                    onOpenModal={onOpenModal}
                    onDownloadResume={onDownloadResume}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineKanban;
