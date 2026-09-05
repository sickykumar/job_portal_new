import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Columns3, List, Sparkles, X, Users, MapPin, IndianRupee, Radio, Archive, RotateCcw, Trash2 } from "lucide-react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { formatIndianSalary } from "../../utils/indianFormat";
import PipelineKanban from "./PipelineKanban";
import PipelineList from "./PipelineList";
import BulkActionBar from "./BulkActionBar";
import StatusDecisionModal from "./StatusDecisionModal";
import BroadcastAlertModal from "./BroadcastAlertModal";

const PipelineModal = ({ job, highlightApplicantId, onClose }) => {
  if (!job) return null;

  const toast = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState("kanban");
  const [selectedIds, setSelectedIds] = useState([]);
  const [modal, setModal] = useState(null);
  const [scores, setScores] = useState({});
  const [isScoringAi, setIsScoringAi] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(job.status || "published");

  // Recruiter Archive/Reactivate Mutation
  const archiveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/job/${job._id}/archive`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-stats"] });
      queryClient.invalidateQueries({ queryKey: ["automation-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["appliedJobs"] });
      setCurrentStatus(data.job?.status || (currentStatus === "archived" ? "published" : "archived"));
      toast.success(data.message || "Position archive status updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update archive status");
    },
  });

  // Recruiter Delete Position Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/job/${job._id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-stats"] });
      queryClient.invalidateQueries({ queryKey: ["automation-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["appliedJobs"] });
      onClose();
      toast.success("Position deleted successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete position");
    },
  });

  const handleDeleteJob = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${job.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  // Lock background scroll and hide scrollbar while pipeline is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  // Close on Escape key press if sub-modal is not open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !modal) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, onClose]);

  // Fetch applicants for the selected job
  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["applicants", job._id],
    queryFn: async () => {
      const { data } = await api.get(`/application/applicants/${job._id}`);
      return data?.job?.applications || [];
    },
    enabled: !!job._id,
  });

  // Calculate stage counts for header pill badges
  const stageCounts = {
    pending: applicants.filter((a) => !a.status || a.status === "pending").length,
    shortlisted: applicants.filter((a) => a.status === "shortlisted").length,
    interview: applicants.filter((a) => a.status === "interview").length,
    hired: applicants.filter((a) => a.status === "hired" || a.status === "accepted").length,
  };

  // AI Candidate Ranking
  useEffect(() => {
    if (!job || !applicants.length) return;

    setIsScoringAi(true);
    setScores({});

    api
      .post("/ai/rank-candidates", {
        jobId: job._id,
        candidates: applicants.map((a) => ({
          applicantId: a._id,
          skills: a.applicant?.profile?.skills || [],
        })),
      })
      .then(({ data }) => {
        if (data?.success && data.rankings) {
          const map = {};
          data.rankings.forEach((r) => {
            map[r.applicantId] = r;
          });
          setScores(map);
        }
      })
      .catch((err) => console.warn("AI ranking error:", err))
      .finally(() => setIsScoringAi(false));
  }, [job?._id, applicants.length]);

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status, payload = {} }) =>
      api.post(`/application/status/${id}/update`, {
        status,
        ...payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants", job._id] });
      setModal(null);
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Failed to update status");
    },
  });

  // Bulk status mutation
  const bulkMutation = useMutation({
    mutationFn: (status) =>
      api.post("/application/bulk-status", {
        applicationIds: selectedIds,
        status,
      }),
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["applicants", job._id] });
      toast.success("Selected candidates updated successfully!");
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Bulk update failed");
    },
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(
      selectedIds.length === applicants.length ? [] : applicants.map((a) => a._id)
    );
  };

  const handleDownloadResume = async (appId, candidateName) => {
    try {
      const res = await api.get(`/application/download-resume/${appId}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], {
          type: res.headers["content-type"] || "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(candidateName || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.warning("Failed to download resume. The candidate may not have uploaded one yet.");
    }
  };

  const handleOpenStatusModal = (app, status) => {
    setModal({
      app,
      targetStatus: status,
      feedback: app.feedback || "",
      date: app.interviewDetails?.date || "",
      time: app.interviewDetails?.time || "",
      meetingLink: app.interviewDetails?.meetingLink || "",
      notes: app.interviewDetails?.notes || "",
    });
  };

  const handleModalSubmit = async (modalData) => {
    const { app, targetStatus, feedback, date, time, meetingLink, notes } = modalData;

    // Automated Google Calendar & Video Meeting Scheduling
    if (targetStatus === "interview") {
      try {
        await api.post("/interview/schedule", {
          applicationId: app._id,
          date,
          time,
          notes: notes || feedback,
          customMeetingLink: meetingLink || null,
        });
        queryClient.invalidateQueries({ queryKey: ["applicants", job._id] });
        setModal(null);
        return;
      } catch (err) {
        console.warn("Automated calendar schedule fallback:", err.message);
      }
    }

    const payload = { feedback };
    if (targetStatus === "interview" || date || meetingLink) {
      payload.interviewDetails = { date, time, meetingLink, notes };
    }

    statusMutation.mutate({
      id: app._id,
      status: targetStatus,
      payload,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md no-scrollbar">
      <div className="flex h-[92vh] w-full max-w-[1520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 no-scrollbar">
        {/* Pipeline Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:px-6 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl truncate">
                {job.title}
              </h2>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-extrabold text-indigo-600 dark:bg-indigo-500/15 dark:text-cyan-400">
                {job.company?.companyName || "Company"}
              </span>

              {job.salary && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {formatIndianSalary(job.salary)}
                </span>
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
              <span>{applicants.length} Total Applicants</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{stageCounts.pending} Pending</span>
              <span>•</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">{stageCounts.shortlisted} Shortlisted</span>
              <span>•</span>
              <span className="text-violet-600 dark:text-violet-400 font-bold">{stageCounts.interview} Interviews</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stageCounts.hired} Hired</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isScoringAi && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-xl">
                <Sparkles size={13} className="animate-spin" />
                <span>AI Scoring Applicants...</span>
              </span>
            )}

            {/* Direct Recruiter Broadcast Alert Button */}
            <button
              type="button"
              onClick={() => setBroadcastOpen(true)}
              className="group relative inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-cyan-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-cyan-500/10 dark:text-cyan-300 cursor-pointer"
              title="Broadcast alert to matching candidates"
            >
              <Radio size={14} className="text-cyan-500 animate-pulse" />
              <span>Broadcast Alert 📢</span>
            </button>

            {/* Archive / Reactivate Position Button */}
            <button
              type="button"
              disabled={archiveMutation.isPending}
              onClick={() => archiveMutation.mutate()}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
                currentStatus === "archived"
                  ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-cyan-300 dark:border-cyan-500/30"
                  : "border-amber-500/30 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
              }`}
              title={currentStatus === "archived" ? "Reactivate job to accept applications" : "Archive job to stop accepting applications"}
            >
              {currentStatus === "archived" ? (
                <>
                  <RotateCcw size={13} className={archiveMutation.isPending ? "animate-spin" : ""} />
                  <span>Reactivate Position</span>
                </>
              ) : (
                <>
                  <Archive size={13} className={archiveMutation.isPending ? "animate-spin" : ""} />
                  <span>Archive Position</span>
                </>
              )}
            </button>

            {/* Delete Position Button */}
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={handleDeleteJob}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-all shadow-sm cursor-pointer"
              title="Delete this position permanently"
            >
              <Trash2 size={13} className={deleteMutation.isPending ? "animate-spin" : ""} />
              <span>Delete</span>
            </button>

            {/* View Switcher (Kanban / List) */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setView("kanban")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  view === "kanban"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Columns3 size={14} />
                <span>Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  view === "list"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <List size={14} />
                <span>List</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              title="Close Pipeline (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Pipeline Body Area without visible right scrollbar */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 bg-slate-50/50 dark:bg-slate-950/50 no-scrollbar">
          {isLoading ? (
            <div className="py-24 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-cyan-400" />
              <span>Loading pipeline & candidates...</span>
            </div>
          ) : !applicants.length ? (
            <div className="py-24 text-center">
              <Users className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={42} />
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                No candidates have applied to this position yet.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Applications will appear here in real-time as job seekers submit their profiles.
              </p>
            </div>
          ) : view === "kanban" ? (
            <PipelineKanban
              applicants={applicants}
              scores={scores}
              selectedIds={selectedIds}
              highlightApplicantId={highlightApplicantId}
              onToggleSelect={toggleSelect}
              onOpenModal={handleOpenStatusModal}
              onDownloadResume={handleDownloadResume}
            />
          ) : (
            <PipelineList
              applicants={applicants}
              scores={scores}
              selectedIds={selectedIds}
              highlightApplicantId={highlightApplicantId}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onOpenModal={handleOpenStatusModal}
              onDownloadResume={handleDownloadResume}
            />
          )}
        </div>

        {/* Bulk Action Toolbar */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          isPending={bulkMutation.isPending}
          onBulkAction={(status) => bulkMutation.mutate(status)}
          onCancel={() => setSelectedIds([])}
        />

        {/* Status / Interview Schedule / Decision Modal */}
        <StatusDecisionModal
          modal={modal}
          job={job}
          onClose={() => setModal(null)}
          onSubmit={handleModalSubmit}
          isPending={statusMutation.isPending}
        />

        {/* Recruiter Candidate Broadcast Alert Modal */}
        {broadcastOpen && (
          <BroadcastAlertModal
            job={job}
            onClose={() => setBroadcastOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PipelineModal;
