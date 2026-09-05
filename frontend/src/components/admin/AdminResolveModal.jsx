import React, { useState } from "react";
import { X, Send, CheckCircle2, AlertCircle, Clock, Mail, User, Tag } from "lucide-react";
import api from "../../services/api";

const AdminResolveModal = ({ ticket, isOpen, onClose, onResolved }) => {
  const [status, setStatus] = useState("resolved");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim() || resolutionNotes.trim().length < 5) {
      setError("Please write a resolution note with at least 5 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await api.put(`/admin/tickets/${ticket._id}/resolve`, {
        status,
        resolutionNotes: resolutionNotes.trim(),
      });

      if (res.data?.success) {
        onResolved(res.data.ticket);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-colors dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Resolve Support Ticket
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ticket ID: <span className="font-mono font-semibold text-cyan-500">{ticket.ticketId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Ticket Details summary */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800/80 dark:bg-slate-950/60 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <User className="h-3.5 w-3.5 text-indigo-500" />
              <span className="font-semibold">{ticket.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Mail className="h-3.5 w-3.5 text-cyan-500" />
              <span>{ticket.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Tag className="h-3.5 w-3.5 text-amber-500" />
              <span className="capitalize">{ticket.category?.replace(/_/g, " ")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Subject: </span>
            <span className="text-slate-600 dark:text-slate-400">{ticket.subject}</span>
          </div>

          <div className="pt-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">User's Message: </span>
            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-2.5 text-slate-700 border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              {ticket.message}
            </p>
          </div>
        </div>

        {/* Existing Resolution if any */}
        {ticket.resolutionNotes && (
          <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Previous Resolution: </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {ticket.resolutionNotes}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 border border-red-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Update Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "resolved", label: "Resolved (Done)", color: "border-emerald-500 text-emerald-600 dark:text-emerald-400" },
                { id: "in_progress", label: "In Progress", color: "border-blue-500 text-blue-600 dark:text-blue-400" },
                { id: "closed", label: "Closed", color: "border-slate-500 text-slate-600 dark:text-slate-400" },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    status === s.id
                      ? `${s.color} bg-emerald-500/10 dark:bg-emerald-500/20 ring-2 ring-emerald-500/30`
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Official Resolution Notes & Reply to User <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Explain the resolution or answer in detail. This message will be recorded in the database and automatically emailed to the candidate..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              required
            />
            <p className="mt-1 text-[11px] text-slate-500">
              💡 When you submit, an automated resolution email with this note will immediately be sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.email}</span>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sending Resolution...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Resolution & Update Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminResolveModal;
