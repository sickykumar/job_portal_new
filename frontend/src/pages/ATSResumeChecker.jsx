import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Sparkles,
  Target,
  RefreshCw,
  AlertCircle,
  Briefcase,
  FileSearch,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ATSScoreGauge from "../components/ats/ATSScoreGauge";
import ATSKeywordPills from "../components/ats/ATSKeywordPills";
import ATSSectionChecklist from "../components/ats/ATSSectionChecklist";
import ATSBulletOptimizer from "../components/ats/ATSBulletOptimizer";

/**
 * Standalone ATSResumeChecker Page
 * Decoupled enterprise-grade ATS resume scanning and optimization suite.
 */
const ATSResumeChecker = () => {
  const { user } = useAuth();

  const [useProfileResume, setUseProfileResume] = useState(Boolean(user?.profile?.resume));
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [error, setError] = useState("");
  const [atsData, setAtsData] = useState(null);

  const hasProfileResume = Boolean(user?.profile?.resume);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Please select a valid PDF document (.pdf).");
        return;
      }
      setSelectedFile(file);
      setUseProfileResume(false);
      setError("");
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");

    if (!useProfileResume && !selectedFile) {
      setError("Please upload a PDF resume or select your saved profile resume.");
      return;
    }

    setLoading(true);
    setScanStep("Extracting document typography & raw text...");

    try {
      const formData = new FormData();
      formData.append("targetRole", targetRole);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      setTimeout(() => setScanStep("Cross-referencing technical skills & keyword taxonomy..."), 1000);
      setTimeout(() => setScanStep("Running enterprise ATS rubric & calculating scores..."), 2200);

      const res = await api.post("/ats/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data.data) {
        setAtsData(res.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to complete ATS scan. Please check that your PDF is not password protected and try again."
      );
    } finally {
      setLoading(false);
      setScanStep("");
    }
  };

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0">
      <div className="w-full space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Enterprise ATS Resume Checker
              </h1>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
                STAR Optimizer
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audit your resume score, detect missing keywords, and optimize bullet points instantly
            </p>
          </div>
        </div>

        {/* Input & Upload Panel */}
        <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <form onSubmit={handleScan} className="space-y-6">
            
            {/* Target Role & Optional JD */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Role / Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer, DevOps Engineer"
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  className="inline-flex h-11 items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-4 text-xs font-bold text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    {showJdInput ? "Hide Specific Job Description" : "+ Add Specific Job Description (Optional)"}
                  </span>
                  <span className="text-[10px] text-slate-400">Tailored Match</span>
                </button>
              </div>
            </div>

            {/* Optional Specific Job Description Field */}
            {showJdInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Paste Specific Job Description
                </label>
                <textarea
                  rows="3"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description requirements here to benchmark against this exact job posting..."
                  className="w-full rounded-2xl border border-slate-200 bg-white/70 p-3.5 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white resize-none"
                />
              </motion.div>
            )}

            {/* Resume Source Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Resume for Audit
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Option 1: Saved Profile Resume */}
                {hasProfileResume && (
                  <div
                    onClick={() => {
                      setUseProfileResume(true);
                      setSelectedFile(null);
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      useProfileResume
                        ? "border-indigo-500 bg-indigo-500/[0.05] ring-2 ring-indigo-500/20 dark:border-indigo-400"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.profile?.resumeOriginalname || "Saved Profile Resume.pdf"}
                        </p>
                        <p className="text-[11px] text-slate-400">Attached to your active account</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Option 2: Upload Fresh File */}
                <div
                  className={`relative rounded-2xl border p-4 transition ${
                    !useProfileResume && selectedFile
                      ? "border-cyan-500 bg-cyan-500/[0.05] ring-2 ring-cyan-500/20 dark:border-cyan-400"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    id="ats-file-upload"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {selectedFile ? selectedFile.name : "Upload Fresh PDF Resume"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : "Click or drag & drop .pdf"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-3">
              <div className="relative group w-full sm:w-auto">
                {/* Ambient Glow Aura */}
                <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl animate-pulse" />

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative flex h-14 w-full sm:min-w-[360px] items-center justify-center gap-3 overflow-hidden rounded-[22px] border border-white/30 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 text-sm sm:text-base font-black tracking-wide text-white shadow-[0_15px_45px_rgba(79,70,229,.45)] transition-all duration-300 hover:shadow-[0_20px_55px_rgba(6,182,212,.55)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {/* Shimmer Light-Sweep Reflection */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full pointer-events-none" />

                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin text-cyan-200" />
                      <span className="truncate">{scanStep || "Scanning Resume..."}</span>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner text-cyan-200 group-hover:scale-110 transition-transform">
                        <Zap className="h-4 w-4 fill-cyan-300" />
                      </div>
                      <span className="drop-shadow-sm">Scan Resume with ATS Engine</span>
                      <ArrowRight className="h-4 w-4 text-cyan-200 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>

        {/* Audit Results Presentation */}
        <AnimatePresence>
          {atsData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Score Gauge & Pillar Breakdown */}
              <ATSScoreGauge
                score={atsData.overallScore}
                status={atsData.status}
                metrics={atsData.metrics}
              />

              {/* Matched vs Missing Keywords */}
              <ATSKeywordPills
                matched={atsData.matchedKeywords}
                missing={atsData.missingKeywords}
              />

              {/* Detailed Strengths & Critical Gaps Checklist */}
              <ATSSectionChecklist
                strengths={atsData.strengths}
                criticalGaps={atsData.criticalGaps}
                formattingCritique={atsData.formattingCritique}
                recommendations={atsData.recommendations}
              />

              {/* Standalone Interactive Bullet Optimizer */}
              <ATSBulletOptimizer targetRole={atsData.targetRole || targetRole} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ATSResumeChecker;
