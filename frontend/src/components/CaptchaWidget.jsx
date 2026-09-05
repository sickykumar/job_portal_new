import React, { useState } from "react";
import { ShieldCheck, Check, RefreshCw } from "lucide-react";

/**
 * Interactive Security Captcha Widget
 * Zero-friction, responsive anti-bot verification challenge.
 */
const CaptchaWidget = ({ onVerify, isVerified }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (isVerified || loading) return;

    setLoading(true);
    // Simulate smart anti-bot challenge computation (800ms)
    setTimeout(() => {
      setLoading(false);
      if (onVerify) {
        onVerify(true);
      }
    }, 800);
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 shadow-sm transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          disabled={isVerified || loading}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300 ${
            isVerified
              ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : loading
              ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10"
              : "border-slate-300 bg-white hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
          }`}
          aria-label="Verify you are human"
        >
          {isVerified ? (
            <Check size={16} className="animate-in zoom-in-50 duration-200" />
          ) : loading ? (
            <RefreshCw size={14} className="animate-spin text-indigo-600 dark:text-cyan-400" />
          ) : null}
        </button>

        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {isVerified ? "Verification Successful" : "I'm not a robot"}
          </p>
          <p className="text-[10px] text-slate-400">
            {isVerified ? "Secured by NexHire Shield" : "Click the checkbox to verify"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end opacity-70">
        <ShieldCheck size={20} className={isVerified ? "text-emerald-500" : "text-slate-400"} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">reCAPTCHA</span>
      </div>
    </div>
  );
};

export default CaptchaWidget;
