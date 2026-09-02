# Project State & Memory

## Current Status
- **Phase**: Initialization completed (`/gsd-new-project`)
- **Active Milestone**: Milestone 1 - Full-Stack MERN Job Portal MVP & Core Portals
- **Next Phase**: Phase 1: Foundation, Redux Store & Authentication Flow

## Key Decisions & Architecture
- Full-stack MERN with existing Express v5 backend and React 19 + Vite frontend.
- Tailwind CSS v4 styling with Radix UI / shadcn components.
- State management: Redux Toolkit for auth, company, job, and application state.
- Authentication: JWT in `HttpOnly` cookies, role-differentiated access (`student` / `recruiter`).
- Uploads: Multer memory storage + Cloudinary upload.

## Pending Actions
- Run `/gsd-plan-phase 1` to plan and execute Phase 1 (Auth, Redux Store, Profile & Resume).
