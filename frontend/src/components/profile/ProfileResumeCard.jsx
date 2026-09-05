import React, { useState } from "react";
import { FileText, Upload, Trash2, CheckCircle2 } from "lucide-react";

/**
 * ProfileResumeCard Component
 * Drag-and-drop resume file uploader and active resume viewer for job applicants.
 */
const ProfileResumeCard = ({
  userResume,
  resumeOriginalName,
  resumeFile,
  removeResume,
  onFileSelect,
  onRemoveResume,
  onCancelRemoveResume,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Resume & CV Document
      </h3>

      {/* Existing Linked Resume */}
      {userResume && !removeResume && !resumeFile && (
        <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950">
              <FileText size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                {resumeOriginalName || "Candidate_Resume.pdf"}
              </p>
              <a
                href={userResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
              >
                Preview Attached Resume ↗
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveResume}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        </div>
      )}

      {/* Remove Confirmation Alert */}
      {removeResume && !resumeFile && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          <span>Resume marked for removal upon saving.</span>
          <button
            type="button"
            onClick={onCancelRemoveResume}
            className="text-xs font-bold underline"
          >
            Undo
          </button>
        </div>
      )}

      {/* Selected New File Preview */}
      {resumeFile && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-emerald-900 dark:text-emerald-200">
                New file selected: {resumeFile.name}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="text-xs font-bold text-emerald-800 hover:underline dark:text-emerald-300"
          >
            Change
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragOver
            ? "border-indigo-500 bg-indigo-50/60 dark:border-cyan-400 dark:bg-cyan-500/10"
            : "border-slate-200 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-slate-700"
        }`}
      >
        <Upload size={28} className="mb-2 text-indigo-600 dark:text-cyan-400" />
        <p className="text-xs font-bold text-slate-800 dark:text-white">
          Drag and drop your updated resume here
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Supports PDF, DOC, DOCX files up to 10MB
        </p>

        <label className="mt-3 cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          Browse Files
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ProfileResumeCard;
