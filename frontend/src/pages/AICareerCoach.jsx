import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Lock,
  ArrowRight,
  UserPlus,
  LogIn,
  X,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  CoachTabs,
  CareerStrategistTab,
  InterviewLabTab,
  SalaryIntelligenceTab,
} from "../components/ai-coach";
import PathKhojoLogo from "../components/common/PathKhojoLogo";

const AICareerCoach = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");
  const [loginModal, setLoginModal] = useState({
    isOpen: false,
    reason: "",
  });

  const handleSelectTab = (tab) => {
    if (!user && tab !== "chat") {
      setLoginModal({
        isOpen: true,
        reason:
          tab === "interview"
            ? "Interview Prep Simulator generates personalized system design & coding prompts based on your verified skills. Please sign in to access."
            : "Salary & Compensation Intelligence requires a candidate profile to benchmark real-world tech offer bands. Please sign in to access.",
      });
      return;
    }
    setActiveTab(tab);
  };

  const handleRequireLogin = (reason) => {
    setLoginModal({
      isOpen: true,
      reason: reason || "Sign in to access unlimited AI conversations and full platform intelligence.",
    });
  };

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0">
      {/* Sleek Compact Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              AI Career Coach
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              Gemini Flash
            </span>
            {!user && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                Guest Free Trial (2 Prompts)
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized intelligence for technical interviews, salary negotiation, and career strategy
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <CoachTabs activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "chat" && (
          <CareerStrategistTab
            key="chat"
            user={user}
            onRequireLogin={handleRequireLogin}
          />
        )}
        {activeTab === "interview" && <InterviewLabTab key="interview" />}
        {activeTab === "salary" && <SalaryIntelligenceTab key="salary" />}
      </AnimatePresence>

      {/* Glassmorphic Soft-Login / Registration Gate Modal */}
      <AnimatePresence>
        {loginModal.isOpen && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setLoginModal({ isOpen: false, reason: "" })}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Brand Logo & Icon */}
              <div className="mx-auto mb-3 flex flex-col items-center">
                <PathKhojoLogo size="sm" showText={true} />
              </div>

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Unlock Full AI Career Intelligence
              </h3>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-2">
                {loginModal.reason}
              </p>

              {/* Feature Highlights */}
              <div className="my-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-left dark:border-slate-800/80 dark:bg-slate-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Unlimited conversational AI career coaching</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Tailored mock technical interview questions</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Accurate 2026 salary benchmarks & counter-offers</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setLoginModal({ isOpen: false, reason: "" });
                    navigate("/login");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setLoginModal({ isOpen: false, reason: "" });
                    navigate("/register");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICareerCoach;
