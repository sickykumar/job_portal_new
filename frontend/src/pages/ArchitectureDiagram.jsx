import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Cpu,
  Database,
  Cloud,
  ShieldCheck,
  Zap,
  Globe,
  Server,
  Code2,
  FolderTree,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  FileText,
  Bot,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

import Blueprint2DViewer from "../components/architecture/Blueprint2DViewer";

/**
 * ArchitectureDiagram Page
 * Comprehensive interactive System Architecture Blueprint for NextHire.
 * Visualizes 2D Blueprint Schematics, 6-Tier Presentation, API Gateway, Automation Engine, AI Cascade, Cloud Assets, and Database Persistence.
 */
const ArchitectureDiagram = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("blueprints"); // 'blueprints' | 'layers' | 'flows' | 'specs'
  const [selectedFlow, setSelectedFlow] = useState("apply"); // 'apply' | 'interview' | 'automation'
  const [copied, setCopied] = useState(false);

  const copySpecs = () => {
    const specs = `NextHire Technical Stack:
- Client: React 19, Vite v8, React Router v7, Tailwind CSS v3, TanStack Query v5, Framer Motion
- Backend: Node.js, Express 5 (Port 5000), Helmet v8, Zod v4, express-rate-limit v8
- Persistence: MongoDB, Mongoose 9 ODM with compound unique indexes & atomic operators
- AI Engine: Google Gemini Multi-Model Cascade (gemini-flash-lite -> gemini-flash -> gemini-2.5-flash)
- Storage & CDN: Cloudinary RAW (PDF/DOCX) & Image CDN
- SMTP & Automation: Nodemailer, RFC 5545 iCalendar, Recruiter Host-Control Google Meet`;
    navigator.clipboard.writeText(specs);
    setCopied(true);
    toast.success("Architecture specifications copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50/80 p-6 sm:p-10 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-cyan-400">
              <Layers size={14} />
              <span>Full-Stack MERN Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              System Architecture Blueprint
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Interactive high-level architectural diagram of NextHire. Details 2D visual blueprints, 3 dashboard workflows, Presentation Tier, Secure API Gateway, Gemini AI Multi-Model Cascade, and Atomic MongoDB Persistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/folder-structure"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              <FolderTree size={15} className="text-indigo-500 dark:text-cyan-400" />
              <span>Folder Structure</span>
            </Link>

            <button
              onClick={copySpecs}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition active:scale-95"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? "Copied" : "Copy Stack Specs"}</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="mt-8 flex items-center gap-2 border-t border-slate-200/80 pt-6 dark:border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("blueprints")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shrink-0 ${
              activeTab === "blueprints"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-cyan-300"
            }`}
          >
            <Sparkles size={14} />
            <span>2D Interactive Blueprints</span>
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold">6 Views</span>
          </button>

          <button
            onClick={() => setActiveTab("layers")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shrink-0 ${
              activeTab === "layers"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Layers size={14} />
            <span>6-Tier Layered Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab("flows")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shrink-0 ${
              activeTab === "flows"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Zap size={14} />
            <span>Core Execution Data Flows</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shrink-0 ${
              activeTab === "specs"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Server size={14} />
            <span>Infrastructure & Protocols</span>
          </button>
        </div>
      </div>

      {/* TAB 0: 2D INTERACTIVE BLUEPRINT SCHEMATICS */}
      {activeTab === "blueprints" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Blueprint2DViewer />
        </motion.div>
      )}

      {/* TAB 1: 6-TIER LAYERED TOPOLOGY */}
      {activeTab === "layers" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* TIER 1: CLIENT PRESENTATION */}
          <div className="rounded-3xl border border-blue-500/20 bg-blue-50/30 p-5 sm:p-6 dark:border-blue-500/20 dark:bg-blue-950/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                  <Globe size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                    Tier 1 • Client Presentation
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    React 19 SPA & Tailwind CSS v3
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-900/50 dark:text-cyan-300">
                Port 5173 (Vite v8)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Modern UI & State</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  React Query for optimistic caching, Framer Motion animations, Lucide icons, and 350px responsive architecture.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white mb-1">State Contexts</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  AuthContext (JWT session), ThemeContext (Day/Night modes), and ToastContext (Zero-Alert system).
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Role Guards</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  ProtectedRoute intercepting Candidate, Recruiter, and Super Admin routes with URL-level security.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-700">
            <ArrowRight size={20} className="rotate-90" />
          </div>

          {/* TIER 2: API GATEWAY & EDGE SECURITY */}
          <div className="rounded-3xl border border-indigo-500/20 bg-indigo-50/30 p-5 sm:p-6 dark:border-indigo-500/20 dark:bg-indigo-950/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Tier 2 • Edge Security & Validation
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Express 5 Router & Security Middleware
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                Port 5000 (Node 18+)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">Helmet & CSP</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  Enforces HSTS, X-Frame-Options: DENY, and strict HTTP response security headers.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">Rate Limiter</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  Global 300 req/15m limit and Auth 10 req/15m limit to block brute-force attempts.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">Zod Schemas</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  Strict schema verification for registration, login, job postings, and profiles.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">DataURI Engine</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  Native in-memory buffer converter (0 vulnerabilities) for PDF/DOCX and avatars.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-700">
            <ArrowRight size={20} className="rotate-90" />
          </div>

          {/* TIER 3: BUSINESS CONTROLLERS */}
          <div className="rounded-3xl border border-violet-500/20 bg-violet-50/30 p-5 sm:p-6 dark:border-violet-500/20 dark:bg-violet-950/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md">
                  <Server size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Tier 3 • Business Controller Domain
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    MVC Controllers & Services
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                13+ Domain Controllers
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">User & KYC</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Aadhaar/PAN, OTP, Google Auth</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">Job Lifecycle</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Duration selector, expiry, archive</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">Pipeline</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">6-stage Kanban, interview meets</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">Opportunities</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Hackathons, Quizzes, Internships</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">ATS & Alerts</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">STAR bullets, automated alerts</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">Broadcast</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Direct candidate alert blast</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
                <p className="font-bold text-slate-900 dark:text-white">Super Admin</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Console, moderation & tickets</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-700">
            <ArrowRight size={20} className="rotate-90" />
          </div>

          {/* TIER 4: CLOUD & AI INTEGRATION */}
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-50/30 p-5 sm:p-6 dark:border-cyan-500/20 dark:bg-cyan-950/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Tier 4 • Cloud Intelligence & CDN
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Google Gemini Cascade, Cloudinary & Nodemailer
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-bold text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
                Multi-Model AI Failover
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">Gemini Cascade</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  Automatic fallback: Flash Lite ➔ Flash ➔ 2.5 Flash ➔ 3.6 Flash. Plain-text sanitization (zero raw markdown in textareas).
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">Cloudinary RAW CDN</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  Uploads PDF/Word documents as resource_type: "raw" to guarantee inline browser PDF previews without corruption.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white mb-1">SMTP & Google Meet</p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                  HTML milestone email dispatcher, RFC 5545 calendar (.ics) generation, and recruiter self-host Google Meet integration.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-700">
            <ArrowRight size={20} className="rotate-90" />
          </div>

          {/* TIER 5: PERSISTENCE & DATABASE */}
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/30 p-5 sm:p-6 dark:border-emerald-500/20 dark:bg-emerald-950/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <Database size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Tier 5 • Persistence & Storage
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    MongoDB & Mongoose 9 ODM
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                Atomic Updates & Compound Indexes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white">Users & Roles</p>
                <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">Student, Recruiter (KYC), Admin roles with bcrypt 10 rounds</p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white">Jobs & Status</p>
                <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">Published, archived, expired lifecycle with expiresAt dates</p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white">Applications</p>
                <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">Unique compound index: {`{ job: 1, applicant: 1 }`}</p>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/70 shadow-sm">
                <p className="font-extrabold text-slate-900 dark:text-white">Notifications & OTP</p>
                <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">Automatic TTL expiration index (10m) on OTP collections</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: EXECUTION DATA FLOWS */}
      {activeTab === "flows" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Flow Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedFlow("apply")}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition shrink-0 ${
                selectedFlow === "apply"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              1. Candidate Application & AI Fit Flow
            </button>
            <button
              onClick={() => setSelectedFlow("interview")}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition shrink-0 ${
                selectedFlow === "interview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              2. Recruiter Self-Host Meet & Calendar Flow
            </button>
            <button
              onClick={() => setSelectedFlow("automation")}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition shrink-0 ${
                selectedFlow === "automation"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              3. Centralized Job Expiry & History Archive
            </button>
          </div>

          {/* Flow 1 Content */}
          {selectedFlow === "apply" && (
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-blue-500" />
                <span>End-to-End Application & AI Fit Processing</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Demonstrates how candidate resumes are received, parsed, evaluated with Gemini AI, and atomically linked to recruiter pipelines.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-cyan-400">Step 1</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Pre-Submission Modal</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Candidate reviews profile, bio, and drops PDF/Word resume.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-400">Step 2</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Multer & Cloudinary</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">In-memory buffer converted to DataURI and sent to Cloudinary as raw asset.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-violet-100 dark:bg-violet-950 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-400">Step 3</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">PDF Parser & AI Fit</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">pdf-parse-fork extracts 10k chars; Gemini analyzes match percentage and skill gaps.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Step 4</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Atomic Push</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Application created with compound index check; atomically pushed to Job.applications.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-400">Step 5</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Live Alert Dispatch</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Recruiter receives in-app alert deep-linking straight to candidate in pipeline.</p>
                </div>
              </div>
            </div>
          )}

          {/* Flow 2 Content */}
          {selectedFlow === "interview" && (
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                <span>Recruiter Self-Host Google Meet & Calendar Dispatch</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Recruiter retains 100% Host rights over the Google Meet room with clipboard auto-paste and instant calendar synchronization.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-400">Step 1</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Create Meet as Host</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Clicking opens meet.google.com/new in recruiter's profile, making them the legitimate room Host.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">Step 2</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">1-Click Clipboard Paste</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Navigator clipboard API reads the copied link and populates meetingLink input directly.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-violet-100 dark:bg-violet-950 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-400">Step 3</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">RFC 5545 iCalendar</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Backend formats .ics attachment with alarms at -24h and -1h, delivered via Nodemailer.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Step 4</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Candidate Action Card</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Candidate sees celebration banner and 1-click "Join Google Meet" action button.</p>
                </div>
              </div>
            </div>
          )}

          {/* Flow 3 Content */}
          {selectedFlow === "automation" && (
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap size={18} className="text-emerald-500" />
                <span>Centralized Job Lifecycle, Expiry & History Preservation</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Guarantees candidate search feeds remain fresh while permanently preserving applicant history for expired or archived roles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Step 1</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Duration Selector</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Recruiter selects 7d, 15d, 30d, 60d, or 90d window during job creation.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">Step 2</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Single Source Badges</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">jobStatus.js computes uniform countdown pills (🟢 Active, ⚡ Expiring Soon, ⏰ Expired).</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-400">Step 3</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Recruiter Authority</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Recruiter can archive or reactivate positions with 30-day automatic extension.</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-sm space-y-2">
                  <span className="inline-block rounded-lg bg-rose-100 dark:bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400">Step 4</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">History Preservation</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Applications for closed jobs shift to History tab with preserved timestamps and notes.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 3: INFRASTRUCTURE & PROTOCOLS */}
      {activeTab === "specs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 rounded-3xl space-y-6"
        >
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Server size={18} className="text-indigo-500" />
            <span>Infrastructure Specifications & Network Protocols</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white">
                  <th className="py-2.5 px-3 font-extrabold uppercase tracking-wider text-[11px]">Subsystem</th>
                  <th className="py-2.5 px-3 font-extrabold uppercase tracking-wider text-[11px]">Technology / Protocol</th>
                  <th className="py-2.5 px-3 font-extrabold uppercase tracking-wider text-[11px]">Port / Endpoint</th>
                  <th className="py-2.5 px-3 font-extrabold uppercase tracking-wider text-[11px]">Security Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                <tr>
                  <td className="py-3 px-3 font-extrabold text-slate-950 dark:text-white">Frontend Client</td>
                  <td className="py-3 px-3">Vite v8 + React 18 SPA</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-blue-700 dark:text-cyan-400">http://localhost:5173</td>
                  <td className="py-3 px-3">HTML5 Semantic, ProtectedRoute Guards</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-extrabold text-slate-950 dark:text-white">API Gateway Server</td>
                  <td className="py-3 px-3">Express 5 on Node.js 18+</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-400">http://localhost:8000/api</td>
                  <td className="py-3 px-3">Helmet, Rate-Limit, CORS withCredentials</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-extrabold text-slate-950 dark:text-white">Authentication</td>
                  <td className="py-3 px-3">JSON Web Token (JWT)</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-purple-700 dark:text-purple-400">HttpOnly Cookie (`token`)</td>
                  <td className="py-3 px-3">SameSite: Lax/None, Bcrypt 10 salt rounds</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-extrabold text-slate-950 dark:text-white">Database Persistence</td>
                  <td className="py-3 px-3">MongoDB Atlas / Local v6+</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">mongodb://...:27017</td>
                  <td className="py-3 px-3">Compound Unique Indexes, TLS in-transit</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-extrabold text-slate-950 dark:text-white">AI Intelligence</td>
                  <td className="py-3 px-3">Google Gemini Multi-Model</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-cyan-700 dark:text-cyan-400">HTTPS REST (Google AI)</td>
                  <td className="py-3 px-3">Cascading Fallback, Strict Plain-Text</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-extrabold text-slate-950 dark:text-white">Asset CDN</td>
                  <td className="py-3 px-3">Cloudinary RAW Storage</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-sky-700 dark:text-sky-400">res.cloudinary.com/...</td>
                  <td className="py-3 px-3">IDOR-Protected Authenticated Proxy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ArchitectureDiagram;
