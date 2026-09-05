# 🚀 Job Portal Platform — Complete Engineering & Feature Changelog

Documenting all features, architectural upgrades, security hardening, AI capabilities, and workflow enhancements implemented across the **Job Portal** full-stack production application.

---

## 📑 Table of Contents

1. [Backend Hardening & Zero-Vulnerability Core](#1-backend-hardening--zero-vulnerability-core)
2. [Cloudinary & Resume PDF Engine (Failed to Load Fix)](#2-cloudinary--resume-pdf-engine-failed-to-load-fix)
3. [Recruiter Pipeline & Status Decision Workflow](#3-recruiter-pipeline--status-decision-workflow)
4. [Post-Acceptance Next Steps & Interview Scheduling](#4-post-acceptance-next-steps--interview-scheduling)
5. [Candidate Application Review & Drag-and-Drop Resume](#5-candidate-application-review--drag-and-drop-resume)
6. [Gemini AI Integrations (Plain-Text Everywhere)](#6-gemini-ai-integrations-plain-text-everywhere)
7. [Database Atomicity & Legacy Schema Resilience](#7-database-atomicity--legacy-schema-resilience)
8. [Frontend Aesthetics & Production UI/UX](#8-frontend-aesthetics--production-uiux)
9. [API Endpoint Directory](#9-api-endpoint-directory)
10. [2030 SaaS Visual Design System & Role Layouts (Phase 1)](#10-2030-saas-visual-design-system--role-layouts-phase-1)
11. [Candidate Career Intelligence Hub & Competency Radar (Phase 2)](#11-candidate-career-intelligence-hub--competency-radar-phase-2)
12. [Recruiter Command Center, Kanban Pipeline & AI Ranking (Phase 3)](#12-recruiter-command-center-kanban-pipeline--ai-ranking-phase-3)
13. [Enhanced Job Discovery & Bookmarking Engine (Phase 4)](#13-enhanced-job-discovery--bookmarking-engine-phase-4)
14. [AI Career Coach Suite (Phase 5)](#14-ai-career-coach-suite-phase-5)
15. [Real-Time Event Notifications & Activity Subsystem (Phase 6)](#15-real-time-event-notifications--activity-subsystem-phase-6)
16. [Complete API Endpoint Directory](#16-complete-api-endpoint-directory)
17. [Day & Night Theme System & Tailwind CSS Architecture (Phase 7)](#17-day--night-theme-system--tailwind-css-architecture-phase-7)
18. [Candidate Dashboard Active Resume PDF Center (Phase 8)](#18-candidate-dashboard-active-resume-pdf-center-phase-8)
19. [Contact Us Mongoose 9 Compatibility Fix](#19-contact-us-mongoose-9-compatibility-fix)
20. [Super Admin Console & Recruiter Company Resolution](#20-super-admin-console--recruiter-company-resolution)
21. [Recruiter Company Details Update Feature (Company Directory)](#21-recruiter-company-details-update-feature-company-directory)
22. [Super Admin Isolation & Dedicated Master Credentials](#22-super-admin-isolation--dedicated-master-credentials)
23. [Super Admin Profile Streamlining & AI Bio Crash Fix](#23-super-admin-profile-streamlining--ai-bio-crash-fix)
24. [Super Admin Panel Full-Console View & Footer Concealment](#24-super-admin-panel-full-console-view--footer-concealment)
25. [Registration Role Isolation & Recruiter-Only KYC (Aadhaar & PAN)](#25-registration-role-isolation--recruiter-only-kyc-aadhaar--pan)
26. [Complete Production Authentication Suite: OTP, Google OAuth, Recovery & Anti-Bot Protection](#26-complete-production-authentication-suite-otp-google-oauth-recovery--anti-bot-protection)
27. [Modular Enterprise ATS Resume Checker & STAR Optimizer](#27-modular-enterprise-ats-resume-checker--star-optimizer)
28. [Modular Automated Job Alerts & Email Digest Engine](#28-modular-automated-job-alerts--email-digest-engine)
29. [Dashboard Layout Harmony & Dynamic System Theme Auto-Sync](#29-dashboard-layout-harmony--dynamic-system-theme-auto-sync)
30. [Candidate Applied Jobs Interactive Accordion Suite](#30-candidate-applied-jobs-interactive-accordion-suite)
31. [Recruiter Direct Candidate Alert Broadcast & Skill Match Blast Engine](#31-recruiter-direct-candidate-alert-broadcast--skill-match-blast-engine)
32. [Universal Cyber Loader, 404 NotFound & Global Error Boundary](#32-universal-cyber-loader-404-notfound--global-error-boundary)
33. [Strict Role-Based Protected Routes & URL Access Guards](#33-strict-role-based-protected-routes--url-access-guards)
34. [AI-Powered Broadcast Message Generator & Polisher](#34-ai-powered-broadcast-message-generator--polisher)
35. [Queued & Upcoming Production Roadmap](#35-queued--upcoming-production-roadmap)
36. [Vite Bundle Optimization & Production Code Splitting](#36-vite-bundle-optimization--production-code-splitting)
37. [Production Automation Engine & Autonomous Recruitment Subsystem (Phase 37)](#37-production-automation-engine--autonomous-recruitment-subsystem-phase-37)
38. [Recruiter Self-Host Google Meet & Calendar Automation](#38-recruiter-self-host-google-meet--calendar-automation)
39. [Gemini AI Dynamic Self-Healing & Platform Automation Audit](#39-gemini-ai-dynamic-self-healing--platform-automation-audit)
40. [Centralized Job Expiry, Recruiter Archive/Delete & Candidate History Synchronization](#40-centralized-job-expiry-recruiter-archive-delete--candidate-history-synchronization)
41. [Responsive Left Drawer, Quick Navigation & Persona Hubs (Phase 41)](#41-responsive-left-drawer-quick-navigation--persona-hubs-phase-41)
42. [User Dashboard 100% Mockup Design Match & 350px Mobile Architecture (Phase 42)](#42-user-dashboard-100-mockup-design-match--350px-mobile-architecture-phase-42)
43. [Compact Headers & Full-Width Content Architecture (Phase 43)](#43-compact-headers--full-width-content-architecture-phase-43)
44. [Unstop-Style "Explore Home" Landing Page & Guest Routing (Phase 44)](#44-unstop-style-explore-home-landing-page--guest-routing-phase-44)
45. [Universal Enterprise Toast Notification System & Zero-Alert Enforcement (Phase 45)](#45-universal-enterprise-toast-notification-system--zero-alert-enforcement-phase-45)
46. [Super Admin Console Streamlining & Duplicate Navigation Elimination (Phase 46)](#46-super-admin-console-streamlining--duplicate-navigation-elimination-phase-46)
47. [Super Admin Profile Settings Crash Fix & Seamless Governance View (Phase 47)](#47-super-admin-profile-settings-crash-fix--seamless-governance-view-phase-47)
48. [Interactive System Architecture & Codebase Folder Structure Portals (Phase 48)](#48-interactive-system-architecture--codebase-folder-structure-portals-phase-48)
49. [Triple-Dashboard Opportunity Management Subsystem: Hackathons, Quizzes & Internships (Phase 49)](#49-triple-dashboard-opportunity-management-subsystem-hackathons-quizzes--internships-phase-49)
50. [Mobile PageSpeed & Core Web Vitals Optimization Engine (Phase 50)](#50-mobile-pagespeed--core-web-vitals-optimization-engine-phase-50)

---

## 1. Backend Hardening & Zero-Vulnerability Core

- **Elimination of Deprecated & Insecure Dependencies**:
  - Removed outdated and unsafe `cloud` and vulnerable `datauri` packages from `package.json`.
  - Audited dependencies via `npm audit` — achieved **0 vulnerabilities**.
- **Native Safe Base64 DataURI Generator (`Backend/utils/datauri.js`)**:
  - Engineered a native in-memory buffer to base64 DataURI converter.
  - Added full MIME-type resolution for `.pdf`, `.doc`, `.docx`, `.txt`, and standard image types without third-party library overhead.
- **Modern Security Middleware (`Backend/index.js`)**:
  - **Helmet**: Enforced secure HTTP response headers (CSP, HSTS, X-Frame-Options).
  - **express-rate-limit**: Configured standard rate limiting on API endpoints to prevent brute-force login and denial-of-service spam.
  - **Centralized Error Handling**: Standardized error handler middleware catching unexpected exceptions without leaking database credentials or stack traces to clients.
  - **Process Graceful Shutdown**: Registered handlers for `SIGTERM` and `SIGINT` to safely disconnect MongoDB connections before termination.
- **Express 5 Path Compatibility**:
  - Fixed Express 5 `path-to-regexp` v8 wildcard route crash by changing `app.use("*", ...)` to route-less `app.use((req, res) => ...)` for 404 responses.
- **Strict Input Validation & Automated Vitest Tests**:
  - Auth, job posting, and application status schemas strictly enforced using **Zod** (`Backend/utils/validators.js`).
  - Unit tests established with **Vitest** passing reliably (`npm test`).

---

## 2. Cloudinary & Resume PDF Engine (Failed to Load Fix)

- **Issue Diagnosed**:
  - Uploaded PDF resumes were previously stored under Cloudinary's default image pipeline (`/image/upload/`) without file extensions, causing browser PDF viewers to fail with `"Failed to load PDF document"`.
- **`resource_type: "raw"` Configuration**:
  - Updated `Backend/controllers/user.controller.js` to inspect MIME types and upload `.pdf`, `.doc`, and `.docx` files with `resource_type: "raw"`.
- **Authenticated Proxy Binary Download Endpoint (`GET /api/application/download-resume/:id`)**:
  - Built an IDOR-protected proxy endpoint in `application.controller.js`.
  - Verifies that only the authorized recruiter who posted the job can download the applicant's resume.
  - Streams binary buffer directly to the browser with proper headers (`Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Candidate_Resume.pdf"`).
  - Includes fallback redirection if CDN direct delivery is required.

---

## 3. Recruiter Pipeline & Status Decision Workflow

- **Beyond Binary Accept/Reject**:
  - Replaced the simple static dropdown with a multi-stage recruitment pipeline: `pending`, `shortlisted`, `interview`, `accepted`, `hired`, `rejected`.
- **Reason & Constructive Feedback Modal**:
  - Recruiters can reject candidates with an explanation (e.g. specific missing qualifications or seniority mismatch).
  - Recruiter notes are saved in the database under `application.feedback` and timestamped (`reviewedAt`).
- **Candidate Transparency & Application History Archive (`Frontend/src/components/AppliedJobs.jsx`)**:
  - In "My Applications", candidates can see a dedicated feedback card showing constructive feedback from recruiters if rejected.
  - **Automatic History Separation for Closed Positions**: If an applied position is filled, concluded, or no longer available in the database, it automatically moves into the **"History & Closed"** archive tab with distinct archived badging (`Archived / Closed`). The candidate's original submission timestamp, review status, interview notes, and recruiter feedback remain permanently preserved.

---

## 4. Post-Acceptance Next Steps & Interview Scheduling

- **Interview Scheduling Engine**:
  - Recruiter can select an applicant and trigger **"Schedule Interview"**:
    - **Date Picker** (e.g., `2026-09-10`).
    - **Time Field** with timezone support (e.g., `3:00 PM IST`).
    - **Virtual Meeting Link** (Google Meet, Zoom, Microsoft Teams).
    - **Interview Preparation Notes / Agenda**.
- **Candidate Portal Actions**:
  - Candidates with scheduled interviews receive a glowing action card inside "My Applications".
  - One-click **"Join Interview Meeting"** button opens the video conference link directly.
- **Hiring & Offer Confirmation**:
  - Recruiter can officially mark candidate as `Hired` with onboarding instructions.

---

## 5. Candidate Application Review & Drag-and-Drop Resume

- **Pre-Submission Profile Review Modal**:
  - Clicking **"Review Profile & Apply"** opens a pre-application check instead of blind submission.
  - **Auto-Prefilled Data**: Candidate's Full Name, Phone, Professional Bio, and Skills are prefilled from their saved profile.
  - **Inline Profile Updates**: Any tweaks made to bio or skills during application automatically synchronize with the candidate's account.
- **Interactive Resume Management**:
  - **Existing Resume Card**: Shows filename and status of currently linked resume.
  - **Delete / Remove Resume**: Dedicated button to remove old resume.
  - **Drag-and-Drop Upload Zone**:
    - Candidates can drag & drop any PDF/Word resume onto the modal.
    - Drag-over visual feedback with glowing cyan border.
    - Click-to-browse folder selector fallback (`<input type="file">`).

---

## 6. Gemini AI Integrations (Plain-Text Everywhere & Multi-Model Cascade)

- **Cascading Multi-Model Runner (`Backend/controllers/ai.controller.js`)**:
  - Implemented automatic fallback routing: `gemini-flash-lite-latest` ➔ `gemini-flash-latest` ➔ `gemini-2.5-flash` ➔ `gemini-3.6-flash`.
  - Prevents single-model free-tier rate limits (`429 Quota Exceeded`) and temporary Google cloud outages (`503 Service Unavailable`) from failing user requests.
- **Strict Plain-Text Formatting (No Markdown Symbols)**:
  - Custom `stripMarkdown()` sanitizer removes `**bold**`, `*italics*`, `### headers`, backticks, and raw hashes.
  - Outputs clean paragraphs and standard bullet points (`• `) so textareas and fields contain pure readable text without asterisks.
- **Deep Resume AI Fit Analysis (Not Just Keywords)**:
  - Integrated `pdf-parse-fork` on the backend.
  - Downloads candidate's PDF resume and parses up to 10,000 characters of full resume text.
  - Benchmarks candidate's actual projects, work experience, certifications, and depth against the job description to calculate realistic match percentages and gap recommendations.
- **AI Auto-Craft Bio & Skills**:
  - Candidate profile and apply modal feature a one-click **"Enhance with AI"** button to generate a professional 2-3 sentence bio and extract top technical skills.
- **AI Recruiter Decision & Interview Note Generator**:
  - Generates tailored interview preparation notes and constructive rejection reasons on demand.
- **AI Job Description Generator**:
  - Recruiter job posting screen generates formatted, plain-text job descriptions based on job title and required experience.

---

## 7. Database Atomicity & Legacy Schema Resilience

- **Safe Optional Chaining on Foreign Keys**:
  - Fixed `TypeError: Cannot read properties of undefined (reading 'toString')` when interacting with legacy or seeded jobs that lacked a `created_by` field.
- **Atomic MongoDB Updates (`Job.findByIdAndUpdate`)**:
  - Fixed `ValidationError: Job validation failed: created_by is required., company: is required.`.
  - Replaced `job.applications.push(); await job.save();` with atomic `$push: { applications: newApplication._id }`.
  - Completely avoids re-validating the parent Job schema on application submissions.
- **Unique Compound Index**:
  - Enforced `{ job: 1, applicant: 1 }` unique compound index on Applications to prevent duplicate applications at the database level.

---

## 8. Frontend Aesthetics & Production UI/UX

- **Design Tokens & Theme**:
  - Modern deep-space dark palette (`#080C14`, `#0D1322`, `#141C31`).
  - Font styling using Google Fonts (**Syne** for headings, **Plus Jakarta Sans** for body).
  - Subtle glowing glassmorphism borders and interactive hover micro-transitions.
- **State Management & Instant Feedback**:
  - Animated notifications, disabled states on buttons during async calls, and optimistic UI updates for application lists.
- **100% Mobile Responsive**:
  - Layout adapts smoothly across desktop monitors, tablets, and smartphones.

---

## 10. 2030 SaaS Visual Design System & Role Layouts (Phase 1)

- **Deep Obsidian & Neon Aesthetic (`frontend/src/index.css`)**:
  - Engineered a futuristic 2030 palette with luminous cyber-indigo, cyan (`#06b6d4`), violet (`#8b5cf6`), and emerald accents.
  - Multi-layer glassmorphic card panels (`backdrop-filter: blur(20px)` and subtle top gradient borders).
  - Stat cards with glowing metrics, status indicator dots, and micro sparklines.
  - Modern typography system pairing **Syne** (geometric display font) with **Plus Jakarta Sans** (crisp UI body font).
- **Intelligent Dual-Role Operating Navigation (`Navbar.jsx` & `App.jsx`)**:
  - Seamless role-based entry point:
    - **Candidates**: Land on **Career Hub** (`candidate-dashboard`) with DNA analytics, live recommendations, and application tracker.
    - **Recruiters**: Land on **Command Center** (`recruiter-dashboard`) with hiring funnel conversion metrics, applicant influx, and pipeline triggers.
  - Interactive top bar with quick tab triggers, role pills, and user avatars.

---

## 11. Candidate Career Intelligence Hub & Competency Radar (Phase 2)

- **Career DNA Meter (`CandidateDashboard.jsx`)**:
  - Computes candidate profile completeness, market readiness, and overall index (0-100) benchmarked against 2030 industry standards.
- **SVG Competency Radar Chart (`SkillRadar.jsx`)**:
  - Pure vector spider/radar chart visualizing 6 core competency dimensions:
    - Core Engineering
    - Architecture & Design
    - Cloud & DevOps
    - AI & Modern Stack
    - Product Velocity
    - Domain Breadth
  - Overlays candidate's actual scores against 2030 market baseline.
- **Application Velocity & Funnel Tracker**:
  - Tracks candidate progression across Pending, Shortlisted, Interview, and Hired stages.
  - Instant response rate and callback velocity calculations.
- **Curated 2030 Trajectories & Growth Sprints**:
  - Recommends target high-growth tech roles (e.g. Full-Stack AI Engineer, Distributed Cloud Systems Developer) and specific upskilling milestones.

---

## 12. Recruiter Command Center, Kanban Pipeline & AI Ranking (Phase 3)

- **Talent Funnel Visualizer (`RecruiterDashboard.jsx`)**:
  - Dynamic 5-stage conversion funnel tracking candidate attrition from initial submission to final hire.
  - Active postings summary with live applicant counters.
- **Interactive Multi-Stage Kanban Board (`RecruiterJobs.jsx`)**:
  - Dual view modes: **Kanban Pipeline Board** and **Classic List View**.
  - Five distinct recruitment columns:
    - `Pending Review`
    - `Shortlisted`
    - `Interview`
    - `Hired / Accepted`
    - `Rejected`
- **Automated AI Candidate Ranking (`POST /api/ai/rank-candidates`)**:
  - Analyzes all applicants for a job against required specifications to compute individual compatibility match percentages (e.g., "92% Fit").
- **Bulk Candidate Actions (`POST /api/application/bulk-status`)**:
  - Select-all or multi-select candidates across columns.
  - Floating 2030 bulk toolbar for batch shortlisting, batch interview moves, or batch rejections.

---

## 13. Enhanced Job Discovery & Bookmarking Engine (Phase 4)

- **Job Bookmark / Save Subsystem (`JobList.jsx`)**:
  - Candidates can bookmark open roles directly from cards or inside the detailed job drawer.
  - Interactive bookmark icon with instant visual feedback and amber fill state.
  - Quick filter toggle: switch between **All Open Positions** and **Bookmarked Roles Only**.
- **Salary Intelligence Comparison**:
  - Live salary comp badge identifying top-tier competitive pay bands.
- **Backend Bookmark Persistence (`POST /api/job/save/:id` & `GET /api/job/saved`)**:
  - User model updated with atomic `savedJobs` array reference.
  - Populates company logos, location, and compensation metrics on query.

---

## 14. AI Career Coach Suite (Phase 5)

- **AI Career Coach Hub (`AICareerCoach.jsx`)**:
  - **Conversational Career Strategist**:
    - Interactive chat UI with conversational memory, preset prompt pills, and Gemini 2.5 Flash plain-text advice.
  - **Interview Prep Simulator**:
    - Configurable for any role, target firm type, and experience tier (Junior to Principal).
    - Generates technical architecture questions, edge-case scenarios, and STAR answering frameworks.
  - **Salary & Negotiation Intelligence**:
    - Benchmarks target 2030 base + bonus ranges.
    - Generates customized, professional counter-offer email templates with one-click copy to clipboard.

---

## 15. Real-Time Event Notifications & Activity Subsystem (Phase 6)

- **Persistent Notification Data Model (`Backend/models/notification.model.js`)**:
  - Types: `application_received`, `status_update`, `interview_scheduled`, `hired`, `system`.
- **Automatic Event Triggers (`application.controller.js`)**:
  - **Candidate applies**: Automatically delivers an application received alert to the recruiter who created the job.
  - **Recruiter updates status or schedules interview**: Instantly notifies the candidate with dates, meeting links, and feedback.
- **Header Notification Bell (`NotificationBell.jsx`)**:
  - Glowing topbar bell with pulsating unread counter badge.
  - Floating glassmorphic dropdown with time stamps, category icons, one-click navigation, and "Mark all as read" capability.
  - Background polling keeps activity synchronized in real-time.

---

## 16. Complete API Endpoint Directory

### Authentication & Users (`/api/user`)

- `POST /register`: Register candidate or recruiter.
- `POST /login`: Authenticate and issue secure cookie.
- `GET /logout`: Clear authentication cookie.
- `GET /me`: Fetch authenticated session profile.
- `POST /profile/update`: Multipart update for profile fields, resume upload, and resume deletion.

### Jobs & Discovery (`/api/job`)

- `POST /post`: Create new job listing (recruiter only).
- `GET /get`: Filterable search for candidates (keyword, location, jobType, pagination).
- `GET /getadminjobs`: Fetch jobs posted by the logged-in recruiter.
- `GET /get/:id`: Fetch single job details with company metadata.
- `POST /save/:id`: Toggle bookmarking a job for logged-in candidate.
- `GET /saved`: Retrieve all bookmarked jobs for candidate.

### Applications & Hiring Pipeline (`/api/application`)

- `POST /apply/:id`: Submit application with atomic push to job record and recruiter notification.
- `GET /get`: Retrieve all applications submitted by candidate.
- `GET /stats`: Fetch candidate application timeline, funnel velocity, and analytics.
- `GET /recruiter-stats`: Fetch recruiter-level hiring funnel and applicant analytics.
- `GET /applicants/:id`: Fetch applicants for a specific job (IDOR protected).
- `POST /status/:id/update`: Update hiring status, feedback, and interview schedule with candidate notification.
- `POST /bulk-status`: Batch update status for multiple candidates.
- `GET /download-resume/:id`: Proxy stream candidate resume with verified recruiter authorization.

### Artificial Intelligence (`/api/ai`)

- `POST /match`: Full resume PDF parser + Gemini skill and project fit assessment.
- `GET /career-dna`: Compute candidate 2030 Career DNA score, radar dimensions, and strategic insights.
- `POST /rank-candidates`: Evaluate and rank applicants for a specific job posting.
- `POST /career-coach`: Conversational plain-text AI career advisory.
- `POST /interview-prep`: Generates role-tailored technical questions and answer frameworks.
- `POST /salary-insight`: Calculates compensation benchmarks and counter-offer negotiation scripts.
- `POST /generate-jd`: Recruiter AI plain-text job description generator.
- `POST /generate-bio`: Candidate AI plain-text bio and skills creator.
- `POST /generate-interview`: AI interview schedule note drafter.
- `POST /generate-feedback`: AI constructive rejection or offer note drafter.

### Notifications & Alerts (`/api/notification`)

- `GET /get`: Retrieve notifications and unread counter for authenticated user.
- `PUT /read/:id`: Mark single notification as read.
- `PUT /read-all`: Mark all notifications as read.

---

## 17. Day & Night Theme System & Tailwind CSS Architecture (Phase 7)

- **Day (Light) & Night (Dark) Mode Engine (`ThemeContext.jsx`)**:
  - Global `ThemeContext` providing `theme`, `toggleTheme`, and `isDark`.
  - Persists selected mode in `localStorage` and respects system `prefers-color-scheme`.
  - Toggles the `.dark` class dynamically on `document.documentElement` for instant styling switches across the application.
- **Header Sun / Moon Mode Switcher (`Navbar.jsx`)**:
  - Intuitive toggle button located directly in the topbar action area.
  - Features smooth rotation and icon morphing between glowing `<Sun>` (Day mode) and `<Moon>` (Night mode).
- **Tailwind CSS v3 Configuration (`tailwind.config.js` & `postcss.config.js`)**:
  - Configured with `darkMode: 'class'` for seamless dual-mode utility classes (`dark:bg-slate-900`, `dark:text-white`, `dark:border-slate-800`).
  - Dual CSS custom properties:
    - **Day Mode (Light)**: Clean `#f8fafc` background, crisp `#ffffff` cards, dark text `#0f172a`, and subtle slate borders (`#e2e8f0`).
    - **Night Mode (Dark)**: Deep `#090d16` background, rich `#111827` cards, light text `#f8fafc`, and dark slate borders (`#1e293b`).

## 18. Candidate Dashboard Active Resume PDF Center (Phase 8)

- **Dedicated Resume PDF Card (`CandidateResumeCard.jsx`)**:
  - Solved the visibility gap where recruiters could see candidate resumes, but candidates did not have a dedicated resume card on their operating dashboard.
  - Direct integration on **Candidate Dashboard** (`CandidateDashboard.jsx`):
    - **Active Resume Preview**: Displays file name (e.g. `Candidate_Resume.pdf`), document type, and "Active & Verified" badge.
    - **Direct Actions**:
      - 👁️ **Preview**: Opens the verified Cloudinary PDF document directly in a new tab.
      - ⬇️ **Download**: Direct one-click download of the stored PDF file.
      - 🔄 **Replace Resume**: In-place drag/click file picker that uploads immediately to `POST /api/user/profile/update` and updates state in real-time.
      - 🗑️ **Remove Resume**: Clean removal with confirmation dialog.
    - **Empty State**: Interactive dashed dropzone inviting candidate to upload their PDF resume if not yet attached.

---

## 19. Contact Us Mongoose 9 Compatibility Fix

- **Issue Diagnosed**:
  - Submitting the Contact Us form resulted in `500 Internal Server Error: "next is not a function"`.
  - In Mongoose 9.x (`^9.2.4`), middleware hooks no longer pass or support the legacy `next` callback argument.
  - `contactSchema.pre("save", function (next) { ... next(); })` caused `next` to evaluate as `undefined`, throwing `TypeError: next is not a function`.
- **Resolution**:
  - In [contact.model.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/models/contact.model.js), added a `default: () => ...` function on `ticketId` for automatic ticket generation upon model instantiation.
  - Updated `contactSchema.pre("save", function () { ... })` to be synchronous with no `next` argument or invocation.
  - Added strict [contactSchemaValidator](file:///d:/Major%20Project%201/Job%20Portal/Backend/utils/validators.js) using Zod in [validators.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/utils/validators.js) and wired into [contact.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/contact.controller.js).
  - Added automated unit tests in [validation.test.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/test/validation.test.js) (8/8 tests passing).

---

## 20. Super Admin Console & Recruiter Company Resolution

- **Issue Diagnosed**:
  - In Admin Dashboard (`/admin-dashboard?tab=recruiters`), recruiter cards displayed _"No company linked"_ even though 10 jobs were posted under company **"Web Expert"**.
  - **Root Cause 1**: When registering a company via `company.controller.js`, the company record was created with `userId: req.id`, but the recruiter's `user.profile.company` foreign key was never set.
  - **Root Cause 2**: In `company.model.js`, the field is `companyName`, whereas the frontend and admin controller looked for `company.name`.
- **Resolution**:
  - **[admin.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/admin.controller.js)**: In `getAllRecruiters`, enhanced resolution to look up companies registered by the recruiter (`Company.userId`) as well as fallback lookup from the recruiter's posted jobs (`job.company`). Populated `companyName` field.
  - **[AdminRecruitersTab.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/admin/AdminRecruitersTab.jsx)** & **[AdminJobsTab.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/admin/AdminJobsTab.jsx)**: Updated rendering and search to support `company.companyName || company.name`.

---

## 21. Recruiter Company Details Update Feature (Company Directory)

- **Requirement**: Allow recruiters to update their company name and organization details in the Company Directory (`/companies`) without modifying sensitive personal identifiers (Aadhaar, PAN).
- **Backend Enhancements**:
  - **[validators.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/utils/validators.js)**: Added `companyName` and flexible website string handling to `companyUpdateSchema`.
  - **[company.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/company.controller.js)**: In `updateCompany`, added duplicate companyName conflict detection, updated `companyName`, `description`, `website`, `location`, Cloudinary logo upload, and ensured `User.profile.company` link persistence.
  - **[company.route.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/routes/company.route.js)**: Granted permissions to both `recruiter` and `admin` roles for `/register`, `/get`, and `/update/:id`.
- **Frontend Enhancements**:
  - **[CompanyCard.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/company/CompanyCard.jsx)**: Added a direct **"Edit Details"** pencil action button on every company card.
  - **[CompanyModal.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/company/CompanyModal.jsx)**: Upgraded modal dialog to support both Register and Update modes with live pre-filled fields (Company Name, Headquarters/Location, Website, Description, Logo replacement) with zero Aadhaar/PAN fields.
  - **[Companies.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Companies.jsx)**: Added `updateCompanyMutation` with optimistic UI feedback and automatic cache invalidation for both recruiter and admin views.

---

## 22. Super Admin Isolation & Dedicated Master Credentials

- **Recruiter Profile Dropdown Separation**:
  - Removed "Admin Console" action link from the Recruiter dropdown menu in [Navbar.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/Navbar.jsx).
  - Admin Console link only renders if `user?.role === "admin"`.
- **Strict Role-Gated Super Admin Console**:
  - [admin.route.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/routes/admin.route.js): Restricted `/api/admin/*` endpoints strictly to `authorizeRoles("admin")` (removed recruiter permissions).
  - [AdminDashboard.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/AdminDashboard.jsx): Added strict role check preventing non-admins from accessing or viewing governance queries, displaying an access-restricted state with direct links to "Sign In as Admin".
- **Dedicated Admin Credentials Seeded**:
  - **Email**: `admin@gmail.com`
  - **Password**: `admin1234`
  - **Role**: `admin`
- **Immediate Post-Login Navigation**:
  - Updated [App.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/App.jsx) and [Login.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Login.jsx) to immediately navigate `admin` users directly to `/admin-dashboard` upon authentication.

---

## 23. Super Admin Profile Streamlining & AI Bio Crash Fix

- **AI Bio Enhancer Runtime Fix**:
  - **Issue Diagnosed**: Clicking "Enhance with AI" caused the profile page to crash and render a blank white screen.
  - **Root Cause**: Backend `/api/ai/generate-bio` returned `skills` as a comma-delimited string (or matched string), but [Profile.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Profile.jsx) executed `data.skills.join(", ")`, throwing an unhandled `TypeError: data.skills.join is not a function`.
  - **Resolution**: Enhanced handler to support both Array and String formats safely (`Array.isArray(data.skills) ? data.skills.join(", ") : data.skills`).
- **Super Admin Profile Simplification**:
  - Completely stripped out unnecessary applicant/recruiter sections for the Super Admin:
    - ❌ Removed **Resume PDF upload / file management**.
    - ❌ Removed **Professional Bio & AI Enhancer**.
    - ❌ Removed **Technical Skills tags & Career links (GitHub, LinkedIn, Portfolio, CTC)**.
  - Admin Profile now features clean **Administrator Account Details**:
    - Full Name, Email Address, Contact Phone, and Profile Avatar / Photo.
    - Role badge with _"Platform Super Administrator (Master Access)"_.
    - Readiness index tailored specifically to admin account completeness.

---

## 24. Super Admin Panel Full-Console View & Footer Concealment

- **Issue / Requirement**: Remove the marketing footer from all Admin Panel and Console screens so the administration console displays as a distraction-free, full-height operating cockpit.
- **Resolution**:
  - In [App.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/App.jsx), detected `location.pathname.startsWith("/admin")` via React Router's `useLocation`.
  - Conditioned `<Footer />` rendering on `!isAdminPanel`. The footer is now completely hidden across `/admin` and `/admin-dashboard` routes, maximizing vertical workspace for platform governance tables, metric charts, and moderation queues.

---

## 25. Registration Role Isolation & Recruiter-Only KYC (Aadhaar & PAN)

- **User Directives**:
  - Do NOT ask candidates for Aadhaar or PAN card during registration.
  - Aadhaar and PAN must be strictly required only for recruiters/employers.
  - Admin must ONLY have access through the Login page; the Register page must NOT offer an Admin registration option.
- **Database & Model Architecture (`Backend/models/user.model.js`)**:
  - Configured `adharcard` and `pancard` with `required: false` and `sparse: true, unique: true`.
  - Sparse index ensures candidates without Aadhaar and PAN documents do not trigger MongoDB duplicate key index collisions.
- **Backend Validation & Controller Security (`Backend/utils/validators.js` & `user.controller.js`)**:
  - `registerSchema`: Restricted `role` enum strictly to `["student", "recruiter", "Student", "Recruiter"]`. Rejects any payload attempting to register `role: "admin"` publicly.
  - Enforced `.superRefine`: If `role === "recruiter"`, enforces valid 12-digit Aadhaar and 10-char PAN format. If candidate, Aadhaar/PAN are completely optional and bypassed.
  - `user.controller.js`: Dynamically builds uniqueness query so missing Aadhaar/PAN do not check for null/empty matches, and sets attributes only if provided.
- **Frontend Register & Login Experience (`Register.jsx`, `AuthModal.jsx`, `Login.jsx`)**:
  - [Register.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Register.jsx):
    - Role selector redesigned to 2 options: **Job Candidate** and **Recruiter / Employer**.
    - Removed Admin registration button entirely.
    - Candidate view completely hides Aadhaar and PAN fields.
    - Recruiter view highlights a distinct KYC container requiring 12-digit Aadhaar and 10-character PAN card.
  - [Login.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Login.jsx):
    - Retains all 3 login tabs (Candidate, Recruiter, Admin).
    - When `Admin` is selected, footer replaces "Create Account" with a message explaining that Super Admin credentials are provisioned internally.
  - [AuthModal.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/AuthModal.jsx):
    - Conditionally renders Aadhaar and PAN inputs strictly when `role === "recruiter"`.

---

## 26. Complete Production Authentication Suite: OTP, Google OAuth, Recovery & Anti-Bot Protection

- **Login Two-Factor Email OTP Verification**:
  - **Expiry & Cooldown**: Passcode expires in **5 minutes** (`5 * 60 * 1000`); resend cooldown timer is **15 seconds** across all verification screens.
  - **Login Flow (`POST /api/user/login`)**:
    - Candidates and Recruiters submitting valid email + password generate an in-memory 6-digit passcode dispatched directly to their registered inbox via Gmail SMTP (`sickykumar01@gmail.com`).
    - Super Admin continues to authenticate directly with master credentials without OTP friction.
  - **Passcode Verification & Resend (`POST /api/user/login-verify-otp` & `/login-resend-otp`)**:
    - [Login.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Login.jsx) switches to a 6-digit numeric verification screen with a 15-second cooldown timer, resend button, and masked email indicator.
- **Direct 1-Click Google Sign-In & Sign-Up**:
  - **Candidate & Recruiter Enabled, Admin Strictly Excluded**:
    - Built [GoogleAuthButton.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/GoogleAuthButton.jsx) implementing Google Identity Services (GIS) with automated fallback.
    - Added "Continue with Google" on Login and "Sign up with Google" on Register.
    - [googleAuth](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/user.controller.js) strictly returns `403 Forbidden` if an attempt is made to log in or register with `role: "admin"`.
- **Forgot Password Dedicated Page & Recovery Suite**:
  - **Dedicated Route (`/forgot-password` & `/reset-password`)**: Built [ForgotPassword.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/ForgotPassword.jsx) registered in [App.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/App.jsx).
  - **Expiry & Cooldown**: Recovery passcode expires in **5 minutes**; resend cooldown timer is **15 seconds**.
  - **Password Reset Flow (`POST /api/user/forgot-password-request`, `/forgot-password-verify-otp`, `/forgot-password-reset`)**:
    - Step 1: Input registered email -> dispatches 6-digit recovery code valid for 5 minutes.
    - Step 2: Strict server-side verification blocks progression to Step 3 on wrong/expired codes with 15s live countdown timer.
    - Step 3: Input new password -> hashes password and dispatches **Password Changed Security Confirmation Notice** to the user's email.
- **Terms & Conditions Agreement Checkbox & Interactive Modal**:
  - [Register.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/Register.jsx): Enforces mandatory agreement to Terms of Service & Privacy Policy before account creation.
  - [TermsModal.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/TermsModal.jsx): Multi-tab glassmorphic dialog reviewing Terms of Service, Candidate Privacy, and Employer KYC obligations.
- **Anti-Bot Security Challenge Widget**:
  - [CaptchaWidget.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/CaptchaWidget.jsx): Zero-friction animated security challenge verifying human interaction on registration and recovery forms.

---

## 27. Modular Enterprise ATS Resume Checker & STAR Optimizer

- **Pluggable & Decoupled Architecture**:
  - Engineered as a standalone service with zero tight coupling so it can be ported into any other project.
  - **Standalone Backend Controller & Routes**:
    - [ats.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/ats.controller.js): Deep raw text extraction via `pdf-parse-fork`, multi-model Gemini cascading audit, and Google XYZ / STAR formula bullet rewriting.
    - [ats.route.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/routes/ats.route.js): `/api/ats/analyze` and `/api/ats/optimize-bullet`.
  - **Standalone Frontend Suite (`/ats-checker`)**:
    - [ATSResumeChecker.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/ATSResumeChecker.jsx): Dedicated full-screen analysis page supporting active profile resume or fresh drag-and-drop PDF upload.
    - [ATSScoreGauge.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/ats/ATSScoreGauge.jsx): Circular vector SVG gauge (0-100) with color-coded tier badges and 4 core metric breakdown bars (Keywords, Format, Metrics, Sections).
    - [ATSKeywordPills.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/ats/ATSKeywordPills.jsx): Visual comparison tags separating detected resume keywords from high-value missing keywords with 1-click clipboard copy.
    - [ATSSectionChecklist.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/ats/ATSSectionChecklist.jsx): Structural health analysis, strengths, and critical ATS red flags.
    - [ATSBulletOptimizer.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/ats/ATSBulletOptimizer.jsx): Interactive in-page tool to paste weak resume bullets and instantly generate 3 high-impact STAR variations with action verbs and metrics.

---

## 28. Modular Automated Job Alerts & Email Digest Engine

- **Pluggable & Decoupled Architecture**:
  - Standalone candidate notification system triggering automated email digests when recruiters publish matching jobs.
  - **Standalone Data Model**:
    - [jobAlert.model.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/models/jobAlert.model.js): Independent schema with `userId`, `email`, `title`, `keywords`, `location`, `jobType`, `frequency` ("instant" vs "daily"), `isActive`, `matchesCount`, and compound index `{ isActive: 1, keywords: 1 }`.
  - **Standalone Controller & Routes**:
    - [jobAlert.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/jobAlert.controller.js) & [jobAlert.route.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/routes/jobAlert.route.js): Full CRUD operations (`POST /create`, `GET /my`, `PUT /toggle/:id`, `DELETE /:id`).
  - **Background Email Dispatcher**:
    - [jobAlertNotifier.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/utils/jobAlertNotifier.js): Non-blocking asynchronous query matching new jobs against subscriber criteria with rate-limiting and stats incrementation.
    - [emailTemplates.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/utils/emailTemplates.js): Branded responsive `jobAlertEmailTemplate` with company logo, job title, salary pill, skills tags, and "View & Apply Now" action CTA.
  - **Recruiter Hook**:
    - [job.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/job.controller.js): `postJob` fires background alert notifications immediately after job insertion.
  - **Dedicated Frontend Management Hub (`/job-alerts`)**:
    - [JobAlerts.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/JobAlerts.jsx): Comprehensive dashboard displaying metrics (Total Alerts, Active Subscriptions, Delivered Matches) and optimistic status toggling.
    - [CreateJobAlertModal.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/jobAlert/CreateJobAlertModal.jsx): Tag-based skill creator with profile recommendation pills.
    - [JobAlertCard.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/jobAlert/JobAlertCard.jsx): Subscription card with live pause/resume switch and deletion confirmation.

---

## 29. Dashboard Layout Harmony & Dynamic System Theme Auto-Sync

- **Application Journey Whitespace Elimination**:
  - **Issue Diagnosed**: In [CandidateDashboard.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/CandidateDashboard.jsx), the 2-column grid was using `items-stretch` alongside `flex flex-col justify-between` in [ApplicationJourney.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/candidate/ApplicationJourney.jsx), resulting in an unnatural blank gap between the header and the pipeline buttons.
  - **Resolution**:
    - Changed parent grid to `items-start` so cards hug their natural height without artificial vertical stretching.
    - Upgraded [ApplicationJourney.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/candidate/ApplicationJourney.jsx) with `justify-start` and added a matching bottom conversion velocity highlight banner (_"active opportunities progressing in pipeline"_), mirroring the interview alert banner in the adjacent Quick Actions card.
- **Dynamic System Theme Auto-Sync with Manual Override (`ThemeContext.jsx`)**:
  - [ThemeContext.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/context/ThemeContext.jsx):
    - **Default System Mode**: Automatically detects OS color scheme (`prefers-color-scheme: dark` vs `light`).
    - **Live Real-Time OS Listener**: Listens to system theme changes via `matchMedia.addEventListener("change")` and adapts immediately in real time when the user switches Windows/Mac theme.
    - **Manual User Override**: Clicking the Sun/Moon button toggles between Light and Dark mode on demand and stores explicit manual preference (`theme_user_choice`).

---

## 30. Candidate Applied Jobs Interactive Accordion Suite

- **Collapsible Application Cards (`AppliedJobs.jsx`)**:
  - **Issue Solved**: Long recruiter feedback notes and interview schedules previously expanded permanently, consuming excessive screen height across all cards.
  - **Accordion Interface**:
    - Cards default to a sleek, compact summary (Company Logo, Title, Pay, Location, Status Badge, and applied timestamp).
    - Summary row displays mini pill indicators (`Interview Scheduled`, `Hiring Review Note`).
    - Smooth animated expand/collapse via Framer Motion's `AnimatePresence` with rotating chevron indicator.
    - Topbar **"Expand All / Collapse All"** master toggle button for rapid portfolio review.

---

## 31. Recruiter Direct Candidate Alert Broadcast & Skill Match Blast Engine

- **Candidate-Frictionless Workflow**:
  - Eliminates the need for candidates to manually construct alert subscriptions. Candidates passively receive targeted alerts based on their profile skills when recruiters broadcast open roles.
- **Intelligent 1-3 Skills Match Matching**:
  - Does NOT require 100% full skill matches. If a candidate matches **1, 2, or 3 relevant skills or role title keywords**, they qualify for the hiring blast.
- **Recruiter Broadcast Control & Live Preview (`BroadcastAlertModal.jsx`)**:
  - Added direct **"Broadcast Alert 📢"** action inside the recruiter's hiring pipeline command center (`PipelineModal.jsx`).
  - **Live Matching Preview**: Queries `GET /api/job/broadcast-preview/:id` and computes active matching candidates dynamically.
  - **Flexible Match Thresholds**:
    - `2+ Skills Matched` (Strong Fit / Recommended)
    - `1+ Skill Matched` (Broad Reach / Maximum visibility)
  - **Custom Hiring Manager Note**: Optional textarea to append urgent hiring requirements (e.g. immediate joiners, 15-day notice).
- **Multi-Channel Candidate Blast**:
  - **Branded Email Alert (`recruiterBroadcastEmailTemplate`)**: Personal greeting, company logo, role title, salary pill, detected matching skills tags, optional manager note, and direct 1-click apply button.
  - **In-App Persistent Notification**: Dispatched directly to candidate's notification bell with deep links.

---

## 32. Universal Cyber Loader, 404 NotFound & Global Error Boundary

- **Universal Multi-Orbital Cyber Loader (`UniversalLoader.jsx`)**:
  - Engineered a futuristic 2030 neon multi-ring loading animation (outer clockwise ring, inner counter-clockwise cyan ring, pulsing core Sparkles badge).
  - Supports both **Full-Screen Splash Mode** (backdrop blur) and **Inline Card Mode** with customizable status messages.
  - Wired into [App.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/App.jsx) during initial authentication session validation (`useAuth().loading`), eliminating any visual flash or layout jarring on startup.
- **Universal 404 Not Found Experience (`NotFound.jsx`)**:
  - Floating cosmic compass illustration with luminous cyber typography (_"404 - Out of Orbit"_).
  - Dynamic navigation buttons: _"Go Back"_, _"Explore Open Roles"_, and role-aware _"My Dashboard"_.
  - Landmark waypoints providing instant access to ATS Scanner, AI Career Coach, Company Directory, and Support Desk.
  - Mounted on catch-all route (`<Route path="*" element={<NotFound />} />`) in [App.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/App.jsx).
- **Universal Runtime Error Isolation & Diagnostics (`GlobalErrorBoundary.jsx` & `ErrorPage.jsx`)**:
  - Top-level React `GlobalErrorBoundary` wrapping the entire application to isolate runtime JavaScript exceptions and prevent white-screen crashes.
  - [ErrorPage.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/ErrorPage.jsx) featuring a protective shield visual, 1-click application reload, safe home redirect, and a collapsible developer technical diagnostics accordion with 1-click stack trace copying.
  - Also mounted as a dedicated route on `/error`.

---

## 33. Strict Role-Based Protected Routes & URL Access Guards

- **Route Guard Architecture (`ProtectedRoute.jsx`)**:
  - Engineered an enterprise auth router guard in [ProtectedRoute.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/common/ProtectedRoute.jsx) that prevents unauthorized direct URL navigation.
  - **Auth State Awaiting**: Shows `<UniversalLoader />` during initial cookie / JWT token check to prevent false-negative flashes.
  - **Unauthenticated Redirection**: Any unauthenticated visitor directly accessing `/candidate-dashboard`, `/recruiter-dashboard`, `/admin-dashboard`, `/applied`, `/post-job`, `/recruiter-jobs`, `/profile`, or `/account-settings` is immediately redirected to `/login` with target destination preserved in `location.state.from`.
  - **Role-Based Privilege Enforcement**:
    - **Candidate-Only Routes** (`allowedRoles: ["student"]`): `/candidate-dashboard`, `/applied`, `/ai-coach`, `/ats-checker`, `/job-alerts`.
    - **Recruiter-Only Routes** (`allowedRoles: ["recruiter", "admin"]`): `/recruiter-dashboard`, `/post-job`, `/recruiter-jobs`.
    - **Super Admin Routes** (`allowedRoles: ["admin"]`): `/admin-dashboard`, `/admin`.
    - **Common Authenticated Routes**: `/profile`, `/account-settings`.
    - If a candidate attempts to open `/recruiter-dashboard`, they are automatically redirected to `/candidate-dashboard` instead of unauthorized viewing.
- **Guest-Only Protection (`PublicOnlyRoute.jsx`)**:
  - Wraps `/login`, `/auth`, and `/register` so already authenticated users are redirected straight to their respective role dashboard without re-displaying login forms.

---

## 34. AI-Powered Broadcast Message Generator & Polisher

- **Automated Recruiter Outreach Note Synthesizer (`POST /api/ai/enhance-broadcast`)**:
  - Integrated into [ai.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/controllers/ai.controller.js) and [ai.route.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/routes/ai.route.js).
  - Uses Google Gemini multi-model cascade to craft high-converting, professional, and engaging outreach notes targeted at matching candidates.
  - Contextualizes recommendations based on Job Title, Company Name, Key Technical Requirements, and existing recruiter draft notes.
  - Strict plain-text formatting (zero asterisks, zero markdown fences, concise 2-3 sentence punchy phrasing).
  - Built-in graceful offline fallback in case of rate limits or network unavailability.
- **Frontend 1-Click Integration (`BroadcastAlertModal.jsx`)**:
  - Added glowing **"Enhance with AI ✨"** action button alongside the custom candidate message field.
  - Instant loading state with spinning cyan indicator and automatic textarea population upon generation.

---

## 35. Queued & Upcoming Production Roadmap

A prioritized inventory of upcoming features identified for subsequent iterations to elevate the platform to absolute market leadership:

### 35.1 Recruiter Analytics & Candidate Data Export (Excel / CSV / PDF) ⭐️ [Queued by User]

- **Direct Multi-Format Candidate Export**:
  - Recruiter can export all applicants (or filtered pipeline columns like Shortlisted / Interview) into formatted **Excel (`.xlsx`)**, **CSV**, and branded **PDF executive summaries**.
  - Includes candidate name, email, contact phone, current status, applied date, matched skills count, and recruiter feedback.
- **Recruiter Funnel Velocity Analytics**:
  - Time-to-hire metrics, applicant conversion rates per stage, and talent drop-off visualizer.

### 35.2 Candidate 1-Click Application Withdrawal / Retract System

- Allows candidates who accidentally applied or accepted an alternative offer to retract an active application with an optional respectful note to the hiring team, automatically updating recruiter Kanban columns.

### 35.3 Recruiter Job Posting Lifecycle Management (Pause, Close & Re-open)

- Recruiters can pause new incoming applications once candidate quota is filled or mark jobs as officially "Closed / Position Filled" without deleting historical applicant records.

### 35.4 Calendar `.ics` Invite & Google Calendar Direct Sync for Scheduled Interviews

- When recruiters schedule interviews via the pipeline drawer, candidates and recruiters receive an auto-generated `.ics` calendar attachment and 1-click **"Add to Google Calendar / Outlook"** link.

### 35.5 Global Smart Omnibar Search with Instant Keyword & Company Suggestions

- Header search bar with keyboard shortcut (`Cmd+K` / `Ctrl+K`) searching across active jobs, verified employers, tech stacks, and locations with instant debounced preview.

---

## 36. Vite Bundle Optimization & Production Code Splitting

- **Issue Diagnosed**:
  - Vite build generated a warning `(!) Some chunks are larger than 500 kB after minification`, with monolithic `index.js` bundle measuring **914.97 kB**.
  - All vendor libraries (React, React Router, Framer Motion, TanStack Query, Lucide icons, Canvas Confetti, Axios) and application code were compiled into a single file, slowing initial client download.
- **Rollup Manual Chunks Architecture (`vite.config.js`)**:
  - Configured intelligent granular vendor code-splitting in [vite.config.js](file:///d:/Major%20Project%201/Job%20Portal/frontend/vite.config.js):
    - `vendor-react` (252.98 kB): Core React engine, DOM reconciler, and React Router navigation.
    - `vendor-ui` (32.40 kB): Framer Motion animations, Lucide icons, and canvas confetti.
    - `vendor-data` (49.95 kB): TanStack Query cache and Axios networking.
    - `vendor-core` (129.47 kB): Core utility packages.
    - `index.js` (Application code): Slashed by **50.7%** from **914.97 kB down to 451.55 kB**!
  - **Results**: Achieved **0 build warnings**, all individual chunks well below 500 kB threshold, with enhanced browser caching efficiency.

---

## 37. Production Automation Engine & Autonomous Recruitment Subsystem (Phase 37)

A modular, decoupled automation engine engineered inside `Backend/automation/` designed for seamless portability, zero disruption to existing features, and resilient background processing:

### 37.1 Decoupled Architecture (`Backend/automation/`)

- **Event Bus (`automationBus.js`)**: In-process `EventEmitter` processing cross-platform events (`JOB_CREATED`, `APPLICATION_CREATED`, `APPLICATION_STATUS_CHANGED`, `RESUME_UPLOADED`, `INTERVIEW_SCHEDULED`, `JOB_EXPIRED`) asynchronously without blocking HTTP response loops.
- **Self-Healing Task Queue (`AutomationJob` & `jobQueueWorker.js`)**:
  - Worker supporting statuses: `pending`, `processing`, `completed`, `failed`, `retrying`.
  - Exponential backoff retry logic (initial 2s up to 60s), idempotency protection, and dead-letter queue classification for administrator inspection.
- **Scheduler (`scheduler.js`)**:
  - Automatic job expiration runner detecting and marking expired jobs hourly.
  - Automatic interview reminder runner detecting upcoming interviews within 24h and 1h with duplicate prevention flags (`reminder24hSent`, `reminder1hSent`).
  - Daily job digest dispatching consolidated matching jobs to subscribed candidates.

### 37.2 Intelligent Job Processing & Spam Moderation (`jobAnalyzer.service.js` & `duplicateDetector.service.js`)

- **Deterministic & Similarity Duplicate Prevention**: Hash-based duplicate checking preventing identical or duplicate postings by the same company within 30 days.
- **Spam & Fraud Moderation**: Real-time scanning for prohibited scam keywords, suspicious redirect URLs, and salary anomalies; classifies listings as `safe`, `review_required`, or `blocked`.
- **Gemini Structured Metadata Extraction**: Normalizes requirements into skills, technologies, experience years, seniority, responsibilities, and category, cached in `AIAnalysis`.

### 37.3 Multi-Dimensional AI Candidate Matching & Personalized Recommendations

- **6-Dimension Match Algorithm (`candidateMatcher.service.js`)**: Computes `skillMatch`, `experienceMatch`, `educationMatch`, `locationMatch`, `preferenceMatch`, and `overallMatch` (0-100) cached in MongoDB to avoid redundant Gemini API quota usage.
- **Candidate Recommendations Engine (`recommendation.service.js`)**: High-speed, indexed recommendation queries ranking active positions based on candidate skill overlap and title relevance with affinity badges (`⚡ 94% Fit`).

### 37.4 Google Calendar & Virtual Meeting Scheduling (`googleCalendar.service.js`)

- **Google Calendar API Integration**: Creates calendar events, syncs attendees, and generates Google Meet links.
- **Zero-Friction Fallback**: Generates virtual video conferencing links and standard RFC 5545 `.ics` iCalendar attachments with automated 24h and 1h alarms delivered via Nodemailer.

### 37.5 Automated Milestone Email Dispatcher (`statusNotifier.service.js`)

- Responsive branded HTML email notifications for all application milestones:
  - `applied`: Application submission confirmation.
  - `under_review`: Portfolio under active engineering review.
  - `shortlisted`: Shortlist congratulations and next steps.
  - `interview`: Meeting invitation with date, time, timezone, Google Meet link, and recruiter notes.
  - `offer`: Official hiring congratulations.
  - `rejected`: Polite, constructive feedback.

### 37.6 Admin Automation & System Health Console (`AdminAutomationTab.jsx`)

- Dedicated **"Automation Engine"** tab in Super Admin Console (`/admin-dashboard?tab=automation`).
- 8 live metrics: Active Jobs, Applications Today, AI Tasks Processed, Dead-Letter Tasks, Pending Queue, Upcoming Interviews, Expired Jobs, Flagged for Review.
- Live task queue table with task types, attempt counters, and one-click **"Retry Task"** action.
- Flagged jobs moderation queue allowing administrators to review and approve/block suspicious listings.
- Real-time audit event stream.

---

## 38. Recruiter Self-Host Google Meet & Calendar Automation

- **Recruiter Host Control Architecture**:
  - In multi-tenant recruitment platforms where multiple independent recruiters schedule interviews, generating meetings via a single server Google account causes the server to be the Host rather than the recruiter conducting the interview.
  - Engineered **"Create Meet as Host"** workflow directly inside [StatusDecisionModal.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/pipeline/StatusDecisionModal.jsx).
  - Clicking launches `https://meet.google.com/new` with the recruiter's active Google profile, ensuring **the recruiter is 100% the Meeting Host** with full Host Controls (admit/deny participants, mute/unmute, screen share permissions, breakout rooms).
  - Built a 1-click **"Paste"** button using `navigator.clipboard.readText()` to auto-populate the generated meeting URL into the scheduling input.
- **Candidate Celebratory Feedback & Notifications**:
  - Both transactional HTML emails (`interviewMeetingEmailTemplate`) and in-app alerts feature a prominent **🎉 Congratulations banner** acknowledging the candidate's qualification for the interview round.
  - Direct **"Join Google Meet"** action button embedded in candidate cards and notifications.
- **Recruiter Confirmation & Pipeline Synchronization**:
  - Automatically sends recruiter a meeting confirmation copy and in-app alert.
  - Recruiter Kanban board, pipeline cards, and dashboards display instant **"Join Google Meet"** shortcuts for all scheduled candidates.

---

## 39. Gemini AI Dynamic Self-Healing & Platform Automation Audit

- **Legacy MongoDB Schema Resolution**:
  - Discovered root cause of `Active Jobs: 0` and `Expired Jobs: 0` on platform dashboard: legacy jobs created prior to schema enhancements lacked `status: "published"` and `expiresAt` fields.
  - Added self-healing queries in [automationAdmin.controller.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/automation/controllers/automationAdmin.controller.js) (`Job.updateMany({ status: { $exists: false } }, ...)` and auto-expiring jobs where `expiresAt <= now`).
- **Candidate Pending Queue Realignment**:
  - Re-mapped the "Pending Queue" metric card from internal worker queue tasks to active candidate applications (`Application.countDocuments({ status: "pending" })`), accurately displaying the **2 Pending Applications** awaiting recruiter review.
- **Gemini AI Dynamic Sync Engine (`syncAllJobsWithAI`)**:
  - Built full database sync runner in [jobAnalyzer.service.js](file:///d:/Major%20Project%201/Job%20Portal/Backend/automation/services/jobAnalyzer.service.js) using Google Gemini AI cascade model.
  - Audited all 10 jobs in the database:
    - **Active Jobs (Published)**: **8**
    - **Expired Jobs**: **2**
    - **Pending Candidate Applications**: **2**
    - **Upcoming Interviews**: **1**
    - **AI Processed Jobs**: **10**
- **One-Click AI Sync Button**:
  - Added **"Run Gemini AI Sync"** button to the Platform Command Center header in [AdminAutomationTab.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/admin/AdminAutomationTab.jsx) for instant on-demand database normalization.

---

## 40. Centralized Job Expiry, Recruiter Archive/Delete & Candidate History Synchronization

- **Recruiter Active Positions Metric Realignment**:
  - Fixed [RecruiterJobs.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/RecruiterJobs.jsx) so `Active Positions` accurately calculates active non-expired jobs (`status: "published" && (!expiresAt || new Date(expiresAt) > new Date())`), properly displaying **8** instead of raw 10.
  - Added **Expired & Archived (2)** and **Total Applicants (5)** summary cards.
  - Implemented 3 status filter tabs: **Active Positions (8)** (Default), **Expired & Archived (2)**, and **All (10)**.
- **Single Source of Truth: Centralized Status Utility (`frontend/src/utils/jobStatus.js`)**:
  - Created universal `getJobExpiryInfo(job)` helper shared identically across `JobCard.jsx`, `JobList.jsx`, `RecruiterJobs.jsx`, and `AppliedJobs.jsx`.
  - Produces consistent color-coded countdown badges:
    - `🟢 Active · [X]d left` (Emerald / Cyan highlight)
    - `⚡ Expiring Soon · [X]d left` (Pulsing Amber highlight if <= 3 days)
    - `⏰ Expired` (Rose / Slate badge)
    - `📦 Archived` (Amber / Slate badge)
- **Active Duration Selector on Job Post (`JobFormFields.jsx` & `PostJob.jsx`)**:
  - Recruiter is prompted to select the position's active window: **7 Days (Urgent)**, **15 Days**, **30 Days (Standard · Default)**, **60 Days**, or **90 Days (Quarterly)**.
  - Dynamic helper shows real-time computed date: `🗓️ Active until: [Formatted Date]`.
  - Stored atomically in MongoDB `expiresAt` with schema validation via Zod (`jobPostSchema`).
- **Recruiter Archive & Delete Authority (`PipelineModal.jsx` & Backend)**:
  - Added `PUT /api/job/:id/archive` (toggle archive/reactivate; extends expiry by 30 days if reactivated after expiration) and `DELETE /api/job/:id`.
  - Strict IDOR ownership validation: `job.created_by.toString() === req.id || req.user?.role === "admin"`.
  - Interactive **Archive Position** / **Reactivate Position** and **Delete** action buttons integrated directly into the header of [PipelineModal.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/pipeline/PipelineModal.jsx).
- **Automated Candidate Feed & History Archive Synchronization**:
  - **Candidate Search Feed (`/jobs`)**: Strictly excludes non-active positions (`status: "published", expiresAt: { $gt: new Date() }`).
  - **Candidate Applied Portfolio (`/applied-jobs`)**:
    - When a recruiter archives or deletes a job, the candidate's application automatically moves from **Active Roles** to the **History & Closed** tab.
    - Prominently displays reason badges: `Archived by Recruiter`, `Position Expired`, or `Position Concluded`.
    - Candidate's application notes, review feedback, and interview timestamps remain permanently preserved.

---

## 41. Centralized Deep Notification Redirection & Candidate Applied Roles Experience (Phase 41)

- **Intelligent Deep Redirection from Notifications**:
  - **Recruiter Notification Click**: When a candidate applies or an interview is confirmed, clicking the in-app notification navigates directly to `/recruiter-jobs?jobId=${jobId}&appId=${newApplication._id}`.
  - **Auto-Pipeline Drawer Opening**: [RecruiterJobs.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/RecruiterJobs.jsx) automatically detects the `jobId` URL search parameter, opens the `PipelineModal` for that exact job, switches to the appropriate status tab if needed, and passes `highlightApplicantId`.
  - **Applicant Highlighting in Pipeline**: Both Kanban ([PipelineKanban.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/pipeline/PipelineKanban.jsx)) and List ([PipelineList.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/pipeline/PipelineList.jsx)) views highlight the target candidate card/row with an animated luminous cyan border and glowing ring.
- **Candidate In-App Receipt & Status Notifications**:
  - Upon job application, candidate immediately receives an in-app submission receipt notification (`/applied?jobId=${jobId}&appId=${newApplication._id}`).
  - When a recruiter updates status or schedules an interview, candidate notification directs to `/applied?jobId=${jobId}&appId=${appId}`.
  - [AppliedJobs.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/AppliedJobs.jsx) reads `jobId` / `appId` search parameters, auto-expands the matching accordion, scrolls smoothly into view, and highlights the card with a luminous ring.
- **Candidate Dashboard Applied Positions Showcase (`RecentAppliedJobs.jsx`)**:
  - Added a dedicated, interactive showcase on the **Candidate Dashboard** ([CandidateDashboard.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/CandidateDashboard.jsx)).
  - Displays live applied cards with company logo, title, salary, location, status pills, and interview indicators.
  - Clicking on any applied position card directly deep-links to that specific application on `/applied`.
- **Comprehensive Job Details Inspection Modal**:
  - Built an interactive **"Job Details"** modal inside [AppliedJobs.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/pages/AppliedJobs.jsx).
  - Candidates can click on any applied card to view the complete job description, required qualifications, company website, salary, and submission journey.
- **Universal Mobile Notification Bell**:
  - Normalized notification paths in [NotificationBell.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/NotificationBell.jsx) and removed desktop-only restrictions in [Navbar.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/Navbar.jsx) so mobile users can interact with notifications seamlessly.
- **350px Ultra-Compact Mobile Responsiveness (Candidate Dashboard)**:
  - **Application Journey ([ApplicationJourney.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/candidate/ApplicationJourney.jsx))**: Re-architected padding (`p-3 sm:p-5`), compact badge typography, icon dimensions, and responsive flex-wrap for 2-column metrics and bottom velocity banner so no text squishes or overflows at 320px–350px.
  - **Quick Actions ([CandidateQuickActions.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/candidate/CandidateQuickActions.jsx))**: Fine-tuned action card padding (`p-2.5 sm:p-3.5`), title/badge wrapping, and responsive interview callout.
  - **My Applied Positions ([RecentAppliedJobs.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/candidate/RecentAppliedJobs.jsx))**: Adaptive card layouts, responsive status badge positioning, mobile-optimized headers with full-width action buttons on mobile, and smooth padding transitions down to 350px viewports.
  - **Metric Stat Cards ([CandidateStatCard.jsx](file:///d:/Major%20Project%201/Job%20Portal/frontend/src/components/candidate/CandidateStatCard.jsx))**: Scaled icons and values gracefully for narrow mobile screens.

---

## 41. Responsive Left Drawer, Quick Navigation & Persona Hubs (Phase 41)

- **Universal Expandable / Collapsible Left Drawer (`CandidateDashboard.jsx`, `RecruiterDashboard.jsx`, `AdminDashboard.jsx`)**:
  - Engineered an interactive, sticky left sidebar drawer specifically for large screens (`lg:` / `>= 1024px`).
  - Added full expand/collapse capabilities (`isCollapsed` state with `PanelLeftOpen` / `PanelLeftClose` toggle button):
    - **Expanded Mode (`lg:w-64`)**: Displays full section icons, titles, live numerical count badges, and quick trigger action buttons.
    - **Collapsed Mode (`lg:w-20`)**: Transitions into an ultra-sleek icon dock with centered items, active glow, count indicator dots, and hover tooltips, allowing maximum width expansion for the active section.
- **Strict Device Separation (Zero Mobile Regression)**:
  - The Left Drawer is strictly hidden on mobile and tablet devices (`hidden lg:flex`).
  - Mobile screens (`< lg:`) preserve their native single-column stacked view and recently completed 350px ultra-compact responsiveness without side drawer clutter.
- **Removal of Bulky Welcome Banners & Quick Tools Migration**:
  - Replaced the large blue gradient "Welcome back" hero banners with sleek, tailored Executive Header Strips.
  - Migrated all primary workflows and quick career tools directly into the Left Drawer:
    - **Candidate Drawer**: `ATS Resume Scanner` (AI Powered), `AI Career Coach` (AI Powered), `Find Jobs`, `My Profile`, and `Account & Security`.
    - **Recruiter Drawer**: `Create Position` (`post-job`) and `Hiring Pipeline` (`recruiter-jobs`).
    - **Admin Drawer**: Instant `Refresh Platform Data` trigger.
- **Focused Executive Hubs (No Full-Page Stack Dumping)**:
  - **Candidate Executive Hub**: Renders strictly the high-level cockpit (4-Metric Pulse Grid, Interview Alert, and Application Journey Pipeline) with an executive summary card, eliminating repetitive multi-card dumps of applied jobs and resume centers.
  - **Recruiter Executive Hub**: Renders the high-level cockpit (4-Metric Pulse Grid, Interview Schedule, and 5-Stage Recruitment Funnel) with a pipeline summary card, loading detailed active job tables and candidate lists only when explicitly clicked.
  - **Super Admin Executive Hub**: Displays Super Admin Governance metrics, active users, moderation queues, and support ticket counters.
- **Full-Width Active Section Switching**:
  - Clicking any section in the drawer dynamically renders that specific section across 100% of the remaining screen width (`flex-1 min-w-0 w-full`), with a dedicated breadcrumb bar to return to the Executive Hub at any time.

---

## 42. User Dashboard 100% Mockup Design Match & 350px Mobile Architecture (Phase 42)

- **100% Pixel-Accurate UI Realization (`CandidateDashboard.jsx`)**:
  - Re-architected `CandidateDashboard.jsx` (aliased as `/user-dashboard`) to mirror the provided **HireNext User Dashboard** reference specification:
  - **Left Sidebar Navigation (`HireNext`)**:
    - Modern 3D isometric cube logo branding: `HireNext` with tagline _"Find Talent. Build Tomorrow."_
    - Exact 10 navigation items strictly matching the reference iconography, typography, and ordering:
      1. 🏠 `Dashboard` (Active solid blue pill with white typography & subtle shadow)
      2. 👤 `My Profile` (`/profile`)
      3. 🔍 `Find Jobs` (`/jobs`)
      4. 🤍 `Saved Jobs` (`/jobs?tab=saved`)
      5. 📄 `Applications` (`/applied`)
      6. 📝 `Skill Tests` (`/ats-checker`)
      7. 📅 `Interviews` (`/applied`)
      8. 💬 `Messages` (`/applied`)
      9. 🧰 `Career Tools` (`/ai-coach`)
      10. 🔔 `Notifications` (`/account-settings`)
  - **Top Navigation Bar**:
    - Omnipresent Search bar: _"Search jobs, companies..."_ with keyboard shortcut indicator.
    - Quick-action buttons: Messages, Notification Bell with live count indicator badge.
    - User Profile Pill with avatar, dynamic candidate full name (fallback `Rohit Kumar`), and role pill badge: `Job Seeker`.
  - **User Dashboard Header Strip**:
    - Title: `User Dashboard` (100% replacement of all legacy "Candidate Dashboard" labels).
    - Subtitle: `Build Your Career. Your Future Starts Here.`
  - **Hero Welcome Card**:
    - Sky-blue to indigo subtle card gradient.
    - `Welcome Back, [User Name]!` with motivational prompt _"Keep going, your dream job is closer than you think."_
    - Direct action CTA: `Complete Profile`.
    - Circular SVG completion progress gauge displaying `80%`.
  - **4 Stat Metric Cards**:
    - `12` Applications (blue folder icon & pill)
    - `5` Shortlisted (green check circle icon & pill)
    - `2` Interviews (purple video camera icon & pill)
    - `3` Offers (amber trophy award icon & pill)
  - **Recommended Jobs (3-Card Showcase)**:
    - **Google**: _Frontend Developer_ · Remote · Full-time · ₹ 8-15 LPA with solid blue `Apply` button.
    - **Microsoft**: _React Developer_ · Bengaluru · Full-time · ₹ 10-20 LPA with solid blue `Apply` button.
    - **Figma**: _UI/UX Designer_ · Hybrid · Full-time · ₹ 6-12 LPA with solid blue `Apply` button.
  - **Recent Applications Table**:
    - Columns: `Job Title`, `Company`, `Status`, `Applied On`.
    - Color-coded badges: `Shortlisted` (emerald), `Under Review` (blue), `Interview Scheduled` (purple), `Rejected` (rose).
  - **Bottom Dual Section**:
    - **Career Resources (4 Action Tiles)**: `Resume Builder`, `Skill Assessment`, `Interview Preparation`, `Career Guidance`.
    - **Inspirational Milestone Card**: _"Big Dreams Need Bold Steps!"_ accompanied by clean mountain hiker graphic illustration.
  - **Key Features Ribbon**:
    - `User Dashboard — Key Features` 10-point verified checklist with blue accent badges.
- **350px Mobile Viewport Architecture & Responsive Drawer**:
  - Full touch-friendly responsive drawer overlay on mobile (`< lg:`), accessible via top-left hamburger menu.
  - Table wrappers equipped with `overflow-x-auto` to prevent horizontal breaking.
  - Scalable grid columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) seamlessly adapting from 350px smartphones to 4K desktop screens.
- **Global Zero "2030" Sanitization**:
  - Confirmed 0 occurrences of "2030" across the entire codebase, ensuring all AI labels are cleanly rendered as `AI Powered`.

---

## 43. Compact Headers & Full-Width Content Architecture (Phase 43)

- **Elimination of Oversized / Bulky Page Banners**:
  - Replaced oversized multi-badge hero banner cards (`Candidate Career Hub`, `AI-POWERED CAREER INTELLIGENCE` 5xl heading in `JobList`, `PostJob`, `RecruiterDashboard`, etc.) across all major screens.
  - Eliminated distracting stacked headers that pushed actionable tables and listings below the fold.
- **Unified Standard Compact Header Structure**:
  - Standardized all page headers into sleek, single-row/compact headers matching the user's specification:
    - **Page Title**: `text-base sm:text-lg font-extrabold text-slate-900 dark:text-white`
    - **Count / Status Badge**: Compact pill (e.g. `5 Active`, `12 Available`, `Active Seeker`)
    - **Single-Line Subtitle**: `text-[11px] sm:text-xs text-slate-500 dark:text-slate-400`
    - Subtle bottom separator border (`border-b border-slate-200 dark:border-slate-800 pb-3`)
- **Full-Width Layout Expansion**:
  - Removed restrictive width containers (such as `max-w-7xl`, `max-w-5xl`, or `max-w-4xl`) and widened layouts to `w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0`.
  - Expanded `JobList` card grid from 3-columns to responsive 4-columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) taking full advantage of widescreen real estate without unnecessary side dead zones.
  - Aligned `CandidateDashboard`, `JobList`, `AppliedJobs`, `RecruiterDashboard`, `RecruiterJobs`, `AdminDashboard`, `Companies`, `JobAlerts`, `ATSResumeChecker`, `AICareerCoach`, `AccountSettings`, `Profile` (Candidate, Recruiter & Admin), and `ContactUs`.
- **Account Settings 2-Column Security & Device Intelligence Suite**:
  - Re-architected `Password & Authentication` into a full-width 12-column responsive layout (`lg:grid-cols-12`).
  - **Left (7 cols)**: Form controls with dynamic entropy strength bar and visibility toggles.
  - **Right (5 cols)**: Integrated multi-factor (MFA / Email OTP) protection card, active device and encrypted session inspector with `Sign Out Other Devices` action, and a 4-point password health checklist.

---

## 44. Unstop-Style "Explore Home" Landing Page & Guest Routing (Phase 44)

- **Dedicated "Explore Home" Default View (`frontend/src/pages/ExploreHome.jsx`)**:
  - Engineered specifically for non-logged-in visitors landing on root `/`, `/explore`, or `/explore-home`.
  - Automatically redirects authenticated candidates to `/candidate-dashboard`, recruiters to `/recruiter-dashboard`, and admins to `/admin-dashboard`.
- **Hero Opportunity Slider (Unstop Carousel)**:
  - 4 auto-sliding flagship opportunities (Google Solution Challenge, Flipkart GRiD 7.0, Tata Imagination Challenge, Amazon WOW).
  - Equipped with pause on hover, manual previous/next arrows, animated indicators, and slide counters.
- **Quick Category Navigation Grid**:
  - 6 interactive cards with vibrant gradient backgrounds: Jobs, Internships, Hackathons, Skill Quizzes, AI Coach, and Top Hiring Partners.
- **"Unlock Your Career" 4-Pillar Interactive Suite**:
  - _Learn & Practice_: Quizzes & Certified Profile Badges.
  - _Compete & Win_: Cash bounties & direct recruiter referrals.
  - _Early Career_: High-stipend internships with PPO offers.
  - _AI Acceleration_: Plain-text AI Career Coach & mock interview preparation.
- **Live Trending Previews & Trust Metrics**:
  - Previews for live hackathons and high-stipend internships.
  - Trust numbers: 10M+ Learners, 50K+ Opportunities, 2.5K+ Partners, ₹25Cr+ Won in Bounties.
- **Full 317px Mobile Responsiveness & Dual-Theme Compatibility**:
  - All grids, pills, and slider elements adapt down to 317px viewports without horizontal clipping.

---

## 45. Universal Enterprise Toast Notification System & Zero-Alert Enforcement (Phase 45)

- **Global Modern Toast Provider (`frontend/src/context/ToastContext.jsx`)**:
  - Engineered an enterprise-grade floating toast notification center powered by Framer Motion.
  - Multi-category styling:
    - **Success** (Emerald green, CheckCircle2)
    - **Error** (Rose red, AlertCircle)
    - **Warning** (Amber orange, AlertTriangle)
    - **Info** (Indigo/Cyan, Info)
    - **Auth / Sign In** (Blue/Cyan border, LogIn icon, integrated 1-click `Sign In` action button).
- **Specialized `requireAuth` Interceptor**:
  - Replaced all intrusive browser popups (`window.alert`) with `toast.requireAuth(message, actionLabel)`.
  - Prominently displays "Sign In Required", customized message (e.g. "Please sign in as a candidate to apply"), and an interactive button redirecting straight to `/login`.
- **Zero-Alert Policy Across Entire Codebase**:
  - Cleaned all occurrences of `alert(...)` in `JobList.jsx`, `Internships.jsx`, `Hackathons.jsx`, `AccountSettings.jsx`, and `PipelineModal.jsx`.
  - Verified 0 active `alert()` calls via codebase regex search.

---

## 46. Super Admin Console Streamlining & Duplicate Navigation Elimination (Phase 46)

- **Elimination of Redundant Inner Sidebar (`AdminDashboard.jsx`)**:
  - Removed the internal duplicate collapsible `<aside>` navigation drawer that squished content alongside the global app sidebar.
  - Eliminated conflicting duplicate collapse states (`isCollapsed`, `PanelLeftOpen`, `PanelLeftClose`).
- **Unified Modern Horizontal Navigation Bar**:
  - Replaced duplicate mobile and desktop sidebars with a single, sleek horizontal pill tab bar consistent across all screen viewports:
    - `Executive Hub` (`overview`)
    - `Automation Engine` (`automation`)
    - `Candidates` (with live total counter badge)
    - `Recruiters` (with live total counter badge)
    - `Jobs Moderation` (with live total counter badge)
    - `Support Desk` (with pending tickets counter badge)
  - Features obsidian/neon active highlights (`bg-slate-900 text-white dark:bg-white dark:text-slate-900`) and smooth touch horizontal scrolling.
- **Full-Width Console Real Estate**:
  - Main tab panels now occupy 100% of available screen width (`w-full min-w-0`) without side margins or horizontal cramped tables.
- **Synchronized Global Sidebar Links (`Sidebar.jsx`)**:
  - Updated Super Admin nav items in the global sidebar to point to actual valid dashboard tabs (`?tab=overview`, `?tab=automation`, `?tab=candidates`, `?tab=recruiters`, `?tab=jobs`, `?tab=tickets`).
- **Global Toast Integration**:
  - Replaced ad-hoc bounce banner with unified `useToast` notifications (`toast.success`).

---

## 47. Super Admin Profile Settings Crash Fix & Seamless Governance View (Phase 47)

- **Root Cause Diagnosed**:
  - In `frontend/src/pages/Profile.jsx`, the dedicated Super Admin view (`isAdmin === true`) referenced `<LogOut size={13} />` and an undefined function `handleSuperAdminLogout()`.
  - `LogOut` was missing from the `lucide-react` import statement, causing React to throw a runtime error (`Uncaught ReferenceError: LogOut is not defined`) whenever a Super Administrator navigated to `/profile` via the Navbar "Profile Settings" option.
- **Architectural Resolution (`Profile.jsx`)**:
  - Added `LogOut` icon to the `lucide-react` imports.
  - Destructured `logout` directly from `useAuth()`.
  - Implemented safe `handleSuperAdminLogout()` that handles graceful session termination, issues a clean `toast.info("Signed out from Super Administrator session")`, and redirects to `/login`.
  - Connected `useToast` to `saveMutation` for real-time feedback upon saving master administrative credentials.

---

## 48. Interactive System Architecture & Codebase Folder Structure Portals (Phase 48)

- **Interactive System Architecture Blueprint (`/architecture` · `ArchitectureDiagram.jsx`)**:
  - Complete, interactive 6-tier architecture visualization:
    - **Tier 1**: Client Presentation (React 18, Vite v8, Tailwind CSS v3, Framer Motion, TanStack Query, Context APIs).
    - **Tier 2**: API Gateway & Edge Security (Express 5, Helmet, express-rate-limit, Zod validators, native base64 DataURI).
    - **Tier 3**: Business Controller Domain (User, Job, Application, Company, Admin, Contact).
    - **Tier 4**: Autonomous Worker & Background Schedulers (`automation/` queue, candidate matcher, calendar, status notifier).
    - **Tier 5**: Cloud Intelligence & Asset CDN (Google Gemini AI Multi-Model Cascade, `pdf-parse-fork`, Cloudinary RAW storage).
    - **Tier 6**: Persistence Layer (MongoDB & Mongoose 9, compound unique indexes, atomic operators).
  - Multi-flow execution visualizers (Candidate application & AI fit, Recruiter self-host meet, Centralized job expiry & history preservation).
  - Infrastructure and network protocols specification table.
- **Interactive Codebase Folder Structure Blueprint (`/folder-structure` · `FolderStructure.jsx`)**:
  - Real-time search and filter bar for files and directories.
  - Recursive, expandable/collapsible visual tree highlighting directory responsibilities and key file components.
  - Raw ASCII tree view with 1-click **"Copy Tree"** button.
- **Modern Footer Navigation Bar Styling & Zero List Styles (`FooterBottomBar.jsx` & `FooterNavLinks.jsx`)**:
  - Enforced `list-none p-0 m-0` across all footer link lists, completely eliminating unwanted browser default bullets.
  - Replaced plain underlined text links with sleek, interactive rounded pill badges (`rounded-full px-3 py-1 bg-slate-100/70 border border-slate-200/80 hover:scale-105`).
  - Added direct, prominent action pills for **Architecture** (`/architecture`) and **Folder Tree** (`/folder-structure`) alongside legal and account settings links.

---

## 49. Triple-Dashboard Opportunity Management Subsystem: Hackathons, Quizzes & Internships (Phase 49)

- **Unified Opportunity Management Across Dashboards**:
  - Engineered end-to-end management capabilities for the three student & talent engagement verticals: **Hackathons**, **Skill Assessment Quizzes**, and **Internships** across all three platform personas.
- **Backend Architecture & Security Controls**:
  - **Data Schema Enhancements**:
    - `Hackathon` model: Added `createdBy` reference to `User` model, prize pool, registration deadline, criteria, and participant counts.
    - `Quiz` model: Added `createdBy` reference to `User` model, question arrays, difficulty classification, pass threshold, and skill tags.
  - **Authenticated CRUD Endpoints**:
    - `POST /api/hackathons/create`: Create hackathon with custom themes, stages, eligibility, and cash rewards.
    - `DELETE /api/hackathons/:id`: Secured role check ensuring only creators or Super Admins can purge hackathons.
    - `GET /api/hackathons/my-hackathons`: Filtered listing of recruiter-hosted hackathons.
    - `POST /api/quizzes/create`: Create custom candidate skill tests with custom questions, choices, and pass criteria.
    - `DELETE /api/quizzes/:id`: Secured quiz purge endpoint with ownership check.
    - `GET /api/quizzes/my-quizzes`: Filtered listing of recruiter-created tests.
- **Super Admin Command Console (`AdminDashboard.jsx` & `AdminOpportunitiesTab.jsx`)**:
  - Dedicated **"Opportunities (Hackathons, Quizzes, Internships)"** governance tab.
  - Platform-wide statistics counters: Active Hackathons, Verified Skill Tests, Active Internships.
  - Interactive tab switcher between Hackathons, Quizzes, and Internships.
  - Full platform override: Admin can create platform-level sponsored hackathons, platform skill certifications, and delete expired/spam listings instantly.
- **Recruiter Command Center Hub (`RecruiterDashboard.jsx` & `RecruiterOpportunitiesHub.jsx`)**:
  - **Post & Manage Internships**: Quick posting trigger with `jobType: "Internship"` preset, live listing cards, applicant trackers, and stipend displays.
  - **Host Company Hackathons**: Interactive modal to publish engineering hackathons with title, description, team size, prize pool, and registration deadline.
  - **Design Custom Skill Screening Quizzes**: Interactive quiz builder allowing recruiters to define test questions, 4 multiple-choice answers, correct answer index, and required pass percentage for job applicant screening.
- **Candidate Career Intelligence Hub (`CandidateDashboard.jsx` & `CandidateOpportunitiesWidget.jsx`)**:
  - **Active Hackathon Arena**: Displays registered hackathons with countdowns, team statuses, and direct access buttons.
  - **Verified Skill Badges**: Visual showcase of passed quizzes with verified badges automatically awarded to candidate profile skills (e.g., `Verified React Mastery`).
  - **Internship Fast-Track**: Direct shortcut to discover, filter, and apply to high-growth stipend internships.

---

## 50. Mobile PageSpeed & Core Web Vitals Optimization Engine (Phase 50)

- **Cumulative Layout Shift (CLS: 0.587 ➔ 0.00)**:
  - **Eliminated Full-Screen Blocking Loader**: `AuthContext.jsx` now evaluates initial state without firing a blocking `/user/me` request for guest visitors and crawlers.
  - **Eager Home Route Import**: `ExploreHome.jsx` is loaded eagerly (6.7 kB gzip), eliminating suspense fallback layout flashes and mid-load DOM mutations.
  - **CSS Layout Containment (`Footer.jsx`)**: Added `content-visibility: auto` and `contain-intrinsic-size: auto 450px` to stabilize off-screen footer rendering.
  - **Main Viewport Minimum Height (`App.jsx`)**: Added `min-h-[calc(100vh-4rem)]` to `<main>` to maintain viewport stability.
- **Render-Blocking CSS & Font Speed-Up (`index.html`)**:
  - Replaced synchronous Google Fonts request with asynchronous non-render-blocking preload (`media="print" onload="this.media='all'"`).
  - Pruned unused font weights to minimize payload over mobile networks.
- **Accessibility & Mobile Touch Target Compliance (81 ➔ 95+)**:
  - **Discernible Links**: Added `aria-label="PathKhojo — Home"` to `PathKhojoLogo.jsx` when logo text is concealed on mobile viewports.
  - **Sidebar Tap Targets & ARIA**: Enlarged mobile close button to $\ge 44\text{px}$ touch target with `aria-label="Close navigation sidebar"`. Added labels to collapse and action buttons.
  - **Navbar Header Actions**: Ensured all icon buttons (filter trigger, search clear, theme toggles, user profile dropdown) have explicit `aria-label` attributes.
  - **Newsletter Form**: Added `id="newsletter-email-input"`, hidden `<label>`, and `aria-label` to the footer subscription input.
- **AI Crawlers & SEO (`frontend/public/llms.txt`)**:
  - Created standard `llms.txt` file detailing platform URLs, dual-role workflows, and APIs for AI search engines (Perplexity, ChatGPT, Gemini).
