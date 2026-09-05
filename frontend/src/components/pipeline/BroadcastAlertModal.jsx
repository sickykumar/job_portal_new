import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Send,
  X,
  Users,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Mail,
  Building2,
  Briefcase,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import api from "../../services/api";

/**
 * BroadcastAlertModal Component
 * Allows recruiters to broadcast instant hiring alerts and email digests
 * to all candidates whose profiles match 1-3 skills of the position.
 */
const BroadcastAlertModal = ({ job, onClose, onSuccess }) => {
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [minMatch, setMinMatch] = useState(1); // 1: wide reach, 2: strong fit
  const [customMessage, setCustomMessage] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [error, setError] = useState("");

  const handleEnhanceWithAI = async () => {
    try {
      setIsEnhancing(true);
      const res = await api.post("/ai/enhance-broadcast", {
        roleTitle: job?.title,
        requirements: job?.requirements || [],
        companyName: previewData?.companyName || job?.company?.companyName || "Our Hiring Team",
        currentMessage: customMessage.trim(),
      });
      if (res.data?.success && res.data.enhancedMessage) {
        setCustomMessage(res.data.enhancedMessage);
      }
    } catch (err) {
      console.error("AI enhancement error:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoadingPreview(true);
        setError("");
        const res = await api.get(`/job/broadcast-preview/${job._id}`);
        if (res.data?.success) {
          setPreviewData(res.data);
          // If strong matches exist, default to 2 skills matched, else 1
          if (res.data.strongMatches > 0) {
            setMinMatch(2);
          } else {
            setMinMatch(1);
          }
        }
      } catch (err) {
        console.error("Broadcast preview error:", err);
        setError(err.response?.data?.message || err.message || "Failed to analyze matching candidates.");
      } finally {
        setLoadingPreview(false);
      }
    };

    if (job?._id) {
      fetchPreview();
    }
  }, [job?._id]);

  const targetCount =
    minMatch === 2
      ? previewData?.strongMatches || 0
      : previewData?.totalMatching || 0;

  const handleSendBroadcast = async () => {
    try {
      setIsBroadcasting(true);
      setError("");

      const res = await api.post(`/job/broadcast/${job._id}`, {
        customMessage: customMessage.trim(),
        minMatch,
      });

      if (res.data?.success) {
        setBroadcastResult(res.data);
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to broadcast alert.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Broadcast Hiring Alert</span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                  Direct Blast
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly notify candidates with matching skills via email & alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Target Role Pill */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              TARGET POSITION
            </p>
            <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {job?.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {(job?.requirements || []).map((req, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {loadingPreview ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Scanning database for candidates matching 1-3 skills...
              </p>
            </div>
          ) : broadcastResult ? (
            // Success Screen
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Alert Broadcasted Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {broadcastResult.message ||
                  `Email alerts & in-app notifications have been queued for ${broadcastResult.sentCount} candidates.`}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary mt-4 text-xs font-bold px-6 py-2.5 cursor-pointer"
              >
                Done & Return to Pipeline
              </button>
            </div>
          ) : (
            <>
              {/* Match Criteria Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Target Candidate Match Threshold:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMinMatch(2)}
                    className={`flex flex-col items-start rounded-2xl border p-3 text-left transition cursor-pointer ${
                      minMatch === 2
                        ? "border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/40"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        2+ Skills Matched
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.2 text-[9px] font-bold text-emerald-500">
                        Recommended
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Strong technical alignment ({previewData?.strongMatches || 0} candidates)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMinMatch(1)}
                    className={`flex flex-col items-start rounded-2xl border p-3 text-left transition cursor-pointer ${
                      minMatch === 1
                        ? "border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-500/20 dark:border-cyan-400 dark:bg-cyan-950/40"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        1+ Skill Matched
                      </span>
                      <span className="rounded-full bg-cyan-500/10 px-2 py-0.2 text-[9px] font-bold text-cyan-500">
                        Broad Reach
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Wider pool of active job seekers ({previewData?.totalMatching || 0} candidates)
                    </p>
                  </button>
                </div>
              </div>

              {/* Sample Matching Candidates Snippet */}
              {previewData?.sampleCandidates?.length > 0 && (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 dark:border-indigo-500/20 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-900 dark:text-cyan-300 flex items-center gap-1.5">
                      <Users size={13} />
                      Sample Matching Candidates Ready to Receive Alert:
                    </span>
                    <span className="font-black text-indigo-600 dark:text-cyan-400">
                      {targetCount} Total
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {previewData.sampleCandidates.map((cand, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
                      >
                        <span className="font-bold">{cand.name}</span>
                        {cand.matchedSkills?.length > 0 && (
                          <span className="text-[10px] text-indigo-500 dark:text-cyan-400">
                            ({cand.matchedSkills.join(", ")})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Recruiter Note with AI Enhancement */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    <span>Custom Message to Candidates (Optional):</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleEnhanceWithAI}
                    disabled={isEnhancing}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:border-indigo-400 dark:text-cyan-400 cursor-pointer disabled:opacity-50 transition shadow-sm"
                    title="Enhance draft or generate outreach note with AI"
                  >
                    <Sparkles size={12} className={isEnhancing ? "animate-spin text-cyan-400" : "text-cyan-500"} />
                    <span>{isEnhancing ? "Enhancing with AI..." : "Enhance with AI ✨"}</span>
                  </button>
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g., We have an urgent requirement with fast-tracked technical interviews this week. Immediate joiners or candidates on 15-day notice preferred!"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              {/* Delivery Overview Alert */}
              <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Mail size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <p className="leading-relaxed">
                  Clicking broadcast will send a <strong>branded email notification</strong> and an <strong>in-app bell alert</strong> with a direct 1-click apply button to all <strong>{targetCount} candidates</strong>.
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        {!broadcastResult && !loadingPreview && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isBroadcasting || targetCount === 0}
              onClick={handleSendBroadcast}
              className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 disabled:opacity-50 cursor-pointer"
            >
              {isBroadcasting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-200" />
                  <span>Broadcasting Alerts...</span>
                </>
              ) : (
                <>
                  <Send size={13} className="text-cyan-200 group-hover:translate-x-0.5 transition-transform" />
                  <span>Send Broadcast Alert ({targetCount})</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BroadcastAlertModal;
