import React, { useState } from "react";
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
  Eye,
  Activity,
  Maximize2,
  RefreshCw,
  Sliders,
  Info,
  Laptop,
  Building2,
  Crown,
  Share2,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

/**
 * ============================================================================
 * 📐 2D INTERACTIVE SYSTEM ARCHITECTURE BLUEPRINT VIEWER
 * ============================================================================
 * Dual-Theme Enabled (100% High-Contrast Day & Night Mode Visual Schematics)
 * Features 6 high-fidelity 2D architectural blueprints:
 * 1. 🌐 Full Project End-to-End System Blueprint
 * 2. 👤 Candidate Dashboard & Career Hub Blueprint
 * 3. 🏢 Recruiter Command Center & Kanban Pipeline Blueprint
 * 4. 👑 Super Admin Governance Console Blueprint
 * 5. ⚙️ Backend Engine, Middleware Stack & API Connections Blueprint
 * 6. 💻 Frontend Whole SPA Architecture Blueprint
 */

const BLUEPRINT_PRESETS = [
  {
    id: "project",
    label: "Full Project Blueprint",
    tag: "End-to-End MERN",
    icon: Globe,
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/10 dark:text-cyan-400 dark:border-blue-500/20",
    description: "Holistic 2D blueprint of the entire NextHire platform connecting Browser Clients, Vite Frontend, Express 5 API Gateway, MongoDB Atlas, Gemini AI Cascade, and Cloudinary CDN.",
  },
  {
    id: "candidate",
    label: "Candidate Dashboard",
    tag: "Candidate Tier",
    icon: Laptop,
    color: "from-cyan-600 to-blue-600",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20",
    description: "Detailed 2D blueprint of the Candidate Experience: DNA Radar, Resume PDF Center, Applied Jobs Tracker, Skill Quizzes, and Gemini AI Career Coach.",
  },
  {
    id: "recruiter",
    label: "Recruiter Command Center",
    tag: "Recruiter Tier",
    icon: Building2,
    color: "from-indigo-600 to-violet-600",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    description: "Detailed 2D blueprint of the Recruiter Workflow: 5-Stage Kanban Board, Talent Funnel, AI Candidate Ranking, Google Meet Scheduling, and Candidate Skill Broadcast.",
  },
  {
    id: "admin",
    label: "Super Admin Console",
    tag: "Governance Tier",
    icon: Crown,
    color: "from-purple-600 to-pink-600",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    description: "Detailed 2D blueprint of Super Admin Governance: Platform KPI Metrics, User/Recruiter Moderation, KYC Verification (Aadhaar & PAN), Support Tickets, and Live Codebase Explorer.",
  },
  {
    id: "backend",
    label: "Backend Details & Connections",
    tag: "Server & Persistence",
    icon: Server,
    color: "from-emerald-600 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    description: "Deep 2D architectural blueprint of server.js, app.js, the 8-stage middleware pipeline, 15 REST route gateways, background workers, and Mongoose 9 models.",
  },
  {
    id: "frontend",
    label: "Frontend Whole Architecture",
    tag: "Client SPA Structure",
    icon: Code2,
    color: "from-amber-600 to-orange-600",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    description: "Complete 2D component and data architecture of the React 19 SPA: Root router, ProtectedRoute guards, global contexts, page components, and Axios API layer.",
  },
];

