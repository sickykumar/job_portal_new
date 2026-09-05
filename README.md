# 🚀 NexHire — Autonomous Enterprise AI Job & Career Portal

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3+-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248.svg)](https://www.mongodb.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg)](https://deepmind.google/technologies/gemini/)
[![Security](https://img.shields.io/badge/Security-0_Vulnerabilities-emerald.svg)](https://sickykumar.in)

> **NexHire** is an autonomous, production-grade hiring and career development platform built with high performance, role-isolated architecture, Google Gemini AI integration, real-time meeting automations, modular email systems, and zero cold-start delay engineering.

---

## 👨‍💻 Author & Engineering Credits

- **Creator & Lead Architect**: [Sicky Kumar](https://sickykumar.in)
- **Portfolio & Official Website**: [https://sickykumar.in](https://sickykumar.in)
- **Security & Incident Contact**: [connect@sickykumar.in](mailto:connect@sickykumar.in)

---

## 🌟 Key Highlights & Architectural Modules

### 1. 🛡️ Triple-Role Security & Governance
- **Role Isolation**: Strict URL guards, token-based verification, and API-level IDOR protection for **Candidates**, **Recruiters**, and **Super Admins**.
- **Super Admin Isolation**: Super Admin operates under a dedicated master governance model (`isSuperAdmin: true`) with complete isolation from public signups and strict authentication verification.
- **Security Breach Auto-Alerting**: Any unauthorized or brute-force administrative access attempts trigger immediate alerts routed directly to the system architect at `connect@sickykumar.in` with client IP, timestamp, and user-agent context.
- **Strict Input Validation**: Validated via **Zod** across every API contract. Zero insecure legacy dependencies with 100% clean audit (`npm audit`).

### 2. ⚡ Autonomous Cold-Start Immunity Engine
- **Active Keep-Alive Daemon**: Background ping cycle (`utils/keepAlive.js`) executing every 10 minutes to prevent free-tier hosting platforms (Render, Railway, Fly.io) from spinning down into cold-sleep.
- **Client Fallback Warmup Banner**: Lightweight frontend warmup detector (`ServerWarmupBanner.jsx`) polling `/api/health` with animated recovery indicator so users never experience dropped requests or unresponsive interfaces.

### 3. 🧠 Google Gemini AI Suite (Plain-Text Formatting)
- **Multi-Model Fallback Cascade**: High availability routing (`gemini-flash-lite-latest` ➔ `gemini-flash-latest` ➔ `gemini-2.5-flash` ➔ `gemini-3.6-flash`) with 429 quota protection.
- **Resume Fit Analyzer**: In-depth candidate match percentage and skill gap recommendations powered by real PDF text parsing (`pdf-parse-fork`).
- **AI Career Coach & Interview Simulator**: Technical mock interview scenarios, salary counter-offer negotiation scripts, and STAR framework builder.
- **Auto-Generators**: One-click AI Bio generation, Job Description creation, and interview evaluation notes.

### 4. ✉️ Modular Enterprise Email Architecture
Located in `Backend/emailTemplates/`:
- `applicationReceived.template.js` — Recruiter notification on new application
- `applicationAccepted.template.js` — Candidate celebration and onboarding
- `applicationRejected.template.js` — Constructive feedback with recruiter notes
- `interviewScheduled.template.js` — Calendar sync, Google Meet link & `.ics` attachment
- `otpVerification.template.js` — One-Time Password delivery
- `welcomeUser.template.js` — Onboarding welcome email
- `weeklyJobAlertDigest.template.js` — Candidate personalized job discovery digests
- `securityBreachAlert.template.js` — Real-time unauthorized access alerts to `connect@sickykumar.in`

### 5. 💼 Opportunity Ecosystem
- **Comprehensive Listings**: Jobs, Remote Tech Roles, Internships, Hackathons, and Skill Quizzes with custom application workflows.
- **Kanban & Funnel Intelligence**: Recruiter candidate pipeline tracking (`pending` ➔ `shortlisted` ➔ `interview` ➔ `accepted` ➔ `hired` ➔ `rejected`).
- **Google Calendar & Meet Automation**: Integrated meeting generator for scheduled candidate interviews with auto-generated ICS calendar attachments.

---

## 📂 Project Architecture

```
Job Portal/
├── Backend/                    # Node.js & Express API Server
│   ├── config/                 # DB, Cloudinary & OAuth configuration
│   ├── controllers/            # Core business logic (auth, job, application, ai, kyc)
│   ├── emailTemplates/         # Modular production HTML email templates
│   ├── middlewares/            # Auth, role check, upload & rate-limiting guards
│   ├── models/                 # Mongoose schemas (User, Job, Company, Application, etc.)
│   ├── routes/                 # REST API routes
│   └── utils/                  # Validators, Keep-Alive, Calendar, DataURI & Nodemailer
├── frontend/                   # Modern React + Vite Application
│   ├── public/                 # Favicons, manifests, robots.txt & blueprints
│   ├── src/
│   │   ├── components/         # Reusable UI cards, tables, kanban & modals
│   │   ├── context/            # Global state & ThemeContext (Day/Night modes)
│   │   ├── hooks/              # Custom data fetching & mutation hooks
│   │   └── pages/              # Candidate, Recruiter & Super Admin consoles
└── README.md                   # System documentation
```

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- Node.js v18+ or v20+
- MongoDB Atlas cluster URI
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/sickykumar/job_portal_new.git
cd job_portal_new
```

### 2. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, and SMTP credentials
npm run dev
```
*Backend server runs on `http://localhost:5000`.*

Run tests:
```bash
npm test
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Vite frontend starts on `http://localhost:5173`.*

---

## 🔐 Environment Variables Guide (`Backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | API Server listening port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for access tokens | `your_secret_key` |
| `GEMINI_API_KEY` | Google Gemini AI key | `your_gemini_key` |
| `DEVELOPER_EMAIL`| Developer email for security breach alerts | `connect@sickykumar.in` |
| `SMTP_USER` | Nodemailer sender email address | `your_email@gmail.com` |
| `SMTP_PASS` | Nodemailer Google App password | `your_app_password` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

---

## 📄 License & Copyright

Copyright © 2026 [Sicky Kumar](https://sickykumar.in). All rights reserved.  
Built for enterprise scalability, resilience, and modern talent recruitment.
