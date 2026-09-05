import React from "react";
import { Users, X } from "lucide-react";

const BulkActionBar = ({ selectedCount, isPending, onBulkAction, onCancel }) => {
  if (!selectedCount) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
          <Users size={15} />
        </div>
        <span className="text-xs font-bold text-slate-800 dark:text-white">
          {selectedCount} Candidate{selectedCount > 1 ? "s" : ""} Selected
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onBulkAction("shortlisted")}
          className="rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 hover:bg-cyan-100 dark:border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300 disabled:opacity-50"
        >
          Bulk Shortlist
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onBulkAction("interview")}
          className="rounded-xl border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300 disabled:opacity-50"
        >
          Move to Interview
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onBulkAction("rejected")}
          className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300 disabled:opacity-50"
        >
          Bulk Reject
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <X size={14} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
