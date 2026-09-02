# Job Portal (MERN Platform)

## Overview
A modern, production-grade Full-Stack MERN Job Portal platform connecting Job Seekers (Students / Professionals) and Recruiters (Employers / Companies) with applicant tracking, modern UX/UI, administrative analytics, and intelligent matching capabilities.

## Architecture & Technology Stack
- **Backend**:
  - Runtime: Node.js, Express.js (v5)
  - Database & ODM: MongoDB, Mongoose (v9)
  - Authentication & Security: JWT (JSON Web Tokens), HttpOnly cookies, bcryptjs password hashing
  - File Uploads & Media: Multer (memory storage), DataURI, Cloudinary
  - Architecture: REST API (`/api/user`, `/api/company`, `/api/job`, `/api/application`)
- **Frontend**:
  - Runtime & Bundler: React 19, Vite (v7)
  - Styling & Design: Tailwind CSS v4, Radix UI / shadcn components, Lucide icons, Geist fonts
  - State Management: Redux Toolkit, React-Redux
  - Routing & Client: React Router DOM (v7), Axios with credentials
- **Core Personas**:
  - **Job Seeker (Student / Applicant)**: Search jobs, filter by location/role/salary, build profile, upload resume, 1-click apply, track application status.
  - **Recruiter (Employer)**: Register & manage companies, post/edit job openings, review applicants, accept/reject candidate applications.
  - **Platform Admin**: Monitor platform health, manage postings, monitor analytics.

## Guiding Principles
- **Ponytail Simplicity**: Minimal abstractions, reuse existing MERN endpoints, clean state flow.
- **Visual Polish**: Modern typography, vibrant and accessible micro-interactions, responsive layouts.
- **Production Hardiness**: Rigorous validation, secure authentication, cookie management, role authorization.
