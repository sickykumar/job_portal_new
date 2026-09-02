# NexHire — Intelligent Production-Ready Job Portal

NexHire is an enterprise-grade, modern talent discovery and hiring platform built on Node.js, Express, MongoDB Atlas, Google Gemini AI, and React (Vite).

---

## Key Features

- **Candidate Experience**:
  - Live search with instant keyword, location, and arrangement filters (Remote, Full-Time, Internship, etc.).
  - Detailed Job Drawer with transparent compensation, qualifications, and company branding.
  - **Gemini AI Match Assistant**: Instant fit percentage, strengths breakdown, and missing skills guidance.
  - One-click application submission with real-time lifecycle tracking (`pending`, `accepted`, `rejected`).
  - Candidate profile and resume management.

- **Employer / Recruiter Experience**:
  - Multi-company profile management (logos, company mission, HQ, website).
  - Job posting wizard with **Gemini AI Job Description Generator**.
  - Pipeline dashboard: review applicants, inspect candidate contact details & resumes, and update decision statuses.

- **Production Security & Architecture**:
  - **IDOR Protection**: Strict ownership checks across applicant viewing, job posting, company editing, and status transitions.
  - **Zero Vulnerabilities**: Vulnerable legacy packages (`cloud`, `datauri`) eliminated; safe native buffer base64 encoding implemented.
  - **Helmet Security Headers & Rate Limiting**: Dedicated auth and general route limits to prevent brute-force attacks.
  - **MongoDB Compound & Text Indexes**: Compound unique index `{ job: 1, applicant: 1 }` preventing race conditions and duplicate applications.

---

## Local Development Setup

### 1. Backend

```bash
cd Backend
npm install
npm run dev
```

*Server starts on `http://localhost:5000` (or `PORT` specified in `.env`).*

Run automated tests:
```bash
npm test
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

*Vite dev server starts on `http://localhost:5173`.*

To build for production:
```bash
npm run build
```
