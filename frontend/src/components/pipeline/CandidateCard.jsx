import React from "react";
import { CheckSquare, Square, Download, Calendar, Video, ExternalLink, CheckCircle2, MoreHorizontal } from "lucide-react";

const CandidateCard = ({
  app,
  score,
  selected,
  highlighted = false,
  onToggleSelect,
  onOpenModal,
  onDownloadResume,
  columnId,
}) => {
  const candidate = app?.applicant;
  const skills = candidate?.profile?.skills || [];

  return (
    <div
      className={`rounded-xl border bg-white p-3.5 shadow-sm transition-all dark:bg-slate-900 ${
        highlighted
          ? "ring-2 ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.45)] border-cyan-400 dark:border-cyan-400"
          : selected
          ? "ring-2 ring-indigo-500 border-indigo-400"
          : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
      }`}
    >
      {/* Top Row: Checkbox, Name, Email, AI Score */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <button
            type="button"
            onClick={() => onToggleSelect(app._id)}
            className="mt-0.5 shrink-0 text-indigo-600 dark:text-cyan-400 hover:opacity-80"
          >
            {selected ? <CheckSquare size={16} /> : <Square size={16} />}
          </button>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {candidate?.fullname || "Candidate"}
            </h4>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {candidate?.email}
            </p>
          </div>
        </div>

        {(app.aiScreening?.matchScore || score) && (
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
              (app.aiScreening?.matchScore || score?.score) >= 75
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            }`}
          >
            {app.aiScreening?.matchScore || score?.score}% Fit
          </span>
        )}
      </div>

      {/* Skills Chips */}
      {skills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="self-center text-[10px] text-slate-400">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* AI Screening Recommendation Insight */}
      {app.aiScreening?.recommendation && (
        <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="font-bold text-indigo-500 dark:text-indigo-400">AI Screening:</span> {app.aiScreening.recommendation}
        </div>
      )}

      {/* Interview Tag & Meeting Action */}
      {app.interviewDetails?.date && (
        <div className="mt-2.5 flex flex-col gap-1.5 rounded-xl bg-violet-500/10 p-2 border border-violet-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-violet-700 dark:text-violet-300">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="shrink-0 text-violet-500" />
              <span>{app.interviewDetails.date} {app.interviewDetails.time && `• ${app.interviewDetails.time}`}</span>
            </span>

            {app.interviewDetails?.status === "completed" ? (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={10} />
                <span>Done</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onOpenModal(app, "interview")}
                className="rounded-md p-1 text-violet-600 hover:bg-violet-500/20 dark:text-violet-300"
                title="Manage, complete or delete meeting"
              >
                <MoreHorizontal size={13} />
              </button>
            )}
          </div>
          {app.interviewDetails.meetingLink && (
            <a
              href={app.interviewDetails.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 transition shadow-sm"
            >
              <Video size={12} />
              <span>Join Google Meet</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}

      {/* Card Footer: Resume & Quick Actions */}
      <div className="mt-3 flex items-center justify-between gap-1 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
        {candidate?.profile?.resume ? (
          <button
            type="button"
            onClick={() => onDownloadResume(app._id, candidate?.fullname)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-cyan-400"
          >
            <Download size={12} />
            <span>Resume</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400">No resume</span>
        )}

        <div className="flex items-center gap-1">
          {columnId !== "interview" && (
            <button
              type="button"
              onClick={() => onOpenModal(app, "interview")}
              className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 hover:bg-violet-100 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/25"
            >
              Interview
            </button>
          )}
          {columnId !== "hired" && (
            <button
              type="button"
              onClick={() => onOpenModal(app, "hired")}
              className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
            >
              Hire
            </button>
          )}
          {columnId !== "rejected" && (
            <button
              type="button"
              onClick={() => onOpenModal(app, "rejected")}
              className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
