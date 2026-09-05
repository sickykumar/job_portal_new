import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Zap,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobAlertCard from "../components/jobAlert/JobAlertCard";
import CreateJobAlertModal from "../components/jobAlert/CreateJobAlertModal";

/**
 * Standalone JobAlerts Page
 * Decoupled candidate job alerts management center.
 */
const JobAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/job-alert/my");
      if (res.data?.success) {
        setAlerts(res.data.alerts || []);
      }
    } catch (err) {
      console.error("Failed to load job alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleToggle = async (id) => {
    try {
      // Optimistic update
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isActive: !a.isActive } : a))
      );

      await api.put(`/job-alert/toggle/${id}`);
    } catch (err) {
      // Rollback
      fetchAlerts();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job alert?")) return;

    try {
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      await api.delete(`/job-alert/${id}`);
      setMessage("Job alert removed.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      fetchAlerts();
    }
  };

  const handleCreated = (newAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    setMessage("Job alert created! You will receive email notifications when matching jobs are posted.");
    setTimeout(() => setMessage(""), 4000);
  };

  const activeCount = alerts.filter((a) => a.isActive).length;
  const totalMatches = alerts.reduce((acc, curr) => acc + (curr.matchesCount || 0), 0);

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0">
      <div className="w-full space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Automated Job Alerts
              </h1>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
                {activeCount} Active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant email delivery when matching job opportunities are published
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Alert</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/80">
            <span className="text-xs text-slate-400 font-medium">Total Alerts</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{alerts.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/80">
            <span className="text-xs text-emerald-500 font-medium">Active Subscriptions</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/80">
            <span className="text-xs text-indigo-400 font-medium">Delivered Matches</span>
            <p className="text-2xl font-black text-indigo-400 mt-1">{totalMatches}</p>
          </div>
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                <Inbox className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No active job alerts configured
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                Create custom alerts for your target job titles and skills to receive immediate email digests when matching roles are posted.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Set Up First Alert
              </button>
            </div>
          ) : (
            alerts.map((alert) => (
              <JobAlertCard
                key={alert._id}
                alert={alert}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Creation Modal */}
        <CreateJobAlertModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
          suggestedSkills={user?.profile?.skills || []}
        />
      </div>
    </div>
  );
};

export default JobAlerts;
