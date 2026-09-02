# Project Roadmap

## Phase 1: Foundation, Redux Store & Authentication Flow
- [ ] Connect Redux store (Auth slice, Job slice, Company slice, Application slice).
- [ ] Implement Signup, Login, and Logout UI with role selection (`Student` vs `Recruiter`).
- [ ] Hook up authentication API (`/api/user/register`, `/api/user/login`, `/api/user/logout`).
- [ ] Build User Profile view & edit modal (Bio, Skills, Resume upload to Cloudinary).
- [ ] Test auth persistence, cookie credentials, and protected route wrappers.

## Phase 2: Job Seeker Experience (Home, Discovery, Job Details & Apply)
- [ ] Build Landing Page (Hero section, Category carousel, Latest jobs grid, Footer).
- [ ] Build Browse / Jobs page with filter sidebar (Location, Salary, Role type, Search query).
- [ ] Build Job Details page showing complete job description, requirements, company info, and Apply button.
- [ ] Integrate 1-click job application endpoint (`/api/application/apply/:id`).
- [ ] Implement Applied Jobs tracking table in User Profile with live status badges (`Pending`, `Accepted`, `Rejected`).

## Phase 3: Recruiter Portal (Company Management, Job Posting & Applicant Tracking)
- [ ] Recruiter Company Management: Register company, update company logo & details (`/api/company`).
- [ ] Job Posting Flow: Create and publish new job listings linked to registered company (`/api/job/post`).
- [ ] Recruiter Jobs Dashboard: List active jobs, view applicant counts, edit/toggle listings.
- [ ] Applicant Review Dashboard: View applicant profiles, view/download resumes, update application status (`/api/application/status/:id/update`).

## Phase 4: AI Matching, Recommendations & Analytics
- [ ] Resume & Skills Matching Algorithm: Compare user skills with job requirements and display match percentage badge.
- [ ] AI / Smart Job Recommendations section on seeker dashboard.
- [ ] Recruiter & Admin Analytics Dashboard: Metrics on applicant conversion, top roles, and hiring velocity.

## Phase 5: Verification, Polish, Security Audit & Production Readiness
- [ ] End-to-end user journeys validation (Seeker workflow + Recruiter workflow).
- [ ] Security hardening (sanitize inputs, ensure authorization checks on all recruiter routes).
- [ ] Responsive UI audit across mobile, tablet, and desktop breakpoints.
- [ ] Performance and bundle optimization.
