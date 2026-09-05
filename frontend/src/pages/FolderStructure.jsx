import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Search,
  Copy,
  Check,
  Layers,
  Sparkles,
  Server,
  Code2,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  Database,
  Cpu,
  FileCheck,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

/**
 * FolderStructure Page
 * Interactive Codebase Directory Blueprint for NextHire.
 * Features:
 * 1. Real-time Live Filesystem Auto-Sync from Backend (/api/system/codebase-tree).
 * 2. High-contrast, ultra-clear Day Mode & Night Mode color palette.
 * 3. Search & filter across files and directories.
 * 4. Expandable/Collapsible node hierarchy.
 * 5. ASCII Tree visualizer with 1-click clipboard copy.
 */
const FolderStructure = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("interactive"); // 'interactive' | 'ascii'

  // Live Auto-Sync states
  const [dynamicData, setDynamicData] = useState(null);
  const [dynamicAscii, setDynamicAscii] = useState(null);
  const [syncStats, setSyncStats] = useState(null);
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch live filesystem tree from backend
  const fetchLiveTree = async (showToast = false) => {
    setIsSyncing(true);
    try {
      const res = await api.get("/system/codebase-tree");
      if (res.data?.success && res.data?.tree) {
        setDynamicData(res.data.tree);
        setDynamicAscii(res.data.ascii);
        setSyncStats(res.data.stats);
        setIsLiveSync(true);
        if (showToast) {
          toast.success(`Live codebase synchronized! ${res.data.stats.totalFiles} files detected.`);
        }
      }
    } catch (err) {
      console.warn("Live filesystem sync fallback to curated structure:", err?.message);
      setIsLiveSync(false);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveTree(false);
  }, []);

  // Curated Fallback Tree (Meticulously kept up to date)
  const curatedDirectoryData = [
    {
      name: "Backend/",
      type: "folder",
      desc: "Node.js & Express 5 API Gateway, Controllers, Mongoose 9 Models, and Background Automation",
      badge: "Server Core",
      children: [
        {
          name: "automation/",
          type: "folder",
          desc: "Autonomous recruitment workers, candidate matching engine, and event bus",
          children: [
            { name: "controllers/automationAdmin.controller.js", type: "file", desc: "Admin automation metrics, task retries, flagged jobs" },
            { name: "controllers/interview.controller.js", type: "file", desc: "Recruiter Google Meet host link generator & calendar scheduling" },
            { name: "events/automationBus.js", type: "file", desc: "In-memory event emitter for decoupled reactive job events" },
            { name: "events/eventTypes.js", type: "file", desc: "Standard event constants across recruitment lifecycle" },
            { name: "routes/automationAdmin.route.js", type: "file", desc: "Automation admin API routes (/api/automation)" },
            { name: "routes/interview.route.js", type: "file", desc: "Interview host links and calendar invites (/api/interview)" },
            { name: "services/candidateMatcher.service.js", type: "file", desc: "Autonomous 6-dimension candidate skill & project matching" },
            { name: "services/googleCalendar.service.js", type: "file", desc: "RFC 5545 iCalendar (.ics) generation with meeting alarms" },
            { name: "services/jobAnalyzer.service.js", type: "file", desc: "Gemini AI metadata extraction and DB sync runner" },
            { name: "services/statusNotifier.service.js", type: "file", desc: "Automated branded HTML email dispatcher for status milestones" },
            { name: "index.js", type: "file", desc: "Engine bootstrap, cron schedulers, and graceful teardown" },
          ],
        },
        {
          name: "controllers/",
          type: "folder",
          desc: "Business logic and request controllers",
          children: [
            { name: "admin.controller.js", type: "file", desc: "Super Admin metrics, user moderation, job moderation, support desk" },
            { name: "ai.controller.js", type: "file", desc: "Gemini cascade runner, PDF parsing, ATS check, career coach" },
            { name: "application.controller.js", type: "file", desc: "Apply, multi-stage status update, interview scheduler, resume proxy" },
            { name: "ats.controller.js", type: "file", desc: "Standalone ATS score calculation, STAR bullet optimizer, keyword gaps" },
            { name: "company.controller.js", type: "file", desc: "Employer branding, logo uploads, company directory" },
            { name: "contact.controller.js", type: "file", desc: "Contact Us tickets with Mongoose 9 compatibility" },
            { name: "hackathon.controller.js", type: "file", desc: "Hackathon creation, team registration, and prize pool management" },
            { name: "job.controller.js", type: "file", desc: "Posting with duration selector, search, bookmarks, archive, delete" },
            { name: "jobAlert.controller.js", type: "file", desc: "Automated candidate alert subscriptions and email digests" },
            { name: "newsletter.controller.js", type: "file", desc: "Newsletter subscription management and email blasts" },
            { name: "notification.controller.js", type: "file", desc: "In-app real-time notification feed and read tracking" },
            { name: "quiz.controller.js", type: "file", desc: "Skill quiz creation, submissions, verified badge awards" },
            { name: "user.controller.js", type: "file", desc: "Registration, OTP, Google Auth, Recruiter KYC (Aadhaar/PAN), Profile" },
          ],
        },
        {
          name: "middleware/",
          type: "folder",
          desc: "Route security, authentication guards, and file upload processing",
          children: [
            { name: "isAuthenticated.js", type: "file", desc: "JWT cookie/token verification and role-based authorization guards" },
            { name: "multer.js", type: "file", desc: "Memory storage upload handler for PDFs, docs, and profile images" },
          ],
        },
        {
          name: "models/",
          type: "folder",
          desc: "Mongoose 9 database schemas and compound indexes",
          children: [
            { name: "admin.model.js", type: "file", desc: "Super Administrator credentials and audit logs" },
            { name: "application.model.js", type: "file", desc: "Pipeline status, feedback, interview schedule, unique compound index" },
            { name: "company.model.js", type: "file", desc: "Corporate entity details and recruiter ownership linkage" },
            { name: "contact.model.js", type: "file", desc: "User support tickets and resolution workflow state" },
            { name: "hackathon.model.js", type: "file", desc: "Hackathon listings, prize pools, creator refs, and deadlines" },
            { name: "job.model.js", type: "file", desc: "Vacancies, internships, duration, expiresAt, status, moderation" },
            { name: "jobAlert.model.js", type: "file", desc: "Candidate alert preferences, frequency, and matching skills" },
            { name: "newsletter.model.js", type: "file", desc: "Verified subscriber emails and subscription timestamps" },
            { name: "notification.model.js", type: "file", desc: "In-app alerts with deep-link redirection paths and read status" },
            { name: "otp.model.js", type: "file", desc: "6-digit OTP verification codes with automatic 10-minute TTL index" },
            { name: "quiz.model.js", type: "file", desc: "Skill assessment questions, options, pass criteria, creator refs" },
            { name: "user.model.js", type: "file", desc: "Candidate & Recruiter profiles, KYC numbers, verified skill badges" },
          ],
        },
        {
          name: "routes/",
          type: "folder",
          desc: "REST API route definitions",
          children: [
            { name: "admin.route.js", type: "file", desc: "/api/admin console & moderation endpoints" },
            { name: "ai.route.js", type: "file", desc: "/api/ai intelligence & ATS endpoints" },
            { name: "application.route.js", type: "file", desc: "/api/application pipeline & resume endpoints" },
            { name: "ats.route.js", type: "file", desc: "/api/ats scoring and bullet optimization endpoints" },
            { name: "company.route.js", type: "file", desc: "/api/company directory and profile endpoints" },
            { name: "contact.route.js", type: "file", desc: "/api/contact support ticket submission endpoints" },
            { name: "hackathon.route.js", type: "file", desc: "/api/hackathon listing, creation, and registration endpoints" },
            { name: "job.route.js", type: "file", desc: "/api/job discovery, bookmarking, and posting endpoints" },
            { name: "jobAlert.route.js", type: "file", desc: "/api/job-alert candidate preferences endpoints" },
            { name: "newsletter.route.js", type: "file", desc: "/api/newsletter subscription endpoints" },
            { name: "notification.route.js", type: "file", desc: "/api/notification activity stream endpoints" },
            { name: "quiz.route.js", type: "file", desc: "/api/quiz assessment and badge award endpoints" },
            { name: "system.route.js", type: "file", desc: "/api/system dynamic codebase tree and health scanner" },
            { name: "user.route.js", type: "file", desc: "/api/user authentication, OTP, and profile endpoints" },
          ],
        },
        {
          name: "test/",
          type: "folder",
          desc: "Automated backend Vitest test suites",
          children: [
            { name: "automation.test.js", type: "file", desc: "Matching algorithm & calendar invitation generation tests" },
            { name: "validation.test.js", type: "file", desc: "Zod authentication and job posting schema validation tests" },
          ],
        },
        {
          name: "utils/",
          type: "folder",
          desc: "Helper libraries, formatters, and Zod validators",
          children: [
            { name: "datauri.js", type: "file", desc: "Native in-memory buffer to base64 DataURI converter" },
            { name: "emailService.js", type: "file", desc: "Nodemailer SMTP integration for OTP, digests, and alerts" },
            { name: "emailTemplates.js", type: "file", desc: "Modern responsive HTML branded email templates" },
            { name: "jobAlertNotifier.js", type: "file", desc: "Background candidate matcher and alert dispatcher" },
            { name: "validators.js", type: "file", desc: "Zod input validation schemas for all incoming API payloads" },
          ],
        },
        { name: "index.js", type: "file", desc: "Express 5 application entry point, Helmet, Rate Limiter, and Graceful Shutdown" },
        { name: "package.json", type: "file", desc: "Backend dependencies (audited 0 vulnerabilities)" },
      ],
    },
    {
      name: "frontend/",
      type: "folder",
      desc: "Vite v8 + React 18 Single Page Application styled with Tailwind CSS v3",
      badge: "Client SPA",
      children: [
        {
          name: "src/components/",
          type: "folder",
          desc: "Domain-grouped atomic React UI components",
          children: [
            {
              name: "admin/",
              type: "folder",
              desc: "Super Admin console tabs, moderation tools, and platform opportunities management",
              children: [
                { name: "AdminAutomationTab.jsx", type: "file", desc: "Live automation pipeline metrics, queue tasks, flagged jobs" },
                { name: "AdminCandidatesTab.jsx", type: "file", desc: "Candidate accounts oversight, status toggles, deletion" },
                { name: "AdminJobsTab.jsx", type: "file", desc: "Platform job vacancies moderation and emergency removal" },
                { name: "AdminOpportunitiesTab.jsx", type: "file", desc: "Hackathons, Quizzes, and Internships platform CRUD management" },
                { name: "AdminOverviewTab.jsx", type: "file", desc: "High-level platform KPI cards and recent activities" },
                { name: "AdminRecruitersTab.jsx", type: "file", desc: "Recruiter accounts oversight, KYC verification, status" },
                { name: "AdminResolveModal.jsx", type: "file", desc: "Support ticket resolution modal with recruiter response" },
                { name: "AdminTicketsTab.jsx", type: "file", desc: "Contact support desk inbox with priority badges" },
              ],
            },
            {
              name: "candidate/",
              type: "folder",
              desc: "Candidate dashboard cards, resume viewer, and opportunities widget",
              children: [
                { name: "ApplicationJourney.jsx", type: "file", desc: "Interactive recruitment stage timeline visualizer" },
                { name: "CandidateHero.jsx", type: "file", desc: "Personalized greeting header with Career DNA meter" },
                { name: "CandidateJobCard.jsx", type: "file", desc: "Standard applicant job card with 1-click apply" },
                { name: "CandidateOpportunitiesWidget.jsx", type: "file", desc: "Registered hackathons, verified skill badges & internships" },
                { name: "CandidateQuickActions.jsx", type: "file", desc: "Quick navigation action triggers for career tools" },
                { name: "CandidateResumeCard.jsx", type: "file", desc: "Cloudinary RAW PDF resume previewer and replace button" },
                { name: "CandidateStatCard.jsx", type: "file", desc: "Single KPI stat card with glowing status dot" },
                { name: "CandidateStatsGrid.jsx", type: "file", desc: "4-column analytics grid for applications and callbacks" },
                { name: "RecentAppliedJobs.jsx", type: "file", desc: "Recent submissions preview with status pills" },
                { name: "RecommendedJobsSection.jsx", type: "file", desc: "Gemini AI matched vacancies based on candidate profile" },
              ],
            },
            {
              name: "recruiter/",
              type: "folder",
              desc: "Recruiter hiring funnel, job cards, and opportunities hub",
              children: [
                { name: "ActivePositionsSection.jsx", type: "file", desc: "List of open positions posted by logged-in recruiter" },
                { name: "HiringFunnel.jsx", type: "file", desc: "5-stage candidate conversion funnel analytics" },
                { name: "RecruiterHero.jsx", type: "file", desc: "Recruiter greeting header with active post counts" },
                { name: "RecruiterJobCard.jsx", type: "file", desc: "Compact job card with applicant count and status toggle" },
                { name: "RecruiterOpportunitiesHub.jsx", type: "file", desc: "Internship poster, hackathon hoster, and quiz designer" },
                { name: "RecruiterStatCard.jsx", type: "file", desc: "Recruiter KPI metric card with sparklines" },
                { name: "RecruiterStatsGrid.jsx", type: "file", desc: "Hiring pipeline performance overview grid" },
              ],
            },
            {
              name: "pipeline/",
              type: "folder",
              desc: "Kanban pipeline, candidate status decisions, and interview scheduler",
              children: [
                { name: "PipelineKanban.jsx", type: "file", desc: "Drag-and-drop multi-stage recruitment pipeline columns" },
                { name: "PipelineList.jsx", type: "file", desc: "Classic table view of job applicants with bulk selection" },
                { name: "PipelineModal.jsx", type: "file", desc: "Candidate detailed profile & parsed resume drawer" },
                { name: "StatusDecisionModal.jsx", type: "file", desc: "Recruiter status update with feedback and interview dates" },
              ],
            },
            {
              name: "ai-coach/",
              type: "folder",
              desc: "Conversational career coach, interview simulator, and salary strategist",
            },
            {
              name: "ats/",
              type: "folder",
              desc: "ATS resume score engine, STAR bullet optimizer, and keyword gap analyzer",
            },
            {
              name: "footer/",
              type: "folder",
              desc: "Universal responsive footer, navigation links, and legal modals",
            },
            {
              name: "common/",
              type: "folder",
              desc: "Universal navbar, responsive sidebar, error boundary, and cyber loader",
            },
          ],
        },
        {
          name: "src/context/",
          type: "folder",
          desc: "Global state management providers",
          children: [
            { name: "AuthContext.jsx", type: "file", desc: "Current user session, login, logout, and token check" },
            { name: "ThemeContext.jsx", type: "file", desc: "Day and Night dual-theme switcher with localStorage sync" },
            { name: "ToastContext.jsx", type: "file", desc: "Universal enterprise toast alerts and requireAuth modal" },
          ],
        },
        {
          name: "src/pages/",
          type: "folder",
          desc: "Complete route views and role-tailored dashboards (27 views)",
          children: [
            { name: "AccountSettings.jsx", type: "file", desc: "Password change, session controls, and notification toggles" },
            { name: "AdminDashboard.jsx", type: "file", desc: "Single administrative console with horizontal pill navigation" },
            { name: "AICareerCoach.jsx", type: "file", desc: "AI career mentor, interview simulator & salary negotiator" },
            { name: "AppliedJobs.jsx", type: "file", desc: "Interactive application accordion and permanent history archive" },
            { name: "ArchitectureDiagram.jsx", type: "file", desc: "Interactive 6-tier system architecture blueprint" },
            { name: "ATSResumeChecker.jsx", type: "file", desc: "Resume ATS score audit, STAR bullets, and keyword analysis" },
            { name: "CandidateDashboard.jsx", type: "file", desc: "Executive Hub with Career DNA and Recent Applied Jobs" },
            { name: "Companies.jsx", type: "file", desc: "Company directory, profiles, and active openings" },
            { name: "ContactUs.jsx", type: "file", desc: "Support ticket form with category selection" },
            { name: "ErrorPage.jsx", type: "file", desc: "Universal error fallback screen with retry button" },
            { name: "ExploreHome.jsx", type: "file", desc: "Unstop-inspired guest landing page with carousel slider" },
            { name: "FolderStructure.jsx", type: "file", desc: "Interactive live codebase directory tree and ASCII blueprint" },
            { name: "ForgotPassword.jsx", type: "file", desc: "Password recovery with email OTP verification" },
            { name: "Hackathons.jsx", type: "file", desc: "Live hackathon arena, team enrollments, and prize pools" },
            { name: "Internships.jsx", type: "file", desc: "Curated stipend internships portal with instant apply" },
            { name: "JobAlerts.jsx", type: "file", desc: "Candidate automated alert subscriptions and preferences" },
            { name: "JobList.jsx", type: "file", desc: "Open positions search, filters, and real-time bookmarking" },
            { name: "Login.jsx", type: "file", desc: "Role-aware login with Google OAuth & OTP support" },
            { name: "NotFound.jsx", type: "file", desc: "Cyber-themed 404 page with route recommendations" },
            { name: "PostJob.jsx", type: "file", desc: "Job creation with active duration selector (7-90 days)" },
            { name: "Profile.jsx", type: "file", desc: "Role-tailored profile editor (Candidate, Recruiter, Super Admin)" },
            { name: "RecruiterDashboard.jsx", type: "file", desc: "Command center with talent funnel and active posts" },
            { name: "RecruiterJobs.jsx", type: "file", desc: "Dual Kanban board and candidate management" },
            { name: "Register.jsx", type: "file", desc: "Role-specific registration with recruiter KYC verification" },
            { name: "ResumeCenter.jsx", type: "file", desc: "Dedicated candidate resume viewer and management hub" },
            { name: "SkillQuizzes.jsx", type: "file", desc: "Interactive timed skill tests awarding verified profile badges" },
            { name: "index.js", type: "file", desc: "Centralized barrel exports for all page views" },
          ],
        },
        {
          name: "src/utils/",
          type: "folder",
          desc: "Shared frontend helper utilities",
          children: [
            { name: "indianFormat.js", type: "file", desc: "Aadhaar and PAN number masking and formatters" },
            { name: "jobStatus.js", type: "file", desc: "Single source of truth for expiry calculation and status badges" },
          ],
        },
        { name: "src/App.jsx", type: "file", desc: "Master application router, protected routes, and layout shell" },
        { name: "src/index.css", type: "file", desc: "Tailwind v3 theme tokens, typography, and custom utilities" },
        { name: "tailwind.config.js", type: "file", desc: "Tailwind configuration with darkMode: 'class' and Google Fonts" },
        { name: "vite.config.js", type: "file", desc: "Vite build config with manual vendor rollup code splitting" },
        { name: "package.json", type: "file", desc: "Frontend dependencies and build scripts" },
      ],
    },
    {
      name: "AGENTS.md",
      type: "file",
      desc: "Complete Master Architecture & Engineering Specification (All Phases)",
    },
  ];

  const curatedAsciiTree = `Job Portal/
├── Backend/
│   ├── automation/
│   │   ├── controllers/
│   │   │   ├── automationAdmin.controller.js
│   │   │   └── interview.controller.js
│   │   ├── events/
│   │   │   ├── automationBus.js
│   │   │   └── eventTypes.js
│   │   ├── routes/
│   │   │   ├── automationAdmin.route.js
│   │   │   └── interview.route.js
│   │   └── services/
│   │       ├── candidateMatcher.service.js
│   │       ├── googleCalendar.service.js
│   │       ├── jobAnalyzer.service.js
│   │       └── statusNotifier.service.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── ai.controller.js
│   │   ├── application.controller.js
│   │   ├── ats.controller.js
│   │   ├── company.controller.js
│   │   ├── contact.controller.js
│   │   ├── hackathon.controller.js
│   │   ├── job.controller.js
│   │   ├── jobAlert.controller.js
│   │   ├── newsletter.controller.js
│   │   ├── notification.controller.js
│   │   ├── quiz.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── isAuthenticated.js
│   │   └── multer.js
│   ├── models/
│   │   ├── admin.model.js
│   │   ├── application.model.js
│   │   ├── company.model.js
│   │   ├── contact.model.js
│   │   ├── hackathon.model.js
│   │   ├── job.model.js
│   │   ├── jobAlert.model.js
│   │   ├── newsletter.model.js
│   │   ├── notification.model.js
│   │   ├── otp.model.js
│   │   ├── quiz.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── admin.route.js
│   │   ├── ai.route.js
│   │   ├── application.route.js
│   │   ├── ats.route.js
│   │   ├── company.route.js
│   │   ├── contact.route.js
│   │   ├── hackathon.route.js
│   │   ├── job.route.js
│   │   ├── jobAlert.route.js
│   │   ├── newsletter.route.js
│   │   ├── notification.route.js
│   │   ├── quiz.route.js
│   │   ├── system.route.js
│   │   └── user.route.js
│   ├── test/
│   │   ├── automation.test.js
│   │   └── validation.test.js
│   ├── utils/
│   │   ├── datauri.js
│   │   ├── emailService.js
│   │   ├── emailTemplates.js
│   │   ├── jobAlertNotifier.js
│   │   └── validators.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminAutomationTab.jsx
│   │   │   │   ├── AdminCandidatesTab.jsx
│   │   │   │   ├── AdminJobsTab.jsx
│   │   │   │   ├── AdminOpportunitiesTab.jsx
│   │   │   │   ├── AdminOverviewTab.jsx
│   │   │   │   ├── AdminRecruitersTab.jsx
│   │   │   │   ├── AdminResolveModal.jsx
│   │   │   │   └── AdminTicketsTab.jsx
│   │   │   ├── candidate/
│   │   │   │   ├── ApplicationJourney.jsx
│   │   │   │   ├── CandidateHero.jsx
│   │   │   │   ├── CandidateJobCard.jsx
│   │   │   │   ├── CandidateOpportunitiesWidget.jsx
│   │   │   │   ├── CandidateQuickActions.jsx
│   │   │   │   ├── CandidateResumeCard.jsx
│   │   │   │   ├── CandidateStatCard.jsx
│   │   │   │   ├── CandidateStatsGrid.jsx
│   │   │   │   ├── RecentAppliedJobs.jsx
│   │   │   │   └── RecommendedJobsSection.jsx
│   │   │   ├── recruiter/
│   │   │   │   ├── ActivePositionsSection.jsx
│   │   │   │   ├── HiringFunnel.jsx
│   │   │   │   ├── RecruiterHero.jsx
│   │   │   │   ├── RecruiterJobCard.jsx
│   │   │   │   ├── RecruiterOpportunitiesHub.jsx
│   │   │   │   ├── RecruiterStatCard.jsx
│   │   │   │   └── RecruiterStatsGrid.jsx
│   │   │   ├── pipeline/
│   │   │   │   ├── PipelineKanban.jsx
│   │   │   │   ├── PipelineList.jsx
│   │   │   │   ├── PipelineModal.jsx
│   │   │   │   └── StatusDecisionModal.jsx
│   │   │   ├── ai-coach/
│   │   │   ├── ats/
│   │   │   ├── common/
│   │   │   ├── company/
│   │   │   ├── footer/
│   │   │   ├── jobAlert/
│   │   │   └── post-job/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AICareerCoach.jsx
│   │   │   ├── AppliedJobs.jsx
│   │   │   ├── ArchitectureDiagram.jsx
│   │   │   ├── ATSResumeChecker.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── ContactUs.jsx
│   │   │   ├── ErrorPage.jsx
│   │   │   ├── ExploreHome.jsx
│   │   │   ├── FolderStructure.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Hackathons.jsx
│   │   │   ├── Internships.jsx
│   │   │   ├── JobAlerts.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── RecruiterJobs.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResumeCenter.jsx
│   │   │   ├── SkillQuizzes.jsx
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   ├── indianFormat.js
│   │   │   └── jobStatus.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── AGENTS.md`;

  const activeTreeData = dynamicData || curatedDirectoryData;
  const activeAsciiTree = dynamicAscii || curatedAsciiTree;

  const copyTree = () => {
    navigator.clipboard.writeText(activeAsciiTree);
    setCopied(true);
    toast.success("Folder tree copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Filter tree recursively
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return activeTreeData;
    const q = searchQuery.toLowerCase();

    const filterNode = (node) => {
      const matches =
        node.name.toLowerCase().includes(q) ||
        (node.desc && node.desc.toLowerCase().includes(q));

      if (node.children) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter(Boolean);

        if (matches || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
      } else if (matches) {
        return node;
      }
      return null;
    };

    return activeTreeData.map(filterNode).filter(Boolean);
  }, [searchQuery, activeTreeData]);

  return (
    <div className="w-full min-h-screen px-3 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner - High Contrast Day & Night */}
      <div className="rounded-3xl border-2 border-indigo-200/90 bg-gradient-to-br from-indigo-50/90 via-blue-50/60 to-white p-6 sm:p-10 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-100/90 px-3.5 py-1 text-xs font-black text-indigo-900 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-400">
              <FolderTree size={15} />
              <span>Interactive Codebase Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              Codebase Directory & Folder Structure
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium dark:text-slate-300 max-w-2xl leading-relaxed">
              Real-time architectural layout of the NextHire project. Includes Backend services, Background Workers, React Query components, State Contexts, and Utilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/architecture"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              <Layers size={15} className="text-blue-600 dark:text-cyan-400" />
              <span>System Architecture</span>
            </Link>

            <button
              onClick={copyTree}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-800 transition active:scale-95"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? "Tree Copied" : "Copy Tree (ASCII)"}</span>
            </button>
          </div>
        </div>

        {/* Live Auto-Sync Status Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50/95 p-3.5 text-xs font-semibold text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-300 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600 dark:bg-emerald-400"></span>
            </span>
            <span className="font-bold">
              {isLiveSync ? (
                <>
                  🟢 Auto-Sync Active: Real-time Live Filesystem ({syncStats?.totalFiles || 200}+ files in {syncStats?.totalFolders || 35}+ folders scanned dynamically)
                </>
              ) : (
                <>
                  ⚡ Curated Architectural Blueprint Active
                </>
              )}
            </span>
          </div>

          <button
            onClick={() => fetchLiveTree(true)}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/60 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100/60 dark:border-emerald-500/40 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin text-emerald-600" : "text-emerald-600 dark:text-emerald-400"} />
            <span>{isSyncing ? "Scanning Disk..." : "Rescan Live Disk"}</span>
          </button>
        </div>

        {/* Search & Mode Toggles */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-indigo-100 pt-6 dark:border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search folders or files (e.g. controller, hackathon, modal)..."
              className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium text-slate-950 placeholder:text-slate-500 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white dark:focus:border-cyan-500 shadow-xs"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-slate-500 dark:text-slate-400" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("interactive")}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition shadow-xs ${
                viewMode === "interactive"
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              Visual Tree
            </button>
            <button
              onClick={() => setViewMode("ascii")}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition shadow-xs ${
                viewMode === "ascii"
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              Raw ASCII
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: RAW ASCII TREE */}
      {viewMode === "ascii" && (
        <div className="relative rounded-3xl border-2 border-slate-800 bg-slate-950 text-emerald-400 p-5 sm:p-7 overflow-x-auto shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-xs font-mono font-bold text-slate-300 ml-2">NextHire Architecture Tree (Live)</span>
            </div>
            <button
              onClick={copyTree}
              className="text-xs flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
          </div>
          <pre className="font-mono text-xs sm:text-sm leading-relaxed text-emerald-400 dark:text-cyan-300">
            {activeAsciiTree}
          </pre>
        </div>
      )}

      {/* VIEW: INTERACTIVE VISUAL TREE */}
      {viewMode === "interactive" && (
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border-2 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No matching files or folders found for "{searchQuery}".
              </p>
            </div>
          ) : (
            filteredData.map((node, i) => (
              <TreeNode key={i} node={node} defaultExpanded={true} level={0} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Helper to determine vibrant file icons and colors
const getFileMeta = (name) => {
  if (name.endsWith(".controller.js")) {
    return {
      icon: <Server size={15} />,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      badge: "Controller",
      badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300",
    };
  }
  if (name.endsWith(".model.js")) {
    return {
      icon: <Database size={15} />,
      colorClass: "text-teal-600 dark:text-teal-400",
      badge: "Model",
      badgeClass: "bg-teal-100 text-teal-900 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300",
    };
  }
  if (name.endsWith(".route.js")) {
    return {
      icon: <Code2 size={15} />,
      colorClass: "text-cyan-600 dark:text-cyan-400",
      badge: "Route",
      badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300",
    };
  }
  if (name.endsWith(".test.js")) {
    return {
      icon: <FileCheck size={15} />,
      colorClass: "text-orange-600 dark:text-orange-400",
      badge: "Vitest",
      badgeClass: "bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
    };
  }
  if (name.endsWith(".jsx")) {
    return {
      icon: <FileCode size={15} />,
      colorClass: "text-blue-600 dark:text-blue-400",
      badge: "React",
      badgeClass: "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300",
    };
  }
  if (name.endsWith(".json")) {
    return {
      icon: <FileJson size={15} />,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      badge: "JSON",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
    };
  }
  if (name.endsWith(".md")) {
    return {
      icon: <FileText size={15} />,
      colorClass: "text-purple-600 dark:text-purple-400",
      badge: "Markdown",
      badgeClass: "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300",
    };
  }
  return {
    icon: <FileCode size={15} />,
    colorClass: "text-slate-600 dark:text-slate-400",
    badge: null,
    badgeClass: "",
  };
};

// Recursive Tree Node Component with High-Contrast Day Mode
const TreeNode = ({ node, defaultExpanded = false, level = 0 }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isFolder = node.type === "folder";
  const fileMeta = !isFolder ? getFileMeta(node.name) : null;

  return (
    <div
      className={`space-y-2 ${
        level > 0
          ? "ml-3 sm:ml-6 border-l-2 border-slate-300 dark:border-slate-700 pl-3 sm:pl-4 transition"
          : ""
      }`}
    >
      <div
        onClick={() => isFolder && setExpanded(!expanded)}
        className={`flex items-start justify-between gap-3 p-3 rounded-2xl transition border-2 ${
          isFolder
            ? "cursor-pointer bg-amber-50/60 hover:bg-amber-100/70 border-amber-200/90 shadow-xs dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:border-slate-800"
            : "bg-white hover:bg-blue-50/50 border-slate-200/90 hover:border-blue-400 shadow-xs dark:bg-slate-900/40 dark:border-slate-800/80 dark:hover:border-slate-700"
        }`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-0.5 shrink-0">
            {isFolder ? (
              expanded ? (
                <FolderOpen size={18} className="text-amber-500 dark:text-amber-400 drop-shadow-xs" />
              ) : (
                <Folder size={18} className="text-amber-600 dark:text-amber-500 drop-shadow-xs" />
              )
            ) : (
              <span className={fileMeta.colorClass}>{fileMeta.icon}</span>
            )}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono text-xs ${
                  isFolder
                    ? "font-black text-slate-950 dark:text-white"
                    : "font-bold text-slate-900 dark:text-slate-100"
                }`}
              >
                {node.name}
              </span>

              {/* Badges */}
              {node.badge && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-900 dark:bg-indigo-500/20 dark:text-cyan-400 border border-indigo-300 dark:border-indigo-500/30">
                  {node.badge}
                </span>
              )}

              {fileMeta?.badge && (
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold border ${fileMeta.badgeClass}`}>
                  {fileMeta.badge}
                </span>
              )}

              {node.size > 0 && (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                  {(node.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>

            {node.desc && (
              <p className="text-xs text-slate-700 font-medium dark:text-slate-300 mt-1 leading-snug">
                {node.desc}
              </p>
            )}
          </div>
        </div>

        {isFolder && node.children && (
          <span className="text-slate-600 dark:text-slate-400 shrink-0 mt-1 font-bold">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </div>

      {/* Children list */}
      {isFolder && expanded && node.children && (
        <div className="space-y-2 pt-1">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} defaultExpanded={false} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderStructure;
