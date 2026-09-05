import React, { useState } from "react";
import { Sparkles, X, Calendar, Clock, Video, ExternalLink, ShieldCheck, CheckCircle2, Trash2 } from "lucide-react";
import api from "../../services/api";

const StatusDecisionModal = ({ modal, job, onClose, onSubmit, isPending }) => {
  if (!modal) return null;

  const [form, setForm] = useState({
    feedback: modal.feedback || "",
    date: modal.date || "",
    time: modal.time || "",
    meetingLink: modal.meetingLink || "",
    notes: modal.notes || "",
  });

  const [generatingAi, setGeneratingAi] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleAiDraft = async () => {
    setGeneratingAi(true);
    try {
      if (modal.targetStatus === "interview") {
        const { data } = await api.post("/ai/generate-interview", {
          candidateName: modal.app.applicant?.fullname,
          jobTitle: job?.title,
        });
        if (data?.success && data.notes) {
          update("feedback", data.notes);
        }
      } else {
        const { data } = await api.post("/ai/generate-feedback", {
          status: modal.targetStatus,
          candidateName: modal.app.applicant?.fullname,
          jobTitle: job?.title,
          optionalReason: form.feedback,
        });
        if (data?.success && data.feedback) {
          update("feedback", data.feedback);
        }
      }
    } catch (err) {
      console.error("AI Decision Note Error:", err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      targetStatus: modal.targetStatus,
      app: modal.app,
    });
  };

  const isInterview = modal.targetStatus === "interview";
  const isRejected = modal.targetStatus === "rejected";
  const isHired = modal.targetStatus === "hired";

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto bg-black/80 p-3 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[calc(100vh-100px)] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isInterview
                ? "Schedule Interview"
                : isHired
                ? "Confirm Offer / Hiring Decision"
                : "Reject Candidate with Feedback"}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Candidate:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {modal.app?.applicant?.fullname || "Candidate"}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {isInterview && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Calendar size={13} className="text-indigo-500" />
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="form-input w-full text-xs !h-10 !rounded-xl"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Clock size={13} className="text-indigo-500" />
                    Interview Time (IST) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3:30 PM IST"
                    className="form-input w-full text-xs !h-10 !rounded-xl"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between flex-wrap gap-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Video size={13} className="text-indigo-500" />
                    Virtual Meeting Link (Google Meet / Teams / Zoom)
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    ✨ Auto-generated if blank
                  </span>
                </div>

                {/* Recruiter Host Helper Card */}
                <div className="mb-2 p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-500 shrink-0" />
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                      Want to be the <strong>meeting host</strong> with your own Gmail?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.open("https://meet.google.com/new", "_blank");
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-sm transition shrink-0"
                  >
                    <Video size={12} />
                    <span>Create Meet as Host</span>
                    <ExternalLink size={11} />
                  </button>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="url"
                    placeholder="Paste your Google Meet link here (or leave blank to auto-generate)"
                    className="form-input w-full text-xs !h-10 !rounded-xl pr-20"
                    value={form.meetingLink}
                    onChange={(e) => update("meetingLink", e.target.value)}
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      title="Paste link from clipboard"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text && (text.includes("meet.google.com") || text.startsWith("http"))) {
                            update("meetingLink", text.trim());
                          }
                        } catch (err) {
                          console.warn("Clipboard access denied", err);
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      Paste
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback or Notes Textarea */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isRejected
                  ? "Constructive Feedback / Reason (Visible to candidate) *"
                  : isInterview
                  ? "Interview Preparation Agenda / Notes"
                  : "Onboarding Instructions / Offer Message"}
              </label>

              <button
                type="button"
                disabled={generatingAi}
                onClick={handleAiDraft}
                className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-cyan-400 disabled:opacity-50"
              >
                <Sparkles size={12} />
                <span>{generatingAi ? "Writing note..." : "AI Auto-Draft"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              required={isRejected}
              className="form-input w-full text-xs !rounded-xl"
              placeholder={
                isRejected
                  ? "e.g. Strong foundation in JavaScript, but we are looking for more senior experience with distributed systems..."
                  : isInterview
                  ? "e.g. Please be ready to discuss your recent React and Node.js projects and architecture choices."
                  : "e.g. Congratulations! We would love to welcome you to our engineering team."
              }
              value={form.feedback}
              onChange={(e) => update("feedback", e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {modal.app?.interviewDetails?.date && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onSubmit({
                        ...form,
                        targetStatus: modal.targetStatus,
                        interviewDetails: { ...form, status: "completed" },
                        app: modal.app,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    title="Mark this interview session as completed"
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Completed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to cancel and delete this scheduled meeting?")) {
                        onSubmit({
                          ...form,
                          targetStatus: "shortlisted",
                          interviewDetails: { deleteMeeting: true },
                          app: modal.app,
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                    title="Cancel and remove meeting"
                  >
                    <Trash2 size={13} />
                    <span>Delete Meeting</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary !h-10 px-4 text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`btn-primary !h-10 px-5 text-xs ${
                  isRejected ? "!bg-rose-600 hover:!bg-rose-700 text-white" : ""
                }`}
              >
                {isPending
                  ? "Saving..."
                  : isRejected
                  ? "Confirm Rejection"
                  : isInterview
                  ? "Schedule & Notify"
                  : "Confirm Hiring"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusDecisionModal;
