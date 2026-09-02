# Project Requirements

## Core Epics & Capabilities

### 1. Authentication, Authorization & Profiles
- **User Roles**: `student` (job seeker) and `recruiter` (employer).
- **Authentication**:
  - Secure signup and login with hashed passwords (`bcryptjs`).
  - JWT generation and storage in `HttpOnly` secure cookies.
  - Role-protected routes (frontend guards + backend `isAuthenticated` middleware).
- **Profile Management**:
  - Bio, contact information, skills array.
  - Resume PDF upload via Cloudinary, with viewable/downloadable URL.
  - Profile avatar image upload.

### 2. Companies & Employer Operations
- **Company Profile**: Name, description, website, location, logo upload via Cloudinary.
- **Ownership**: Only the recruiter who registered the company can manage and post jobs under it.
- **Recruiter Dashboard**: Table listing registered companies and posted jobs with real-time applicant counts.

### 3. Job Management & Discovery
- **Job Creation**: Title, description, requirements/skills, salary range, location, job type (Full-time, Part-time, Remote, Internship), positions count, company association.
- **Job Search & Filters**:
  - Search by keyword, role title, company name.
  - Filter by location, industry, job type, salary range.
  - Paginated / infinite scroll listings with sort (most recent, highest salary).
- **Job Details**: Rich view of job description, requirements, company info, and application state.

### 4. Application Tracking System (ATS)
- **1-Click Apply**: Job seekers can apply directly using their profile resume and details.
- **Duplicate Prevention**: Prevent users from applying multiple times to the same job.
- **Application History**: Job seekers view all submitted applications with dynamic status badges (`pending`, `accepted`, `rejected`).
- **Recruiter Review**: Recruiter views all applicants for their jobs, inspects applicant resume, and updates status in real-time.

### 5. AI Recommendations & Screening
- **Skill Matching**: Highlight percentage match between applicant skills and job requirements.
- **Smart Recommendations**: Suggest relevant jobs based on user profile skills and application history.

### 6. Admin & Analytics
- **Recruiter & Platform Metrics**: Total jobs posted, total applications received, acceptance rate breakdown.
- **Interactive UI**: Data visualizations and clear summary cards.
