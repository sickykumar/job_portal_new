import React from "react";
import { Bell, BellOff, Trash2, MapPin, Briefcase, Tag, Calendar, Zap } from "lucide-react";

/**
 * Standalone JobAlertCard Component
 * Displays an individual alert subscription with live toggle and delete controls.
 */
const JobAlertCard = ({ alert, onToggle, onDelete }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-5 transition-all backdrop-blur-xl ${
        alert.isActive
          ? "border-slate-200/90 bg-white/80 shadow-md dark:border-slate-800/80 dark:bg-slate-900/80"
          : "border-slate-200/50 bg-slate-50/50 opacity-70 dark:border-slate-800/50 dark:bg-slate-950/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                alert.isActive
                  ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              }`}
            >
              {alert.isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {alert.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {alert.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {alert.jobType}
                </span>
                <span>•</span>
                <span className="capitalize font-semibold text-indigo-500 dark:text-indigo-400">
                  {alert.frequency} Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Keywords Pills */}
          {alert.keywords && alert.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {alert.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Controls & Statistics */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0 dark:border-slate-800">
          {/* Matches Counter */}
          <div className="text-right">
            <span className="block text-xs font-black text-slate-900 dark:text-white">
              {alert.matchesCount || 0} Matches
            </span>
            <span className="text-[10px] text-slate-400">
              {alert.lastAlertSentAt
                ? `Last sent: ${new Date(alert.lastAlertSentAt).toLocaleDateString()}`
                : "No matches yet"}
            </span>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => onToggle(alert._id)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              alert.isActive ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                alert.isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(alert._id)}
            title="Delete Alert"
            className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobAlertCard;
