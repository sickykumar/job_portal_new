import React, { useState, useEffect } from "react";
import { Zap, Server, CheckCircle2, Clock } from "lucide-react";
import api from "../../services/api";

/**
 * ============================================================================
 * PLUGGABLE COMPONENT: ServerWarmupBanner (Render / Free-tier Cold Start UX)
 * ============================================================================
 * 
 * PROBLEM THIS SOLVES:
 *   When users visit your frontend on Vercel/Netlify while your backend on Render
 *   is in sleep mode (cold start), API requests can take 30 to 60 seconds.
 *   Without feedback, users assume the website is broken and leave.
 * 
 * HOW THIS WORKS:
 *   1. On initial mount, sends a silent pre-flight `/health` ping to wake the backend.
 *   2. If the backend doesn't respond within 2.5 seconds, this non-intrusive floating
 *      banner slides in, informing the user that the server is waking up with a live
 *      progress counter.
 *   3. Once the server responds, it displays a success checkmark and auto-dismisses.
 * 
 * HOW TO USE IN ANY REACT PROJECT (PORTABLE):
 *   1. Drop this file into your components: `components/common/ServerWarmupBanner.jsx`
 *   2. In `App.jsx`, render `<ServerWarmupBanner />` anywhere inside your router/layout.
 */

const ServerWarmupBanner = ({ healthUrl = "/health", checkTimeoutMs = 2500 }) => {
  const [isWaking, setIsWaking] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timer = null;
    let counterInterval = null;
    let isMounted = true;

    // Trigger warming check after checkTimeoutMs if request is still pending
    timer = setTimeout(() => {
      if (isMounted && !isAwake) {
        setIsWaking(true);
        counterInterval = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }
    }, checkTimeoutMs);

    // Dispatch lightweight health ping
    api
      .get(healthUrl, { timeout: 75000 })
      .then(() => {
        if (!isMounted) return;
        clearTimeout(timer);
        if (counterInterval) clearInterval(counterInterval);

        setIsWaking(false);
        setIsAwake(true);

        // Auto-hide success badge after 3.5 seconds
        setTimeout(() => {
          if (isMounted) setDismissed(true);
        }, 3500);
      })
      .catch((err) => {
        // Ping failed or still attempting
        console.warn("[ServerWarmup] Health ping:", err.message);
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      if (counterInterval) clearInterval(counterInterval);
    };
  }, [healthUrl, checkTimeoutMs]);

  if (dismissed || (!isWaking && !isAwake)) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 border-slate-200 bg-white/95 text-slate-900 dark:border-slate-800 dark:bg-slate-900/95 dark:text-white"
    >
      {isWaking ? (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
            <Server className="h-5 w-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Zap size={13} className="animate-bounce" />
                <span>Waking Free-Tier Server...</span>
              </h4>
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                {elapsedSeconds}s
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Free hosting instance is spinning up from idle sleep. Your data will load shortly!
            </p>
            {/* Animated progress bar */}
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-500"
                style={{
                  width: `${Math.min(95, elapsedSeconds * 4)}%`,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Backend Connected!
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Server active & operational. Ready to use.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ServerWarmupBanner;
