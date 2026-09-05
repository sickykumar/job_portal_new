import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  LifeBuoy,
  RefreshCw,
  ShieldAlert,
  LogIn,
  ArrowLeft,
  Cpu,
  Trophy,
  Activity,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import AdminCandidatesTab from "../components/admin/AdminCandidatesTab";
import AdminRecruitersTab from "../components/admin/AdminRecruitersTab";
import AdminJobsTab from "../components/admin/AdminJobsTab";
import AdminTicketsTab from "../components/admin/AdminTicketsTab";
import AdminResolveModal from "../components/admin/AdminResolveModal";
import AdminAutomationTab from "../components/admin/AdminAutomationTab";
import AdminOpportunitiesTab from "../components/admin/AdminOpportunitiesTab";
import AdminHealthTab from "../components/admin/AdminHealthTab";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const isAdmin = user?.role === "admin";

  // 1. Fetch Overview & Metrics (Only if user is admin)
  const { data: overviewData, isLoading: loadingOverview, refetch: refetchOverview } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await api.get("/admin/overview");
      return res.data?.success ? res.data.data : {};
    },
    enabled: isAdmin,
  });

  // 2. Fetch Candidates
  const { data: candidatesData, refetch: refetchCandidates } = useQuery({
    queryKey: ["admin-candidates"],
    queryFn: async () => {
      const res = await api.get("/admin/candidates");
      return res.data?.success ? res.data.candidates : [];
    },
    enabled: isAdmin && (activeTab === "candidates" || activeTab === "overview"),
  });

  // 3. Fetch Recruiters
  const { data: recruitersData, refetch: refetchRecruiters } = useQuery({
    queryKey: ["admin-recruiters"],
    queryFn: async () => {
      const res = await api.get("/admin/recruiters");
      return res.data?.success ? res.data.recruiters : [];
    },
    enabled: isAdmin && (activeTab === "recruiters" || activeTab === "overview"),
  });

  // 4. Fetch Jobs
  const { data: jobsData, refetch: refetchJobs } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const res = await api.get("/admin/jobs");
      return res.data?.success ? res.data.jobs : [];
    },
    enabled: isAdmin && (activeTab === "jobs" || activeTab === "overview"),
  });

  // 5. Fetch Support Tickets
  const { data: ticketsData, refetch: refetchTickets } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const res = await api.get("/admin/tickets");
      return res.data?.success ? res.data.tickets : [];
    },
    enabled: isAdmin && (activeTab === "tickets" || activeTab === "overview"),
  });

  const handleRefreshActive = () => {
    if (activeTab === "overview") refetchOverview();
    if (activeTab === "candidates") refetchCandidates();
    if (activeTab === "recruiters") refetchRecruiters();
    if (activeTab === "jobs") refetchJobs();
    if (activeTab === "tickets") refetchTickets();
    if (activeTab === "automation") {
      queryClient.invalidateQueries({ queryKey: ["automation-overview"] });
      queryClient.invalidateQueries({ queryKey: ["automation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["automation-flagged-jobs"] });
    }
  };

  const openResolveModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsResolveModalOpen(true);
  };

  const handleTicketResolved = (ticketId, resolutionNotes) => {
    queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    toast.success(`Ticket #${ticketId} resolved successfully and notification email sent!`);
  };

  // Restrict Non-Admin Access
  if (!authLoading && !isAdmin) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-xl shadow-rose-500/10">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl tracking-tight">
          Super Admin Access Required
        </h1>
        <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The Super Admin Console is strictly segregated. Only authenticated users with the <strong className="text-slate-800 dark:text-slate-200 font-bold">Admin</strong> role can access platform governance, user moderation, and support desk.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(user?.role === "recruiter" ? "/recruiter-dashboard" : user?.role === "student" ? "/candidate-dashboard" : "/")}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft size={14} />
            <span>Return to My Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="btn-primary flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/25"
          >
            <LogIn size={14} />
            <span>Sign In as Admin</span>
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Executive Hub", icon: LayoutDashboard },
    { id: "health", label: "System Health & Uptime", icon: Activity },
    { id: "automation", label: "Automation Engine", icon: Cpu },
    { id: "opportunities", label: "Opportunities (Hackathons, Quizzes, Internships)", icon: Trophy },
    { id: "candidates", label: "Candidates", icon: Users, count: candidatesData?.length },
    { id: "recruiters", label: "Recruiters", icon: Briefcase, count: recruitersData?.length },
    { id: "jobs", label: "Jobs Moderation", icon: FileText, count: jobsData?.length },
    { id: "tickets", label: "Support Desk", icon: LifeBuoy, count: ticketsData?.filter(t => t.status === "pending")?.length },
  ];

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 space-y-4 min-w-0">
      {/* Sleek Compact Header (Standardized across all dashboards) */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Platform Command Center
            </h1>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Super Admin Console
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Platform governance, automated moderation pipelines, and support desk
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefreshActive}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition shadow-xs"
          >
            <RefreshCw size={13} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Modern Unified Horizontal Tabs Bar (Consistent across Mobile & Desktop, No Duplicate Drawer) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800/80 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={14} className={isActive ? "text-indigo-400 dark:text-indigo-600" : "text-slate-400 dark:text-slate-500"} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Full-Width Content Area */}
      <main className="w-full min-w-0 pt-2">
        {activeTab === "overview" && (
          <AdminOverviewTab
            data={overviewData || {}}
            loading={loadingOverview}
            onSelectTab={handleTabChange}
          />
        )}

        {activeTab === "health" && (
          <AdminHealthTab />
        )}

        {activeTab === "automation" && (
          <AdminAutomationTab />
        )}

        {activeTab === "opportunities" && (
          <AdminOpportunitiesTab />
        )}

        {activeTab === "candidates" && (
          <AdminCandidatesTab
            candidates={candidatesData || []}
            onRefresh={refetchCandidates}
          />
        )}

        {activeTab === "recruiters" && (
          <AdminRecruitersTab
            recruiters={recruitersData || []}
            onRefresh={refetchRecruiters}
          />
        )}

        {activeTab === "jobs" && (
          <AdminJobsTab
            jobs={jobsData || []}
            onRefresh={refetchJobs}
          />
        )}

        {activeTab === "tickets" && (
          <AdminTicketsTab
            tickets={ticketsData || []}
            onOpenResolveModal={openResolveModal}
          />
        )}
      </main>

      {/* Resolve Ticket Modal */}
      <AdminResolveModal
        ticket={selectedTicket}
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onResolved={handleTicketResolved}
      />
    </div>
  );
};

export default AdminDashboard;