// Node Detail Registry for interactive inspection on click
const NODE_DETAILS = {
  // Project Blueprint Nodes
  "browser-client": {
    title: "Client Web Browsers",
    type: "Presentation Tier",
    file: "Desktop / Tablet / Smartphone (350px+ Viewports)",
    port: "Port 5173 / 443 HTTPS",
    protocol: "HTTPS / REST / WSS",
    desc: "End-user interactive browser clients accessing NextHire on desktop monitors, tablets, and smartphones (350px responsive).",
    contract: "HTTP GET/POST/PUT/DELETE with withCredentials: true (HttpOnly JWT cookies)",
  },
  "vite-spa": {
    title: "Vite v8 + React 19 Client SPA",
    type: "Frontend Runtime",
    file: "frontend/src/App.jsx & main.jsx",
    port: "http://localhost:5173",
    protocol: "ESM / Vite HMR",
    desc: "Single Page Application bundled with Vite v8 and styled with Tailwind CSS v3 (Day/Night ThemeContext).",
    contract: "Communicates with API Gateway via Axios client configured at frontend/src/lib/api.js",
  },
  "api-gateway": {
    title: "Express 5 API Gateway (server.js + app.js)",
    type: "Backend Runtime",
    file: "Backend/server.js & Backend/app.js",
    port: "http://localhost:5000/api",
    protocol: "HTTP/1.1 REST",
    desc: "Central entrypoint with process lifecycle, MongoDB connection, and modular security middleware stack.",
    contract: "Accepts JSON bodies (10MB limit), multipart/form-data, and cookie-based JWT authentication.",
  },
  "middleware-suite": {
    title: "Enterprise Middleware Suite",
    type: "Edge Security & Validation",
    file: "Backend/middleware/*.middleware.js",
    port: "Internal Pipeline",
    protocol: "Express Middleware Chain",
    desc: "8 modular middlewares: security, cors, rateLimiter, isAuthenticated, multer, validate, errorHandler, notFound.",
    contract: "Protects routes, verifies JWT tokens, catches MongoDB 11000 duplicate keys, and handles file buffers.",
  },
  "mongodb-atlas": {
    title: "MongoDB Atlas & Mongoose 9 ODM",
    type: "Persistence Database",
    file: "Backend/models/*.model.js",
    port: "mongodb://...:27017",
    protocol: "MongoDB Wire Protocol v6+",
    desc: "Relational persistence using Mongoose 9 with compound unique indexes { job: 1, applicant: 1 } and atomic operators.",
    contract: "Stores Users, Jobs, Applications, Hackathons, Quizzes, Contacts, OTPs, and Job Alerts.",
  },
  "gemini-ai": {
    title: "Google Gemini Multi-Model AI Cascade",
    type: "Artificial Intelligence Tier",
    file: "Backend/controllers/ai.controller.js",
    port: "HTTPS Google GenAI API",
    protocol: "REST / JSON",
    desc: "Automated cascading failover: flash-lite -> flash -> 2.5-flash -> 3.6-flash. Strict plain-text sanitization.",
    contract: "Powers Career DNA Radar, Resume ATS parser, Job Description drafter, and Candidate Match score.",
  },
  "cloudinary-cdn": {
    title: "Cloudinary RAW & Image CDN",
    type: "Object Storage & Binary CDN",
    file: "Backend/utils/cloud.js & datauri.js",
    port: "res.cloudinary.com",
    protocol: "HTTPS CDN",
    desc: "Stores applicant resume PDFs with resource_type: 'raw' to guarantee inline browser PDF previews without corruption.",
    contract: "Proxied via /api/application/download-resume/:id with IDOR recruiter authorization.",
  },
  "smtp-service": {
    title: "Gmail SMTP & Calendar Generator",
    type: "Notification Subsystem",
    file: "Backend/utils/emailService.js & emailTemplates.js",
    port: "smtp.gmail.com:465",
    protocol: "SMTP SSL/TLS",
    desc: "Sends real-time Login Security Alerts, Registration Welcome Greetings, OTP verification codes, and Google Meet calendar (.ics) files.",
    contract: "Triggered non-blocking via sendEmail() in controllers.",
  },

  // Candidate Dashboard Nodes
  "cand-dna": {
    title: "Career DNA Index & Vector Radar",
    type: "Candidate Analytics",
    file: "frontend/src/components/candidate/SkillRadar.jsx",
    endpoint: "GET /api/ai/career-dna",
    model: "User.profile.skills & Applications",
    desc: "Computes 6-dimensional spider competency radar (Engineering, Architecture, DevOps, AI, Product, Domain) against 2030 industry benchmark.",
  },
  "cand-resume": {
    title: "Active Resume PDF Center",
    type: "Candidate Document Viewer",
    file: "frontend/src/components/candidate/ActiveResumePdfCenter.jsx",
    endpoint: "GET /api/user/my-resume?view=true",
    model: "User.profile.resume",
    desc: "Full inline PDF viewer with zoom controls, page navigation, and 1-click download streamed through authenticated backend proxy.",
  },
  "cand-applied": {
    title: "Applied Jobs Interactive Accordion",
    type: "Candidate Application Tracker",
    file: "frontend/src/components/candidate/AppliedJobsAccordion.jsx",
    endpoint: "GET /api/application/get",
    model: "Application & Job [company populated]",
    desc: "Real-time hiring funnel status (Pending -> Shortlisted -> Interview -> Hired/Rejected) with recruiter feedback cards and Google Meet joiner.",
  },
  "cand-opps": {
    title: "Candidate Opportunities Hub",
    type: "Competency & Badges",
    file: "frontend/src/components/candidate/CandidateOpportunitiesWidget.jsx",
    endpoint: "GET /api/hackathon/get & /api/quiz/get",
    model: "Hackathon & Quiz",
    desc: "Live interactive widget to register for hackathons, take timed technical quizzes, and earn verified skill badges.",
  },
  "cand-coach": {
    title: "AI Career Coach & Interview Simulator",
    type: "Candidate AI Advisory",
    file: "frontend/src/components/ai-coach/AICareerCoach.jsx",
    endpoint: "POST /api/ai/career-coach & /api/ai/interview-prep",
    model: "Gemini 2.5 Flash",
    desc: "Conversational career strategist, role-tailored technical interview simulator, and salary negotiation counter-offer drafter.",
  },

  // Recruiter Dashboard Nodes
  "rec-kanban": {
    title: "5-Stage Interactive Kanban Pipeline",
    type: "Recruitment Pipeline",
    file: "frontend/src/components/pipeline/KanbanPipelineBoard.jsx",
    endpoint: "POST /api/application/status/:id/update",
    model: "Application.status [pending, shortlisted, interview, hired, rejected]",
    desc: "Drag-and-drop / 1-click candidate progression across 5 stages with feedback reasons and automated Google Meet calendar scheduling.",
  },
  "rec-ranker": {
    title: "AI Applicant Ranking Engine",
    type: "Recruiter AI Tool",
    file: "frontend/src/components/pipeline/KanbanPipelineBoard.jsx",
    endpoint: "POST /api/ai/rank-candidates",
    model: "pdf-parse-fork + Gemini Match",
    desc: "Analyzes full parsed resume PDF text against required job specifications to calculate match percentage (e.g. 94% Compatibility).",
  },
  "rec-meet": {
    title: "Recruiter Self-Host Google Meet Scheduler",
    type: "Interview Automation",
    file: "frontend/src/components/pipeline/InterviewSchedulerModal.jsx",
    endpoint: "POST /api/interview/schedule",
    model: "Interview & Notification",
    desc: "Recruiter enters their personal Google Meet link, date, and time. Sends instant email invite with RFC 5545 iCalendar (.ics) attachment.",
  },
  "rec-broadcast": {
    title: "Skill-Match Candidate Alert Broadcast",
    type: "Candidate Outreach",
    file: "frontend/src/components/pipeline/BroadcastModal.jsx",
    endpoint: "POST /api/job/broadcast/:id",
    model: "Job & User.profile.skills",
    desc: "Identifies top matched active candidates on the platform and blasts personalized email job notifications with AI-crafted pitch notes.",
  },
  "rec-opps": {
    title: "Recruiter Opportunities Hub",
    type: "Event Host & Quizzes",
    file: "frontend/src/components/recruiter/RecruiterOpportunitiesHub.jsx",
    endpoint: "POST /api/hackathon/create & /api/quiz/create",
    model: "Hackathon & Quiz",
    desc: "Allows recruiters to post hiring hackathons, create interactive skill quizzes, and filter top-ranking participants for interviews.",
  },

  // Super Admin Nodes
  "admin-kpi": {
    title: "Platform Overview & KPI Metrics",
    type: "Admin Analytics",
    file: "frontend/src/components/admin/OverviewTab.jsx",
    endpoint: "GET /api/admin/overview",
    model: "User, Job, Application, Contact aggregates",
    desc: "Live operational counters: Total Candidates, Verified Recruiters, Open Jobs, and Ticket Resolution percentage with growth sparklines.",
  },
  "admin-kyc": {
    title: "Recruiter KYC & Account Moderation",
    type: "Admin Verification Desk",
    file: "frontend/src/components/admin/RecruitersTab.jsx",
    endpoint: "GET /api/admin/recruiters & PUT /api/admin/recruiters/:id/status",
    model: "User.adharcard & User.pancard",
    desc: "Dedicated desk to inspect recruiter Aadhaar & PAN card verification details, audit companies, and toggle account activation.",
  },
  "admin-tickets": {
    title: "Support Tickets Resolution Desk",
    type: "Admin Support Desk",
    file: "frontend/src/components/admin/TicketsDesk.jsx",
    endpoint: "GET /api/admin/tickets & PUT /api/admin/tickets/:id/resolve",
    model: "Contact [ticketId: TKT-XXXXXX]",
    desc: "Mongoose 9 pre-save ticket generator with resolution notes and automated candidate resolution confirmation emails.",
  },
  "admin-codebase": {
    title: "Live Filesystem Explorer & Blueprints",
    type: "Admin System Tool",
    file: "frontend/src/pages/FolderStructure.jsx & ArchitectureDiagram.jsx",
    endpoint: "GET /api/system/codebase-tree",
    model: "Live OS Filesystem (fs.readdirSync)",
    desc: "Real-time interactive blueprint of all files and folders in NextHire with search, depth filters, and ASCII tree generator.",
  },
};

