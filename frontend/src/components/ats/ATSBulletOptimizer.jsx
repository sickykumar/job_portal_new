import React, { useState } from "react";
import { Sparkles, Copy, Check, Wand2 } from "lucide-react";
import api from "../../services/api";

/**
 * Standalone ATSBulletOptimizer Component
 * Interactive tool rewriting weak bullet points into high-impact Google XYZ / STAR format.
 */
const ATSBulletOptimizer = ({ targetRole = "Software Engineer" }) => {
  const [bulletPoint, setBulletPoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [error, setError] = useState("");

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!bulletPoint.trim() || bulletPoint.length < 10) {
      setError("Please enter a bullet point with at least 10 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ats/optimize-bullet", {
        bulletPoint,
        targetRole,
      });

      if (res.data?.success && res.data.variations) {
        setVariations(res.data.variations);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to optimize bullet point. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Resume Bullet Point Optimizer
            </h3>
            <p className="text-[11px] text-slate-400">
              Transform weak responsibilities into high-impact STAR / Google XYZ achievements.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleOptimize} className="space-y-3">
        <div className="relative">
          <textarea
            rows="2"
            value={bulletPoint}
            onChange={(e) => setBulletPoint(e.target.value)}
            placeholder="e.g. Worked on frontend bugs and helped team release new dashboard features."
            className="w-full rounded-2xl border border-slate-200 bg-white/70 p-3.5 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white resize-none"
          />
        </div>

        {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 disabled:opacity-60 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {loading ? "Optimizing Bullet..." : "Optimize with AI"}
          </button>
        </div>
      </form>

      {/* Generated Variations */}
      {variations.length > 0 && (
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ATS-Optimized Variations
          </h4>

          {variations.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition hover:border-indigo-500/40 hover:bg-indigo-500/[0.02] dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-indigo-500/30"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {item.style || "STAR Formulation"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(item.text, idx)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                • {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSBulletOptimizer;
