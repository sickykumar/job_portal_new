import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CandidateResumeCard from "../components/candidate/CandidateResumeCard";

const ResumeCenter = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent px-3 pt-2 pb-12 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 p-5 sm:p-8 backdrop-blur-xl dark:border-indigo-500/30">
        <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400">
              <FileCheck2 className="h-4 w-4" />
              <span>PathKhojo Resume Document Hub</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Resume Document Center
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Manage your verified PDF resume, track ATS score readiness, and synchronize your document across all job and internship applications.
            </p>
          </div>

          <Link
            to="/ats-checker"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open ATS AI Optimizer</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Resume Card (2 Cols) */}
        <div className="lg:col-span-2">
          <CandidateResumeCard />
        </div>

        {/* ATS Readiness & Best Practices (1 Col) */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>ATS Readiness Checklist</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Single column clean layout without tables or complex graphics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Quantified impact bullets using the STAR (Situation, Task, Action, Result) framework</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Standard section headers: Summary, Skills, Experience, Projects, Education</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clean PDF text format (not scanned raster image)</span>
              </li>
            </ul>

            <Link
              to="/ats-checker"
              className="mt-4 block w-full rounded-xl bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Run Full ATS Scan →
            </Link>
          </div>

          <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 dark:border-indigo-500/30">
            <h4 className="mb-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
              Autonomous Recruiter Sync
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When you replace or upload a new resume here, your submitted applications retain their verified state while new recruiter searches will automatically review your updated qualifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCenter;
