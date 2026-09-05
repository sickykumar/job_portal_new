import React from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronRight,
  Shield,
  Scale,
  Layers,
  FolderTree,
} from "lucide-react";

/**
 * FooterNavLinks Component
 * 5-column navigation grid covering Brand, Candidates, Employers, Engineering & Tech Domains, and Legal links.
 * All lists explicitly styled with list-none, p-0, and m-0 to eliminate bullet points.
 */
const FooterNavLinks = ({ onOpenLegal }) => {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
      {/* Column 1: Brand & Operational Summary */}
      <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Path<span className="text-cyan-500">Khojo</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-500 dark:text-cyan-400">
              Career Navigator
            </span>
          </div>
        </Link>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Empowering India's top tech talent and global engineering teams with deep resume fit intelligence, verified e-KYC, and live recruitment pipelines.
        </p>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>99.98% System Uptime</span>
        </div>

        <div className="flex items-center gap-2 pt-1 text-slate-400">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Region:</span>
          <span className="text-xs">🇮🇳 India (INR ₹) • Global</span>
        </div>
      </div>

      {/* Column 2: Job Seekers */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
          Job Seekers
        </h4>
        <ul className="list-none p-0 m-0 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <li>
            <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Search Open Jobs</span>
            </Link>
          </li>
          <li>
            <Link to="/candidate-dashboard" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Career Hub Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/applied" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>My Applications</span>
            </Link>
          </li>
          <li>
            <Link to="/ai-coach" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>AI Career Coach</span>
            </Link>
          </li>
          <li>
            <Link to="/ats-checker" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>ATS Resume Scanner</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Resume & Skills</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Column 3: Employers & Recruiters */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
          Employers
        </h4>
        <ul className="list-none p-0 m-0 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <li>
            <Link to="/post-job" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Post a Position</span>
            </Link>
          </li>
          <li>
            <Link to="/recruiter-dashboard" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Recruiter Command</span>
            </Link>
          </li>
          <li>
            <Link to="/recruiter-jobs" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Kanban Pipeline</span>
            </Link>
          </li>
          <li>
            <Link to="/companies" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Partner Firms</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Company Branding</span>
            </Link>
          </li>
          <li>
            <Link to="/account-settings" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Hiring Team Controls</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Column 4: Engineering & Architecture */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5 flex items-center gap-1.5">
          <Layers size={13} className="text-blue-500 dark:text-cyan-400" />
          <span>Engineering</span>
        </h4>
        <ul className="list-none p-0 m-0 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <li>
            <Link
              to="/architecture"
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1 font-semibold text-blue-600 dark:text-cyan-400"
            >
              <ChevronRight size={11} className="text-blue-500" />
              <span>System Architecture</span>
            </Link>
          </li>
          <li>
            <Link
              to="/folder-structure"
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"
            >
              <ChevronRight size={11} className="text-indigo-500" />
              <span>Folder Structure</span>
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>AI & ML Pipeline</span>
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Cloud & DevOps</span>
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Distributed Backend</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Column 5: Legal & Compliance Documents */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5 flex items-center gap-1.5">
          <Scale size={13} className="text-indigo-500 dark:text-cyan-400" />
          <span>Legal & Compliance</span>
        </h4>
        <ul className="list-none p-0 m-0 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <li>
            <button
              type="button"
              onClick={() => onOpenLegal("privacy")}
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1 text-left"
            >
              <ChevronRight size={11} className="text-slate-400" />
              <span>Privacy Policy (DPDP)</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onOpenLegal("terms")}
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1 text-left"
            >
              <ChevronRight size={11} className="text-slate-400" />
              <span>Terms of Service</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onOpenLegal("kyc")}
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1 text-left"
            >
              <ChevronRight size={11} className="text-slate-400" />
              <span>e-KYC & ID Policy</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onOpenLegal("security")}
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1 text-left"
            >
              <ChevronRight size={11} className="text-slate-400" />
              <span>Security & SLA</span>
            </button>
          </li>
          <li>
            <Link to="/account-settings" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <Shield size={11} className="text-emerald-500" />
              <span>Account Security</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-400" />
              <span>Contact Us</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FooterNavLinks;
