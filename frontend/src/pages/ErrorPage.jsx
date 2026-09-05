import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  RotateCcw,
  Home,
  LifeBuoy,
  ChevronDown,
  Terminal,
  Copy,
  Check,
} from "lucide-react";

/**
 * Universal ErrorPage Component
 * Shown when an uncaught error is caught by the GlobalErrorBoundary or when visiting /error.
 */
const ErrorPage = ({ error, errorInfo, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorMessage = error?.message || "An unexpected client-side runtime exception occurred.";
  const stackTrace = error?.stack || errorInfo?.componentStack || "No stack trace available.";

  const handleCopy = () => {
    navigator.clipboard.writeText(`Error: ${errorMessage}\n\nStack:\n${stackTrace}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-[82vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient Red/Amber Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-rose-600/20 via-amber-500/15 to-violet-600/20 rounded-full blur-3xl opacity-70 dark:opacity-40" />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        {/* Shield Icon Visual */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 relative flex h-24 w-24 items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 opacity-30 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-200 bg-white/90 text-rose-600 shadow-xl backdrop-blur-xl dark:border-rose-500/30 dark:bg-slate-900/90 dark:text-rose-400">
            <ShieldAlert size={38} />
          </div>
        </motion.div>

        {/* Heading & Subtitle */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>System Resilience Engine Active</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Unexpected System Anomaly
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The application encountered an unexpected state while rendering. Our error boundary has safely isolated this process so your data remains protected.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReload}
            className="btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            <RotateCcw size={14} />
            <span>Reload Application</span>
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="btn-secondary inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 cursor-pointer"
          >
            <Home size={14} />
            <span>Safe Homepage</span>
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/contact")}
            className="btn-secondary inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 cursor-pointer"
          >
            <LifeBuoy size={14} />
            <span>Contact Support</span>
          </button>
        </div>

        {/* Collapsible Technical Diagnostics */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white/70 p-4 text-left dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-rose-500" />
              <span>Technical Diagnostics (For Developers)</span>
            </div>
            <ChevronDown
              size={15}
              className={`transform transition-transform duration-300 ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 overflow-hidden border-t border-slate-100 pt-3 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-rose-500 font-bold truncate max-w-xs">
                    {errorMessage}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copied ? "Copied" : "Copy Trace"}</span>
                  </button>
                </div>

                <pre className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 p-3 font-mono text-[10px] leading-relaxed text-slate-300">
                  {stackTrace}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
