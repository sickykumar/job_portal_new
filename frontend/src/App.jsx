import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/footer";
import AuthModal from "./components/AuthModal";
import UniversalLoader from "./components/common/UniversalLoader";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";
import ServerWarmupBanner from "./components/common/ServerWarmupBanner";

// Production Code-Splitting with React.lazy
const ExploreHome = lazy(() => import("./pages/ExploreHome"));
const JobList = lazy(() => import("./pages/JobList"));
const AppliedJobs = lazy(() => import("./pages/AppliedJobs"));
const PostJob = lazy(() => import("./pages/PostJob"));
const RecruiterJobs = lazy(() => import("./pages/RecruiterJobs"));
const Companies = lazy(() => import("./pages/Companies"));
const Profile = lazy(() => import("./pages/Profile"));
const CandidateDashboard = lazy(() => import("./pages/CandidateDashboard"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const AICareerCoach = lazy(() => import("./pages/AICareerCoach"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ATSResumeChecker = lazy(() => import("./pages/ATSResumeChecker"));
const JobAlerts = lazy(() => import("./pages/JobAlerts"));
const Internships = lazy(() => import("./pages/Internships"));
const Hackathons = lazy(() => import("./pages/Hackathons"));
const SkillQuizzes = lazy(() => import("./pages/SkillQuizzes"));
const ResumeCenter = lazy(() => import("./pages/ResumeCenter"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
import ErrorPage from "./pages/ErrorPage";
const ArchitectureDiagram = lazy(() => import("./pages/ArchitectureDiagram"));
const FolderStructure = lazy(() => import("./pages/FolderStructure"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function MainContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar expand/collapse state (persisted in localStorage)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("nexhire_sidebar_collapsed") === "true";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initial Auth Check: Display Universal Cyber Loader
  if (loading) {
    return <UniversalLoader fullScreen={true} message="Initializing NexHire Career Portal..." />;
  }

  // Hide massive marketing footer on all operating dashboards and admin consoles
  const isDashboardOrConsole =
    location.pathname.startsWith("/admin") ||
    location.pathname.includes("dashboard") ||
    location.pathname.startsWith("/user-") ||
    location.pathname.startsWith("/candidate-") ||
    location.pathname.startsWith("/recruiter-");

  const handleNavigate = (dest) => {
    if (!dest) return;
    if (dest === "explore") {
      navigate("/");
    } else if (dest.startsWith("/")) {
      navigate(dest);
    } else {
      navigate(`/${dest}`);
    }
  };

  const handleAuthSuccess = (loggedInUser) => {
    const targetUser = loggedInUser || user;
    if (targetUser?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (targetUser?.role === "recruiter") {
      navigate("/recruiter-dashboard");
    } else if (targetUser?.role === "student") {
      navigate("/candidate-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Fixed Left Sidebar (Unstop-style, globally visible) */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Content Wrapper: offset by sidebar width on desktop */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-44"
        }`}
      >
        {/* Sticky Top Navigation Bar */}
        <Navbar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          setMobileOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 w-full min-w-0 overflow-x-hidden">
          <Suspense fallback={<UniversalLoader fullScreen={false} message="Loading view..." />}>
            <Routes>
          {/* Open Public Routes */}
          <Route
            path="/"
            element={
              !user ? (
                <ExploreHome />
              ) : user.role === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : user.role === "recruiter" ? (
                <Navigate to="/recruiter-dashboard" replace />
              ) : (
                <Navigate to="/candidate-dashboard" replace />
              )
            }
          />
          <Route path="/explore" element={<ExploreHome />} />
          <Route path="/explore-home" element={<ExploreHome />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobList />} />
          <Route path="/job/:id" element={<JobList />} />
          <Route path="/description/:id" element={<JobList />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/quizzes" element={<SkillQuizzes />} />
          <Route path="/practice" element={<SkillQuizzes />} />
          <Route path="/ai-coach" element={<AICareerCoach />} />
          <Route path="/resume-center" element={<ResumeCenter />} />
          <Route path="/resume" element={<ResumeCenter />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* Guest-Only Authentication Routes */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login onSuccess={handleAuthSuccess} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <Login onSuccess={handleAuthSuccess} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* User / Candidate Protected Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CandidateDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user%20dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CandidateDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CandidateDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate%20dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CandidateDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CandidateDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applied"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AppliedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ats-checker"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <ATSResumeChecker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-checker"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <ATSResumeChecker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-alerts"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <JobAlerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <JobAlerts />
              </ProtectedRoute>
            }
          />

          {/* Recruiter-Only Protected Routes */}
          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <RecruiterDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter_dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <RecruiterDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter%20dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <RecruiterDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <PostJob onJobCreated={() => navigate("/recruiter-jobs")} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-jobs"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <RecruiterJobs />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Common Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? (
                  <Navigate to="/admin-dashboard" replace />
                ) : user?.role === "recruiter" ? (
                  <Navigate to="/recruiter-dashboard" replace />
                ) : (
                  <CandidateDashboard onNavigate={handleNavigate} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-settings"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route path="/architecture" element={<ArchitectureDiagram />} />
          <Route path="/folder-structure" element={<FolderStructure />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>

      {/* Production Comprehensive Modern Footer (Hidden on Dashboards & Consoles) */}
      {!isDashboardOrConsole && <Footer />}

      {/* Auto-warmup & Cold-start friendly detector banner */}
      <ServerWarmupBanner />
      </div>
    </div>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <ToastProvider>
                <MainContent />
              </ToastProvider>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
