import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Search,
  FileText,
  Bot,
  Bell,
  Building2,
  PlusCircle,
  LayoutDashboard,
  Shield,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Users,
  Compass,
  Send,
  Zap,
  CheckCircle2,
  X,
  ExternalLink,
  Sliders,
  GraduationCap,
  Trophy,
  Award,
  Cpu,
  LifeBuoy,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PathKhojoLogo from "./PathKhojoLogo";

/**
 * Sidebar Component (Unstop-Inspired Left Navigation Bar)
 * 
 * Features:
 * - Fixed left docking (h-screen, fixed top-0 left-0)
 * - Expand (w-44 / 176px) and Collapse (w-16 / 64px) modes
 * - Dynamic role-aware navigation (Logged Out, Candidate, Recruiter, Admin)
 * - Accordion sub-menus with chevron triggers
 * - Unstop-style rounded pill active highlight
 * - Bottom promo callout cards
 * - Mobile slide-over drawer integration
 */
const Sidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role; // "student" | "recruiter" | "admin" | undefined

  // Sub-menu accordion state
  const [aiMenuOpen, setAiMenuOpen] = useState(
    location.pathname.includes("ats") || location.pathname.includes("ai-coach") || location.pathname.includes("job-alerts")
  );

  // Close mobile drawer on route change
  useEffect(() => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("nexhire_sidebar_collapsed", next ? "true" : "false");
  };

  // Primary CTA Button Action
  const handlePrimaryCta = () => {
    if (!user) {
      navigate("/register");
    } else if (role === "recruiter") {
      navigate("/post-job");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/jobs");
    }
  };

  // Check if link is active
  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (< 1024px) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Fixed Sidebar Rail */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-[#0c1322] border-r border-slate-200/90 dark:border-slate-800/80 transition-all duration-300 ease-in-out select-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-16" : "w-44"}
        `}
      >
        {/* Top Header: Logo + Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <PathKhojoLogo
              size="sm"
              showText={!isCollapsed}
              showSubtitle={!isCollapsed}
              asLink={true}
              to="/"
            />
          </div>

          {/* Desktop Collapse/Expand Toggle Button (« / ») */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action CTA Button (Unstop Style Pill) */}
        <div className="p-2.5 flex-shrink-0">
          {!isCollapsed ? (
            <button
              onClick={handlePrimaryCta}
              className="w-full py-2 px-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all group active:scale-[0.98]"
            >
              {role === "recruiter" ? (
                <>
                  <PlusCircle className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Post a Job</span>
                </>
              ) : role === "admin" ? (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Explore Jobs</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handlePrimaryCta}
              title={role === "recruiter" ? "Post a Job" : "Explore Jobs"}
              className="w-9 h-9 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              {role === "recruiter" ? (
                <PlusCircle className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Scrollable Navigation Items Rail */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 scrollbar-none">
          {/* 1. LOGGED OUT / GUEST NAVIGATION */}
          {!user && (
            <>
              <NavItem
                to="/"
                icon={Compass}
                label="Explore Home"
                active={isActive("/", true)}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/jobs"
                icon={Briefcase}
                label="Find Jobs"
                active={isActive("/jobs")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/internships"
                icon={GraduationCap}
                label="Internships"
                active={isActive("/internships")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/hackathons"
                icon={Trophy}
                label="Hackathons"
                active={isActive("/hackathons")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/quizzes"
                icon={Award}
                label="Skill Quizzes"
                active={isActive("/quizzes") || isActive("/practice")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/ai-coach"
                icon={Sparkles}
                label="AI Career Coach"
                active={isActive("/ai-coach")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/companies"
                icon={Building2}
                label="Companies"
                active={isActive("/companies")}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* 2. CANDIDATE (STUDENT) NAVIGATION */}
          {user && role === "student" && (
            <>
              <NavItem
                to="/user-dashboard"
                icon={LayoutDashboard}
                label="Executive Hub"
                active={isActive("/user-dashboard", true)}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/jobs"
                icon={Briefcase}
                label="Find Jobs"
                active={isActive("/jobs")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/internships"
                icon={GraduationCap}
                label="Internships"
                active={isActive("/internships")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/hackathons"
                icon={Trophy}
                label="Hackathons"
                active={isActive("/hackathons")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/quizzes"
                icon={Award}
                label="Skill Quizzes"
                active={isActive("/quizzes") || isActive("/practice")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/applied"
                icon={Send}
                label="My Applications"
                active={isActive("/applied")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/resume-center"
                icon={FileText}
                label="Resume Center"
                active={isActive("/resume-center") || isActive("/resume")}
                isCollapsed={isCollapsed}
              />

              {/* Accordion Sub-menu for AI Career Tools */}
              <div className="pt-1">
                {!isCollapsed ? (
                  <div>
                    <button
                      onClick={() => setAiMenuOpen(!aiMenuOpen)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        aiMenuOpen
                          ? "text-blue-600 dark:text-cyan-400 bg-blue-50/50 dark:bg-blue-950/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span className="truncate">Career Tools</span>
                      </div>
                      {aiMenuOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {aiMenuOpen && (
                      <div className="pl-6 pr-1 py-1 space-y-1">
                        <SubNavItem
                          to="/ats-checker"
                          label="ATS Scanner"
                          active={isActive("/ats-checker")}
                        />
                        <SubNavItem
                          to="/ai-coach"
                          label="AI Coach"
                          active={isActive("/ai-coach")}
                        />
                        <SubNavItem
                          to="/job-alerts"
                          label="Job Alerts"
                          active={isActive("/job-alerts")}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <NavItem
                    to="/ats-checker"
                    icon={Sparkles}
                    label="ATS Scanner"
                    active={isActive("/ats-checker")}
                    isCollapsed={isCollapsed}
                  />
                )}
              </div>

              <NavItem
                to="/companies"
                icon={Building2}
                label="Companies"
                active={isActive("/companies")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/settings"
                icon={Sliders}
                label="Settings"
                active={isActive("/settings")}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* 3. RECRUITER NAVIGATION */}
          {user && role === "recruiter" && (
            <>
              <NavItem
                to="/recruiter-dashboard"
                icon={LayoutDashboard}
                label="Command Center"
                active={isActive("/recruiter-dashboard", true)}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/post-job"
                icon={PlusCircle}
                label="Post a Job"
                active={isActive("/post-job")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/recruiter-jobs"
                icon={Users}
                label="Pipelines & Kanban"
                active={isActive("/recruiter-jobs")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/ats-checker"
                icon={Sparkles}
                label="ATS Resume Review"
                active={isActive("/ats-checker")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/companies"
                icon={Building2}
                label="Company Profile"
                active={isActive("/companies")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/settings"
                icon={Sliders}
                label="Settings"
                active={isActive("/settings")}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* 4. SUPER ADMIN NAVIGATION */}
          {user && role === "admin" && (
            <>
              <NavItem
                to="/admin-dashboard?tab=overview"
                icon={LayoutDashboard}
                label="Executive Hub"
                active={isActive("/admin-dashboard") && (!location.search || location.search.includes("tab=overview"))}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/admin-dashboard?tab=automation"
                icon={Cpu}
                label="Automation Engine"
                active={location.search.includes("tab=automation")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/admin-dashboard?tab=candidates"
                icon={Users}
                label="Candidates"
                active={location.search.includes("tab=candidates")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/admin-dashboard?tab=recruiters"
                icon={Briefcase}
                label="Recruiters"
                active={location.search.includes("tab=recruiters")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/admin-dashboard?tab=jobs"
                icon={FileText}
                label="Job Moderation"
                active={location.search.includes("tab=jobs")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/admin-dashboard?tab=tickets"
                icon={LifeBuoy}
                label="Support Desk"
                active={location.search.includes("tab=tickets")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/companies"
                icon={Building2}
                label="Companies"
                active={isActive("/companies")}
                isCollapsed={isCollapsed}
              />
            </>
          )}
        </div>

        {/* Bottom Callout Promo Cards (Unstop Style) */}
        {!isCollapsed ? (
          <div className="p-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
            {/* Promo Card 1: For Employers / Recruiter CTA */}
            <div
              onClick={() => {
                if (!user) navigate("/register?role=recruiter");
                else if (role === "recruiter") navigate("/post-job");
                else navigate("/jobs");
              }}
              className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-cyan-400 font-bold text-[11px]">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Post a Job or Internship</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-2">
                Hire verified talent through smart AI matching.
              </p>
            </div>

            {/* Promo Card 2: AI Career Boost */}
            <div
              onClick={() => navigate("/ats-checker")}
              className="p-2 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">ATS Resume Optimizer</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-2">
                Benchmark your CV against recruiter algorithms.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate("/ats-checker")}
              title="ATS Resume Optimizer"
              className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

/**
 * NavItem Helper Component
 */
const NavItem = ({ to, icon: Icon, label, active, isCollapsed }) => {
  return (
    <Link
      to={to}
      title={isCollapsed ? label : undefined}
      className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
        active
          ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-semibold shadow-xs"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
      } ${isCollapsed ? "justify-center px-0" : ""}`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          active
            ? "text-blue-600 dark:text-cyan-400"
            : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
        }`}
      />
      {!isCollapsed && <span className="truncate">{label}</span>}

      {/* Collapsed Tooltip Hover Indicator */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
};

/**
 * SubNavItem Helper Component
 */
const SubNavItem = ({ to, label, active }) => {
  return (
    <Link
      to={to}
      className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
        active
          ? "text-blue-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800 font-semibold"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
      }`}
    >
      {label}
    </Link>
  );
};

export default Sidebar;