const Blueprint2DViewer = () => {
  const toast = useToast();
  const [activeBlueprint, setActiveBlueprint] = useState("project");
  const [isLiveSimulation, setIsLiveSimulation] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState("auto"); // "auto" | "drafting-light" | "cad-navy"

  const currentPreset = BLUEPRINT_PRESETS.find((p) => p.id === activeBlueprint) || BLUEPRINT_PRESETS[0];

  const handleNodeClick = (nodeKey) => {
    if (NODE_DETAILS[nodeKey]) {
      setSelectedNode({ key: nodeKey, ...NODE_DETAILS[nodeKey] });
    }
  };

  const copyBlueprintSpec = () => {
    const spec = `NextHire 2D Architectural Blueprint (${currentPreset.label}):
- Subsystem: ${currentPreset.label} [${currentPreset.tag}]
- Scope: ${currentPreset.description}
- Active Live Simulation: ${isLiveSimulation ? "Enabled (Streaming simulated traffic packets)" : "Static Blueprint"}
- Canvas Theme: ${canvasTheme}
- Generated by: NextHire Enterprise Architecture Subsystem`;
    navigator.clipboard.writeText(spec);
    setCopiedSpec(true);
    toast.success(`Copied ${currentPreset.label} specifications!`);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  // Resolve dynamic canvas classes based on selected theme
  const getCanvasStyles = () => {
    if (canvasTheme === "cad-navy") {
      return {
        container: "bg-[#0A192F] border-2 border-blue-500/50 shadow-2xl text-white",
        gridLine: "rgba(96, 165, 250, 0.22)",
        watermark: "text-cyan-400 font-black",
        subtext: "text-blue-200",
      };
    }
    if (canvasTheme === "drafting-light") {
      return {
        container: "bg-slate-100 border-2 border-slate-300 shadow-inner text-slate-950",
        gridLine: "rgba(30, 58, 138, 0.16)",
        watermark: "text-blue-900 font-black",
        subtext: "text-slate-700",
      };
    }
    // "auto" (default responsive)
    return {
      container: "bg-slate-100/95 border-2 border-slate-300 shadow-sm dark:bg-slate-950 dark:border-slate-800 text-slate-950 dark:text-white",
      gridLine: "rgba(37, 99, 235, 0.16)",
      watermark: "text-blue-900 dark:text-cyan-400 font-black",
      subtext: "text-slate-700 dark:text-slate-400",
    };
  };

  const canvasStyleConfig = getCanvasStyles();

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold border shadow-xs ${currentPreset.badgeColor}`}>
                <Activity size={12} className={isLiveSimulation ? "animate-pulse text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                <span>{currentPreset.tag}</span>
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                2D Interactive Visual Schematics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              {currentPreset.label}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl mt-1 leading-relaxed font-medium">
              {currentPreset.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Color Theme Style Selector Pill */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
              <span className="text-[10.5px] font-black text-slate-600 dark:text-slate-400 px-2 hidden sm:inline">Color:</span>
              <button
                type="button"
                onClick={() => setCanvasTheme("auto")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition ${
                  canvasTheme === "auto"
                    ? "bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-cyan-400"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setCanvasTheme("drafting-light")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition ${
                  canvasTheme === "drafting-light"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Technical Light
              </button>
              <button
                type="button"
                onClick={() => setCanvasTheme("cad-navy")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition ${
                  canvasTheme === "cad-navy"
                    ? "bg-[#0A192F] text-cyan-300 border border-cyan-400/40 shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                CAD Blueprint
              </button>
            </div>

            {/* Live Traffic Simulation Toggle */}
            <button
              onClick={() => setIsLiveSimulation(!isLiveSimulation)}
              type="button"
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition border-2 shadow-xs ${
                isLiveSimulation
                  ? "bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              <Activity size={14} className={isLiveSimulation ? "animate-spin text-emerald-700 dark:text-emerald-400" : ""} />
              <span>{isLiveSimulation ? "Live Traffic: ON" : "Live Traffic: OFF"}</span>
            </button>

            {/* Copy Spec Button */}
            <button
              onClick={copyBlueprintSpec}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition shadow-xs"
            >
              {copiedSpec ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedSpec ? "Copied" : "Copy Spec"}</span>
            </button>
          </div>
        </div>

        {/* Blueprint Preset Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          {BLUEPRINT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = activeBlueprint === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setActiveBlueprint(preset.id);
                  setSelectedNode(null);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-950 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-white shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                }`}
              >
                <div className={`p-2 rounded-xl mb-1.5 transition ${
                  isSelected
                    ? "bg-gradient-to-r text-white shadow-sm " + preset.color
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}>
                  <Icon size={16} />
                </div>
                <span className={`text-[11.5px] font-black line-clamp-1 ${
                  isSelected ? "text-blue-950 dark:text-cyan-300" : "text-slate-900 dark:text-slate-200"
                }`}>
                  {preset.label}
                </span>
                <span className="text-[9.5px] text-slate-600 dark:text-slate-400 font-extrabold">
                  {preset.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blueprint Grid & Vector Canvas Area */}
      <div className={`relative rounded-3xl p-4 sm:p-8 overflow-hidden min-h-[580px] flex flex-col justify-between transition-colors ${canvasStyleConfig.container}`}>
        {/* Architectural Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${canvasStyleConfig.gridLine} 1px, transparent 1px),
              linear-gradient(to bottom, ${canvasStyleConfig.gridLine} 1px, transparent 1px)
            `,
            backgroundSize: "26px 26px",
          }}
        />

        {/* Blueprint Header Watermark */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-slate-300/80 dark:border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping" />
            <span className={`font-mono text-[11px] font-black uppercase tracking-widest ${canvasStyleConfig.watermark}`}>
              NEXTHIRE BLUEPRINT // {currentPreset.id.toUpperCase()} // REV 2026.9
            </span>
          </div>
          <span className={`font-mono text-[10px] font-extrabold hidden sm:inline-block ${canvasStyleConfig.subtext}`}>
            CLICK ANY NODE TO INSPECT CONTRACT DETAILS
          </span>
        </div>
        {/* ========================================================================= */}
        {/* 1. FULL PROJECT END-TO-END BLUEPRINT SCHEMATIC */}
        {/* ========================================================================= */}
        {activeBlueprint === "project" && (
          <div className="relative z-10 space-y-8 py-2">
            {/* ROW 1: PRESENTATION & CLIENT BROWSER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => handleNodeClick("browser-client")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-blue-500/40 bg-white dark:bg-slate-900/90 hover:border-blue-600 shadow-md hover:shadow-xl transition relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white dark:bg-blue-500/20 dark:text-cyan-300 font-mono text-[10px] font-black shadow-xs">CLIENT LAYER</span>
                  <Globe size={18} className="text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Browser Clients (Desktop & Mobile)</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Single Page App session with secure HttpOnly cookies and credentials.</p>
                <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono font-black text-blue-900 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  <span>PORT 5173</span> • <span>HTTPS / REST</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("vite-spa")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-cyan-500/40 bg-white dark:bg-slate-900/90 hover:border-teal-600 shadow-md hover:shadow-xl transition relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-700 text-white dark:bg-cyan-500/20 dark:text-cyan-300 font-mono text-[10px] font-black shadow-xs">VITE SPA</span>
                  <Laptop size={18} className="text-teal-700 dark:text-cyan-400 group-hover:scale-110 transition" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">React 19 + Tailwind CSS Frontend</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">ProtectedRoute role barriers, AuthContext, ToastContext & Axios client.</p>
                <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono font-black text-teal-900 dark:text-cyan-300 bg-teal-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  <span>src/App.jsx</span> • <span>Router v7</span>
                </div>
              </div>
            </div>

            {/* CONNECTION BUS CONNECTOR */}
            <div className="flex items-center justify-center gap-3 py-1">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-blue-600 to-indigo-600 relative">
                {isLiveSimulation && (
                  <div className="absolute top-[-4px] left-1/2 h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-cyan-300 animate-ping" />
                )}
              </div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-white dark:text-cyan-300 px-4 py-1.5 rounded-full border-2 border-blue-700 dark:border-cyan-500/40 bg-blue-600 dark:bg-slate-900 shadow-md font-black">
                REST API / JSON / Multipart &bull; PORT 5000
              </span>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-transparent relative">
                {isLiveSimulation && (
                  <div className="absolute top-[-4px] left-1/2 h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-300 animate-ping" />
                )}
              </div>
            </div>

            {/* ROW 2: API GATEWAY & ENTERPRISE MIDDLEWARE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => handleNodeClick("api-gateway")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-indigo-500/40 bg-white dark:bg-slate-900/90 hover:border-indigo-600 shadow-md hover:shadow-xl transition relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-300 font-mono text-[10px] font-black shadow-xs">API GATEWAY</span>
                  <Server size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Express 5 (server.js + app.js)</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Modular startup, database init, 15 REST route mounts & /health route.</p>
                <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono font-black text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  <span>Backend/server.js</span> • <span>Backend/app.js</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("middleware-suite")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-purple-500/40 bg-white dark:bg-slate-900/90 hover:border-purple-600 shadow-md hover:shadow-xl transition relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white dark:bg-purple-500/20 dark:text-purple-300 font-mono text-[10px] font-black shadow-xs">SECURITY PIPELINE</span>
                  <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">8-Stage Middleware Stack (*.middleware.js)</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Helmet, CORS allowlist, rateLimiter, JWT authentication, and Zod validators.</p>
                <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono font-black text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  <span>Backend/middleware/</span> • <span>Clean RBAC</span>
                </div>
              </div>
            </div>

            {/* ROW 3: DATABASE PERSISTENCE & CLOUD SERVICES */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div
                onClick={() => handleNodeClick("mongodb-atlas")}
                className="cursor-pointer group p-3.5 rounded-2xl border-2 border-slate-300 dark:border-emerald-500/40 bg-white dark:bg-slate-900/90 hover:border-emerald-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 font-black shadow-xs">PERSISTENCE</span>
                  <Database size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h5 className="font-black text-slate-950 dark:text-white text-xs">MongoDB & Mongoose 9</h5>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-medium">Atomic updates & compound indexes.</p>
              </div>

              <div
                onClick={() => handleNodeClick("gemini-ai")}
                className="cursor-pointer group p-3.5 rounded-2xl border-2 border-slate-300 dark:border-cyan-500/40 bg-white dark:bg-slate-900/90 hover:border-teal-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-teal-700 text-white dark:bg-cyan-500/20 dark:text-cyan-300 font-black shadow-xs">AI ENGINE</span>
                  <Bot size={16} className="text-teal-700 dark:text-cyan-400" />
                </div>
                <h5 className="font-black text-slate-950 dark:text-white text-xs">Gemini AI Cascade</h5>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-medium">Multi-model plain-text fallback.</p>
              </div>

              <div
                onClick={() => handleNodeClick("cloudinary-cdn")}
                className="cursor-pointer group p-3.5 rounded-2xl border-2 border-slate-300 dark:border-blue-500/40 bg-white dark:bg-slate-900/90 hover:border-blue-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-300 font-black shadow-xs">STORAGE</span>
                  <Cloud size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h5 className="font-black text-slate-950 dark:text-white text-xs">Cloudinary RAW CDN</h5>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-medium">PDF/DOCX binary proxy delivery.</p>
              </div>

              <div
                onClick={() => handleNodeClick("smtp-service")}
                className="cursor-pointer group p-3.5 rounded-2xl border-2 border-slate-300 dark:border-amber-500/40 bg-white dark:bg-slate-900/90 hover:border-amber-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white dark:bg-amber-500/20 dark:text-amber-300 font-black shadow-xs">NOTIFICATIONS</span>
                  <Mail size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h5 className="font-black text-slate-950 dark:text-white text-xs">Gmail SMTP & .ICS</h5>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-medium">Security alerts, OTPs & Google Meet.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CANDIDATE DASHBOARD BLUEPRINT SCHEMATIC */}
        {/* ========================================================================= */}
        {activeBlueprint === "candidate" && (
          <div className="relative z-10 space-y-6 py-2">
            <div className="p-4 rounded-2xl border-2 border-teal-500/50 bg-white dark:bg-teal-950/30 flex items-center justify-between shadow-md">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-teal-700 text-white font-mono text-[10px] font-black shadow-xs">ROOT VIEW</span>
                <h3 className="text-slate-950 dark:text-white font-black text-base mt-1">CandidateDashboard.jsx</h3>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">Mounted at /candidate-dashboard with ProtectedRoute (role: student)</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-teal-100 text-teal-950 dark:bg-teal-500/20 dark:text-cyan-300 border-2 border-teal-400 dark:border-teal-500/30 text-xs font-mono font-black shadow-xs">
                5 Subcomponents Connected
              </span>
            </div>

            {/* Candidate Subcomponents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div
                onClick={() => handleNodeClick("cand-dna")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-teal-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-teal-700 text-white font-black shadow-xs">RADAR COMPONENT</span>
                  <Sparkles size={16} className="text-teal-700 dark:text-cyan-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Career DNA & Radar Chart</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">SVG Spider chart visualizing 6 competencies against 2030 benchmark.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-teal-900 dark:text-cyan-300 bg-teal-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  <span>GET /api/ai/career-dna</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("cand-resume")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-blue-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-black shadow-xs">DOCUMENT CENTER</span>
                  <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Active Resume PDF Viewer</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Inline PDF canvas, zoom controls, and Cloudinary binary streaming.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  <span>GET /api/user/my-resume</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("cand-applied")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-indigo-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-black shadow-xs">APPLICATION TRACKER</span>
                  <Activity size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Applied Jobs Accordion</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Funnel stages, recruiter feedback, and 1-click Google Meet joiner.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  <span>GET /api/application/get</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("cand-opps")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-amber-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-xs">OPPORTUNITIES HUB</span>
                  <Zap size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Hackathons, Quizzes & Badges</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Live registration widget, timed skill quizzes, and verified badges.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  <span>GET /api/hackathon/get</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("cand-coach")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-purple-600 shadow-md hover:shadow-xl transition sm:col-span-2 lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-purple-600 text-white font-black shadow-xs">AI SUITE</span>
                  <Bot size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Gemini AI Career Coach Suite</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Conversational career strategist, role-tailored technical interview simulator, and salary negotiation assistant.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  <span>POST /api/ai/career-coach &bull; POST /api/ai/interview-prep</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. RECRUITER COMMAND CENTER BLUEPRINT SCHEMATIC */}
        {/* ========================================================================= */}
        {activeBlueprint === "recruiter" && (
          <div className="relative z-10 space-y-6 py-2">
            <div className="p-4 rounded-2xl border-2 border-indigo-500/50 bg-white dark:bg-indigo-950/30 flex items-center justify-between shadow-md">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-black shadow-xs">ROOT VIEW</span>
                <h3 className="text-slate-950 dark:text-white font-black text-base mt-1">RecruiterDashboard.jsx & RecruiterJobs.jsx</h3>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">Mounted at /recruiter-dashboard with ProtectedRoute (role: recruiter)</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-indigo-100 text-indigo-950 dark:bg-indigo-500/20 dark:text-indigo-300 border-2 border-indigo-400 dark:border-indigo-500/30 text-xs font-mono font-black shadow-xs">
                Kanban + AI Engine
              </span>
            </div>

            {/* Recruiter Workflow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div
                onClick={() => handleNodeClick("rec-kanban")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-indigo-600 shadow-md hover:shadow-xl transition sm:col-span-2"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-black shadow-xs">PIPELINE CORE</span>
                  <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">5-Stage Kanban Hiring Pipeline</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Pending ➔ Shortlisted ➔ Interview ➔ Hired ➔ Rejected columns with multi-select bulk actions and construct rejection reason modals.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  <span>POST /api/application/status/:id/update &bull; POST /api/application/bulk-status</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("rec-ranker")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-teal-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-teal-700 text-white font-black shadow-xs">AI RANKING</span>
                  <Bot size={16} className="text-teal-700 dark:text-cyan-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">AI Candidate Ranking Engine</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Downloads parsed PDF text from Cloudinary, scores against JD, and calculates match compatibility badge.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-teal-900 dark:text-cyan-300 bg-teal-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  <span>POST /api/ai/rank-candidates</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("rec-meet")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-blue-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-black shadow-xs">MEETING ENGINE</span>
                  <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Google Meet & Calendar Automation</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Recruiter self-host meeting URL input with automatic RFC 5545 .ics invite delivery.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  <span>POST /api/interview/schedule</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("rec-broadcast")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-rose-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-black shadow-xs">DIRECT OUTREACH</span>
                  <Zap size={16} className="text-rose-600 dark:text-rose-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Skill-Match Alert Blast</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Broadcasts job notification email to top candidates matching target tech stack.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                  <span>POST /api/job/broadcast/:id</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("rec-opps")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-amber-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-xs">OPPORTUNITIES HOST</span>
                  <Building2 size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Hackathons & Quizzes Hub</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Host branded hackathons, post skill quizzes, and filter top performers.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  <span>POST /api/hackathon/create</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. SUPER ADMIN CONSOLE BLUEPRINT SCHEMATIC */}
        {/* ========================================================================= */}
        {activeBlueprint === "admin" && (
          <div className="relative z-10 space-y-6 py-2">
            <div className="p-4 rounded-2xl border-2 border-purple-500/50 bg-white dark:bg-purple-950/30 flex items-center justify-between shadow-md">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-black shadow-xs">MASTER CONSOLE</span>
                <h3 className="text-slate-950 dark:text-white font-black text-base mt-1">AdminDashboard.jsx</h3>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">Dedicated master console view with strict role: admin barrier and zero-leakage guards</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-950 dark:bg-purple-500/20 dark:text-purple-300 border-2 border-purple-400 dark:border-purple-500/30 text-xs font-mono font-black shadow-xs">
                Full Governance
              </span>
            </div>

            {/* Admin Desk Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div
                onClick={() => handleNodeClick("admin-kpi")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-purple-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-purple-600 text-white font-black shadow-xs">OVERVIEW DESK</span>
                  <Activity size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Platform KPI Metrics</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Total Candidates, Active Recruiters, Open Jobs & Ticket resolution counters.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  <span>GET /api/admin/overview</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("admin-kyc")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-emerald-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-black shadow-xs">KYC DESK</span>
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Recruiter KYC Verification</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Audit Aadhaar & PAN card inputs, inspect company registrations, toggle suspension.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <span>GET /api/admin/recruiters</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("admin-tickets")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-blue-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-black shadow-xs">SUPPORT DESK</span>
                  <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Support Tickets Desk</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Resolve candidate/recruiter queries with resolution notes and email confirmations.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  <span>GET /api/admin/tickets</span>
                </div>
              </div>

              <div
                onClick={() => handleNodeClick("admin-codebase")}
                className="cursor-pointer group p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-amber-600 shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-xs">SYSTEM AUDIT</span>
                  <FolderTree size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm">Codebase Blueprint Explorer</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Live filesystem tree sync, node inspect, and ASCII directory tree visualizer.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-black text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  <span>GET /api/system/codebase-tree</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. BACKEND DETAILS & CONNECTIONS BLUEPRINT SCHEMATIC */}
        {/* ========================================================================= */}
        {activeBlueprint === "backend" && (
          <div className="relative z-10 space-y-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SERVER.JS */}
              <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-emerald-500/40 bg-white dark:bg-emerald-950/20 shadow-md">
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-black shadow-xs">ENTRY POINT 1</span>
                <h4 className="text-slate-950 dark:text-white font-black text-sm mt-1">Backend/server.js</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Bootstrap script that connects MongoDB, verifies SMTP, initializes automation engine, and listens on PORT 5000 with SIGTERM/SIGINT handlers.</p>
              </div>

              {/* APP.JS */}
              <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-emerald-500/40 bg-white dark:bg-emerald-950/20 shadow-md">
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-black shadow-xs">ENTRY POINT 2</span>
                <h4 className="text-slate-950 dark:text-white font-black text-sm mt-1">Backend/app.js</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Pure Express 5 application setup that mounts modular middlewares, health routes (/health, /api/health), 15 route groups, and centralized error handler.</p>
              </div>

              {/* HEALTH ROUTE */}
              <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-emerald-500/40 bg-white dark:bg-emerald-950/20 shadow-md">
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-black shadow-xs">DIAGNOSTICS</span>
                <h4 className="text-slate-950 dark:text-white font-black text-sm mt-1">GET /health & /api/health</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Returns status: "ok", timestamp (ISO string), uptime (process.uptime()), and success: true for load balancers & monitoring.</p>
              </div>
            </div>

            {/* 8 MODULAR MIDDLEWARES */}
            <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-md space-y-3">
              <span className="text-emerald-950 dark:text-emerald-400 font-mono text-xs font-black uppercase tracking-wider">
                Modular Middleware Stack (Backend/middleware/*.middleware.js)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">security.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">Helmet HTTP headers & CORP</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">cors.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">Credentials & Origin Allowlist</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">rateLimiter.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">General 300 / Auth 30 limits</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">isAuthenticated.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">JWT, authorizeRoles & optionalAuth</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">multer.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">10MB Memory buffer file uploads</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">validate.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">Zod schema body/query validation</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">errorHandler.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">Mongoose 11000 & CastError catch</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11px]">notFound.middleware.js</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">Express 5 compatible 404 handler</p>
                </div>
              </div>
            </div>

            {/* 15 ROUTE GATEWAYS */}
            <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-md space-y-2">
              <span className="text-emerald-950 dark:text-emerald-400 font-mono text-xs font-black uppercase tracking-wider">
                15 Mounted REST Route Gateways (/api/*)
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-[10.5px]">
                {["user", "company", "job", "application", "ai", "notification", "newsletter", "contact", "admin", "ats", "job-alert", "hackathon", "quiz", "system", "automation", "interview"].map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-slate-950 border-2 border-blue-300 dark:border-slate-800 text-blue-950 dark:text-cyan-300 font-black shadow-2xs">
                    /api/{r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. FRONTEND WHOLE ARCHITECTURE BLUEPRINT SCHEMATIC */}
        {/* ========================================================================= */}
        {activeBlueprint === "frontend" && (
          <div className="relative z-10 space-y-6 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-amber-500/40 bg-white dark:bg-amber-950/20 shadow-md">
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-xs">STATE TIER</span>
                <h4 className="text-slate-950 dark:text-white font-black text-sm mt-1">Global Context Tree</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">AuthContext (JWT session state & user data), ThemeContext (Day/Night mode synchronizer), ToastContext (Zero-Alert enterprise notifications).</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-amber-500/40 bg-white dark:bg-amber-950/20 shadow-md">
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-xs">ROUTING TIER</span>
                <h4 className="text-slate-950 dark:text-white font-black text-sm mt-1">ProtectedRoute Guards</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">URL-level access barriers intercepting candidate, recruiter, and admin views with seamless redirection to authentication modals.</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-amber-500/40 bg-white dark:bg-amber-950/20 shadow-md">
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-xs">NETWORK TIER</span>
                <h4 className="text-slate-950 dark:text-white font-black text-sm mt-1">Axios Interceptors</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium leading-relaxed">Configured at frontend/src/lib/api.js with withCredentials: true, baseURL auto-resolution, and 401 session expiry catchers.</p>
              </div>
            </div>

            {/* Component Tree Breakdown */}
            <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-md space-y-3">
              <span className="text-amber-950 dark:text-amber-400 font-mono text-xs font-black uppercase tracking-wider">
                Domain-Grouped Atomic Component Libraries (frontend/src/components/)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11.5px]">candidate/</p>
                  <p className="text-[10.5px] text-slate-700 dark:text-slate-400 font-medium">SkillRadar, ResumePdfCenter, AppliedJobs</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11.5px]">pipeline/ & recruiter/</p>
                  <p className="text-[10.5px] text-slate-700 dark:text-slate-400 font-medium">KanbanPipeline, MeetScheduler, Broadcast</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11.5px]">admin/</p>
                  <p className="text-[10.5px] text-slate-700 dark:text-slate-400 font-medium">Overview, KYC Desk, TicketsDesk, Opps</p>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="font-black text-slate-950 dark:text-white text-[11.5px]">ai-coach/ & ats/</p>
                  <p className="text-[10.5px] text-slate-700 dark:text-slate-400 font-medium">AICareerCoach, ATSResumeChecker</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blueprint Footer Status Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t-2 border-slate-300 dark:border-slate-800 pt-3 mt-4 text-[11px] font-mono text-slate-900 dark:text-slate-300 gap-2 font-black">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>TOPOLOGY HEALTH: 100% OPERATIONAL</span>
          </div>
          <div>
            <span>NODE COUNT: {Object.keys(NODE_DETAILS).length} REGISTERED COMPONENTS</span>
          </div>
        </div>
      </div>

      {/* Node Detail Slide-Over Inspector Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border-2 border-slate-300 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-cyan-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {selectedNode.type}
                  </span>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mt-1">
                    {selectedNode.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-xl p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedNode.desc}
              </p>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950 space-y-2 text-xs font-mono">
                {selectedNode.file && (
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-400">
                    <span className="font-black">File:</span>
                    <span className="text-slate-950 dark:text-slate-200 text-[11px] truncate max-w-[280px] font-bold">{selectedNode.file}</span>
                  </div>
                )}
                {selectedNode.endpoint && (
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-400">
                    <span className="font-black">Endpoint:</span>
                    <span className="text-blue-800 dark:text-cyan-400 text-[11.5px] font-black">{selectedNode.endpoint}</span>
                  </div>
                )}
                {selectedNode.port && (
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-400">
                    <span className="font-black">Port/Protocol:</span>
                    <span className="text-indigo-800 dark:text-indigo-400 text-[11.5px] font-black">{selectedNode.port}</span>
                  </div>
                )}
                {selectedNode.model && (
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-400">
                    <span className="font-black">Model Schema:</span>
                    <span className="text-emerald-800 dark:text-emerald-400 text-[11.5px] font-black">{selectedNode.model}</span>
                  </div>
                )}
                {selectedNode.contract && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-400">
                    <span className="font-black block mb-1">Contract / Wire Spec:</span>
                    <span className="text-[11px] text-slate-900 dark:text-slate-200 leading-relaxed font-sans font-medium">{selectedNode.contract}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-black text-white hover:bg-blue-700 dark:bg-white dark:text-slate-950 shadow-md transition"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blueprint2DViewer;
