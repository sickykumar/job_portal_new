import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowLeft,
  Home,
  Briefcase,
  Sparkles,
  FileCheck2,
  LifeBuoy,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * Universal NotFound (404) Page
 * Cosmic cyber-aesthetic not-found destination.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDashboard = () => {
    if (user?.role === "admin") navigate("/admin-dashboard");
    else if (user?.role === "recruiter") navigate("/recruiter-dashboard");
    else if (user?.role === "student") navigate("/candidate-dashboard");
    else navigate("/");
  };

  return (
    <div className="relative min-h-[82vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient Cyber Nebula Background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-violet-600/20 rounded-full blur-3xl opacity-70 dark:opacity-40" />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        {/* Floating Cosmic Radar Visual */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 relative flex h-28 w-28 items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-30 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-indigo-200 bg-white/80 shadow-xl backdrop-blur-xl dark:border-indigo-500/30 dark:bg-slate-900/80">
            <Compass size={44} className="text-indigo-600 dark:text-cyan-400 animate-spin" style={{ animationDuration: "14s" }} />
          </div>
        </motion.div>

        {/* 404 Cyber Typography */}
        <div className="relative inline-block">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-violet-600 select-none drop-shadow-sm">
            404
          </span>
          <span className="absolute -bottom-2 right-0 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-0.5 text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-cyan-300 backdrop-blur-md">
            Out of Orbit
          </span>
        </div>

        {/* Heading & Explanation */}
        <h1 className="mt-6 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Destination Lost in the Career Void
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The coordinate or page you are looking for has been relocated, archived, or does not exist in the NexHire cluster.
        </p>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            <Briefcase size={14} />
            <span>Explore Open Roles</span>
          </button>

          <button
            type="button"
            onClick={handleDashboard}
            className="btn-secondary inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 cursor-pointer"
          >
            <LayoutDashboard size={14} />
            <span>My Dashboard</span>
          </button>
        </div>

        {/* Suggested Orbit Landmarks */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick System Waypoints:
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              onClick={() => navigate("/ats-checker")}
              className="rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 size={12} />
              <span>ATS Scanner</span>
            </button>

            <button
              onClick={() => navigate("/ai-coach")}
              className="rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={12} />
              <span>AI Coach</span>
            </button>

            <button
              onClick={() => navigate("/companies")}
              className="rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-cyan-400 transition cursor-pointer"
            >
              Company Directory
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <LifeBuoy size={12} />
              <span>Support Desk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
