import React from "react";
import { CheckSquare, Square, Download, Calendar, Video, ExternalLink } from "lucide-react";

const getStatusBadge = (status) => {
  const s = (status || "pending").toLowerCase();
  if (s === "hired" || s === "accepted") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/20";
  }
  if (s === "interview") {
    return "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300 border-violet-300 dark:border-violet-500/20";
  }
  if (s === "shortlisted") {
    return "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/20";
  }
  if (s === "rejected") {
    return "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border-rose-300 dark:border-rose-500/20";
  }
  return "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border-amber-300 dark:border-amber-500/20";
};

const PipelineList = ({
  applicants,
  scores,
  selectedIds,
  highlightApplicantId,
  onToggleSelect,
  onSelectAll,
  onOpenModal,
  onDownloadResume,
}) => {
  return (
    <div className="space-y-3">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="btn-secondary !h-8 px-3 text-xs"
          >
            {selectedIds.length === applicants.length && applicants.length > 0
              ? "Deselect All"
              : "Select All Candidates"}
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selectedIds.length} candidate(s) selected
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Total: {applicants.length} applicants
        </span>
      </div>

      {/* Applicant Row Cards */}
      <div className="space-y-2.5">
        {applicants.map((app) => {
          const candidate = app.applicant;
          const score = scores[app._id];
          const isSelected = selectedIds.includes(app._id);
          const isHighlighted = highlightApplicantId === app._id;

          return (
            <div
              key={app._id}
              className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between ${
                isHighlighted
                  ? "ring-2 ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.45)] border-cyan-400 dark:border-cyan-400 bg-cyan-50/20 dark:bg-cyan-950/20"
                  : isSelected
                  ? "border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20"
                  : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              }`}
            >
              {/* Left: Checkbox + Name + Status + AI Score */}
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleSelect(app._id)}
                  className="mt-1 text-indigo-600 dark:text-cyan-400 hover:opacity-80 shrink-0"
                >
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {candidate?.fullname || "Candidate"}
                    </h4>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status || "pending"}
                    </span>
                    {score && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          score.score >= 75
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                        }`}
                      >
                        {score.score}% Match
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{candidate?.email}</span>
                    <span>•</span>
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString("en-IN")}</span>
                    {app.interviewDetails?.date && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                          <Calendar size={11} />
                          Interview: {app.interviewDetails.date} {app.interviewDetails.time}
                        </span>
                        {app.interviewDetails.meetingLink && (
                          <a
                            href={app.interviewDetails.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-indigo-700 transition"
                          >
                            <Video size={10} />
                            <span>Join Meet</span>
                            <ExternalLink size={9} />
                          </a>
                        )}
                      </>
                    )}
                  </div>

                  {candidate?.profile?.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidate.profile.skills.slice(0, 5).map((s, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                {candidate?.profile?.resume && (
                  <button
                    type="button"
                    onClick={() => onDownloadResume(app._id, candidate?.fullname)}
                    className="btn-secondary !h-8 px-2.5 text-xs inline-flex items-center gap-1 text-indigo-600 dark:text-cyan-400"
                  >
                    <Download size={13} />
                    <span>Resume</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenModal(app, "interview")}
                  className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300"
                >
                  Interview
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal(app, "hired")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                >
                  Hire
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal(app, "rejected")}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineList;
