import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldAlert,
  Calendar,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";

const AdminAutomationTab = () => {
  const queryClient = useQueryClient();
  const [queueStatusFilter, setQueueStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // 1. Fetch Automation Overview
  const { data: overviewData, isLoading: loadingOverview, refetch: refetchOverview } = useQuery({
    queryKey: ["automation-overview"],
    queryFn: async () => {
      const res = await api.get("/automation/overview");
      return res.data?.success ? res.data.data : {};
    },
    refetchInterval: 15000, // Live poll every 15s
  });

  // 2. Fetch Automation Queue
  const { data: queueData, isLoading: loadingQueue, refetch: refetchQueue } = useQuery({
    queryKey: ["automation-queue", queueStatusFilter],
    queryFn: async () => {
      const res = await api.get("/automation/queue", {
        params: { status: queueStatusFilter, limit: 30 },
      });
      return res.data?.success ? res.data.tasks : [];
    },
    refetchInterval: 10000,
  });

  // 3. Fetch Flagged Jobs
  const { data: flaggedJobs = [], refetch: refetchFlagged } = useQuery({
    queryKey: ["automation-flagged-jobs"],
    queryFn: async () => {
      const res = await api.get("/automation/flagged-jobs");
      return res.data?.success ? res.data.jobs : [];
    },
  });

  // Retry Mutation
  const retryMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await api.post(`/automation/retry/${taskId}`);
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message || "Task enqueued for immediate retry!");
      queryClient.invalidateQueries({ queryKey: ["automation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["automation-overview"] });
    },
    onError: (err) => {
      showToast(err.response?.data?.message || "Failed to retry task");
    },
  });

  // Moderation Resolution Mutation
  const moderateMutation = useMutation({
    mutationFn: async ({ jobId, decision }) => {
      const res = await api.post(`/automation/resolve-flagged/${jobId}`, { decision });
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message || "Moderation updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["automation-flagged-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["automation-overview"] });
    },
  });

  // Gemini AI Full Sync & Expiry Audit Mutation
  const aiSyncMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/automation/ai-sync-all");
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message || "Gemini AI normalized jobs and audited expirations!");
      queryClient.invalidateQueries({ queryKey: ["automation-overview"] });
      queryClient.invalidateQueries({ queryKey: ["automation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["automation-flagged-jobs"] });
    },
    onError: (err) => {
      showToast(err.response?.data?.message || "Failed to execute Gemini AI sync");
    },
  });

  const metrics = overviewData?.metrics || {};
  const recentEvents = overviewData?.recentEvents || [];

  const statCards = [
    { label: "Active Jobs", value: metrics.activeJobs ?? "-", icon: Layers, color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30" },
    { label: "Applications Today", value: metrics.applicationsToday ?? "-", icon: CheckCircle2, color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
    { label: "AI Tasks Processed", value: metrics.aiJobsProcessed ?? "-", icon: Cpu, color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30" },
    { label: "Failed / Dead-Letter", value: metrics.failedJobs ?? "-", icon: AlertTriangle, color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30" },
    { label: "Pending Review", value: metrics.pendingJobs ?? "-", icon: Clock, color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30" },
    { label: "Upcoming Interviews", value: metrics.upcomingInterviews ?? "-", icon: Calendar, color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30" },
    { label: "Expired & Archived", value: metrics.expiredJobs ?? "-", icon: RotateCcw, color: "from-slate-500/20 to-gray-500/20 text-slate-400 border-slate-500/30" },
    { label: "Flagged for Moderation", value: metrics.flaggedJobs ?? "-", icon: ShieldAlert, color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="text-indigo-500" size={20} />
            <span>Autonomous Recruitment Engine & Health</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time event bus monitoring, background task execution, spam moderation, and automated worker health.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            disabled={aiSyncMutation.isPending}
            onClick={() => aiSyncMutation.mutate()}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400 hover:bg-indigo-500/20 transition disabled:opacity-50 shadow-sm"
          >
            <Sparkles size={13} className={aiSyncMutation.isPending ? "animate-spin text-cyan-300" : "text-cyan-400"} />
            <span>{aiSyncMutation.isPending ? "Gemini Syncing..." : "Run Gemini AI Sync"}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live 15s Auto-Sync</span>
          </div>
        </div>
      </div>

      {/* 8-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl border p-4 bg-gradient-to-br backdrop-blur-sm ${card.color} bg-white dark:bg-slate-900/60 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {card.label}
                </span>
                <Icon size={16} />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flagged Jobs Moderation Drawer (Only shows if flagged jobs exist) */}
      {flaggedJobs.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <ShieldAlert size={18} />
            <span>Spam & Fraud Review Queue ({flaggedJobs.length} Position(s) Flagged)</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {flaggedJobs.map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{job.title}</h4>
                    <p className="text-xs text-slate-500">{job.company?.companyName || "Employer"} • {job.location}</p>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {job.moderationStatus}
                  </span>
                </div>
                <div className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  <strong>Trigger:</strong> {job.moderationNotes || "Suspicious keywords or format"}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => moderateMutation.mutate({ jobId: job._id, decision: "safe" })}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 transition"
                  >
                    Approve (Safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => moderateMutation.mutate({ jobId: job._id, decision: "blocked" })}
                    className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 transition"
                  >
                    Confirm Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split: Queue Manager & Live Event Stream */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left 2 Cols: Background Task Queue */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Background Task Queue
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Self-healing asynchronous workers with exponential backoff & dead-letter queue.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["all", "pending", "processing", "completed", "failed"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setQueueStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase transition ${
                    queueStatusFilter === st
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Tasks Table */}
          {loadingQueue ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading background queue items...
            </div>
          ) : !queueData?.length ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No tasks currently matching "{queueStatusFilter}" in the automation queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase text-slate-400">
                    <th className="pb-2.5">Task Type</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Attempts</th>
                    <th className="pb-2.5">Scheduled / Run</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {queueData.map((task) => {
                    const isFailed = task.status === "failed";
                    const isCompleted = task.status === "completed";
                    const isProcessing = task.status === "processing";

                    return (
                      <tr key={task._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                        <td className="py-3 pr-2">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {task.jobType}
                          </div>
                          {task.error && (
                            <div className="text-[10px] text-rose-500 truncate max-w-xs font-mono mt-0.5">
                              {task.error}
                            </div>
                          )}
                        </td>

                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : isFailed
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                : isProcessing
                                ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 animate-pulse"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>

                        <td className="py-3 text-slate-500 font-mono text-[11px]">
                          {task.attempts}/{task.maxAttempts}
                        </td>

                        <td className="py-3 text-slate-400 text-[11px]">
                          {new Date(task.runAt || task.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="py-3 text-right">
                          {isFailed ? (
                            <button
                              type="button"
                              onClick={() => retryMutation.mutate(task._id)}
                              disabled={retryMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-cyan-300 transition"
                            >
                              <RotateCcw size={10} />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Real-time Event Stream Audit */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Event Audit Trail
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Observable platform events stream.
            </p>
          </div>

          {!recentEvents.length ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No recent events logged yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {recentEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase text-indigo-500 font-mono">
                      {evt.eventType}
                    </span>
                    <span className="text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 truncate">
                    Entity: <strong className="font-mono">{evt.entityType}:{evt.entityId?.slice(0, 8)}...</strong>
                  </div>
                  {evt.metadata?.title && (
                    <div className="text-[10px] text-slate-400 truncate">
                      "{evt.metadata.title}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAutomationTab;
