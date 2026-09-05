import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ExternalLink,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

/**
 * CandidateResumeCard Component
 * Displays the candidate's active Resume PDF on the Candidate Dashboard.
 * Allows viewing, downloading, or one-click updating/replacing directly from the dashboard.
 */
const CandidateResumeCard = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", err: "" });

  const resumeUrl = user?.profile?.resume;
  const resumeName = user?.profile?.resumeOriginalname || "Candidate_Resume.pdf";
  const [actionLoading, setActionLoading] = useState(null); // 'preview' | 'download' | null

  // Native In-Browser PDF Preview
  const handlePreview = async () => {
    setActionLoading("preview");
    try {
      const res = await api.get("/user/resume/download?view=true", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 30000);
    } catch (err) {
      console.error("Preview failed, falling back to direct URL:", err);
      window.open(resumeUrl, "_blank");
    } finally {
      setActionLoading(null);
    }
  };

  // Same-Origin Named PDF Download
  const handleDownload = async () => {
    setActionLoading("download");
    try {
      const res = await api.get("/user/resume/download", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      let finalName = resumeName || "Candidate_Resume.pdf";
      if (!finalName.toLowerCase().endsWith(".pdf")) {
        finalName += ".pdf";
      }

      link.setAttribute("download", finalName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      console.error("Download failed, falling back to direct URL:", err);
      window.open(resumeUrl, "_blank");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      setFeedback({ msg: "", err: "Please select a valid PDF or DOCX file." });
      return;
    }

    setUploading(true);
    setFeedback({ msg: "", err: "" });

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file); // multer singleUpload captures this

      const { data } = await api.post("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.success) {
        updateUser(data.user);
        setFeedback({ msg: "Resume updated successfully!", err: "" });
        setTimeout(() => setFeedback({ msg: "", err: "" }), 4000);
      }
    } catch (err) {
      setFeedback({
        msg: "",
        err: err.response?.data?.message || "Failed to upload resume.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!window.confirm("Are you sure you want to remove your resume?")) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("removeResume", "true");

      const { data } = await api.post("/user/profile/update", formData);
      if (data?.success) {
        updateUser(data.user);
        setFeedback({ msg: "Resume removed.", err: "" });
        setTimeout(() => setFeedback({ msg: "", err: "" }), 3000);
      }
    } catch {
      setFeedback({ msg: "", err: "Failed to remove resume." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 sm:p-5 w-full min-w-0"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Active Resume PDF
            </h2>
            {resumeUrl && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <ShieldCheck size={12} />
                <span>Active & Verified</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This resume is automatically used when applying to open roles and for AI match scoring.
          </p>
        </div>

        {/* Upload New Version Button */}
        <label className="btn-secondary self-start sm:self-auto cursor-pointer text-xs shrink-0">
          <Upload size={13} className={uploading ? "animate-spin" : ""} />
          <span>{uploading ? "Uploading..." : resumeUrl ? "Replace Resume" : "Upload Resume PDF"}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Feedback alerts */}
      {feedback.msg && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 size={15} />
          <span>{feedback.msg}</span>
        </div>
      )}
      {feedback.err && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertCircle size={15} />
          <span>{feedback.err}</span>
        </div>
      )}

      {/* If Resume Exists */}
      {resumeUrl ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20">
              <FileText size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white" title={resumeName}>
                {resumeName}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">PDF Document</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles size={12} className="text-indigo-500 dark:text-cyan-400" />
                  <span>AI Match Ready</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePreview}
              disabled={actionLoading !== null}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              <ExternalLink size={13} className={actionLoading === "preview" ? "animate-spin" : ""} />
              <span>{actionLoading === "preview" ? "Opening..." : "Preview"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={actionLoading !== null}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-300 disabled:opacity-50"
            >
              <Download size={13} className={actionLoading === "download" ? "animate-spin" : ""} />
              <span>{actionLoading === "download" ? "Downloading..." : "Download"}</span>
            </button>

            <button
              type="button"
              onClick={handleRemoveResume}
              disabled={uploading}
              className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
              title="Remove Resume"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center cursor-pointer hover:border-indigo-500 dark:border-slate-800 dark:hover:border-slate-700 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400 mb-2">
            <Upload size={22} />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Resume PDF Uploaded Yet
          </p>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Click here to upload your resume (PDF or DOCX). Recruiters will be able to review your full background and projects.
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </motion.div>
  );
};

export default CandidateResumeCard;
