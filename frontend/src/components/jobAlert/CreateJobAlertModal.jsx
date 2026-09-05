import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Bell, Plus, Tag, MapPin, Briefcase, Sparkles } from "lucide-react";
import api from "../../services/api";

/**
 * Standalone CreateJobAlertModal Component
 * Interactive dialog to configure custom automated job alert subscriptions.
 */
const CreateJobAlertModal = ({ isOpen, onClose, onCreated, suggestedSkills = [] }) => {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [location, setLocation] = useState("Remote");
  const [jobType, setJobType] = useState("All");
  const [frequency, setFrequency] = useState("instant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAddTag = (tag) => {
    const clean = tag.trim();
    if (clean && !keywords.includes(clean)) {
      setKeywords([...keywords, clean]);
      setTagInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setKeywords(keywords.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide an alert title.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/job-alert/create", {
        title: title.trim(),
        keywords,
        location,
        jobType,
        frequency,
      });

      if (res.data?.success) {
        if (onCreated) onCreated(res.data.alert);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Create Automated Job Alert
            </h3>
            <p className="text-xs text-slate-400">
              Receive direct email notifications when matching positions are posted.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Alert Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Alert Title / Target Role
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior React Developer, Cloud Engineer"
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white"
            />
          </div>

          {/* Keywords / Skills Tag Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Target Skills & Keywords (Press Enter)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type skill & press Enter (e.g. React, Node.js, AWS)"
                className="flex-1 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {/* Keyword Pills */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                >
                  <Tag className="h-3 w-3 text-indigo-500" />
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(i)}
                    className="ml-1 text-indigo-400 hover:text-indigo-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Suggested Skills Pill Shortcuts */}
            {suggestedSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" /> Quick Add:
                </span>
                {suggestedSkills.slice(0, 5).map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleAddTag(s)}
                    className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    +{s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location & Job Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/70 p-2.5 text-xs font-semibold text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-950/70 dark:text-white"
              >
                <option value="Remote">Remote</option>
                <option value="Any Location">Any Location</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/70 p-2.5 text-xs font-semibold text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-950/70 dark:text-white"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Notification Frequency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Notification Delivery
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition ${
                  frequency === "instant"
                    ? "border-indigo-500 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300"
                    : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="instant"
                  checked={frequency === "instant"}
                  onChange={() => setFrequency("instant")}
                  className="accent-indigo-600"
                />
                <span className="text-xs font-bold">Instant (Real-time)</span>
              </label>

              <label
                className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition ${
                  frequency === "daily"
                    ? "border-indigo-500 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300"
                    : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={frequency === "daily"}
                  onChange={() => setFrequency("daily")}
                  className="accent-indigo-600"
                />
                <span className="text-xs font-bold">Daily Digest</span>
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Creating Alert..." : "Activate Job Alert"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateJobAlertModal;
