import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, FileText, CheckCircle2, Lock } from "lucide-react";

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [activeTab, setActiveTab] = useState("terms");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Platform Terms & Privacy Policy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  NexHire Global Employment Agreement
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "terms"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "privacy"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Privacy & Data Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recruiter")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "recruiter"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Recruiter Obligations
            </button>
          </div>

          {/* Content Area */}
          <div className="mt-4 max-h-[50vh] overflow-y-auto pr-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-3">
            {activeTab === "terms" && (
              <>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Acceptance of Platform Terms
                </h4>
                <p>
                  By creating an account or accessing the NexHire platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our recruitment services.
                </p>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. User Accounts & Authenticity
                </h4>
                <p>
                  All candidates and hiring teams must provide true, accurate, current, and complete registration details. Misrepresentation of identity, credentials, employment history, or company affiliations will result in permanent suspension.
                </p>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  3. Acceptable Usage & Anti-Spam
                </h4>
                <p>
                  Users shall not publish unauthorized commercial advertisements, distribute malware, scrape platform listings without permission, or harass any candidate or employer.
                </p>
              </>
            )}

            {activeTab === "privacy" && (
              <>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Personal Data Protection
                </h4>
                <p>
                  We treat candidate resumes, contact numbers, and identification records with bank-grade encryption. Your personal contact details are only shared with verified recruiters after you explicitly submit an application for an open position.
                </p>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Resume Visibility Controls
                </h4>
                <p>
                  Uploaded resumes are stored securely on Cloudinary CDN and accessed strictly via authenticated endpoints with verified recruiter authorizations.
                </p>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  3. Cookies & Session Security
                </h4>
                <p>
                  NexHire uses encrypted HTTP-only cookies and JSON Web Tokens for session verification, keeping your account safe from cross-site scripting (XSS) attacks.
                </p>
              </>
            )}

            {activeTab === "recruiter" && (
              <>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Mandatory KYC Verification
                </h4>
                <p>
                  All recruiting organizations and hiring managers must maintain valid government identification (Aadhaar / PAN) and verified business registrations to post job opportunities and contact applicants.
                </p>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Non-Discrimination Policy
                </h4>
                <p>
                  Employers agree to evaluate candidates strictly on technical competence, merit, and experience without discrimination based on gender, ethnicity, religion, or background.
                </p>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  3. Genuine Job Postings
                </h4>
                <p>
                  Every posted listing must represent a legitimate, funded, and open career position. Charging applicants any application or recruitment fees is strictly prohibited.
                </p>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                if (onAccept) onAccept();
                onClose();
              }}
              className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-lg shadow-indigo-500/20"
            >
              <CheckCircle2 size={14} />
              <span>I Agree & Accept Terms</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TermsModal;
