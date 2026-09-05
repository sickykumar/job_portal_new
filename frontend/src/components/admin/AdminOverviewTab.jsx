import React from "react";
import { Users, Briefcase, FileText, Building2, LifeBuoy, CheckCircle, Clock, ArrowUpRight, ShieldCheck, Activity } from "lucide-react";

const AdminOverviewTab = ({ data, onSelectTab, onOpenTicketModal }) => {
  const metrics = data?.metrics || {};
  const recentCandidates = data?.recentCandidates || [];
  const recentRecruiters = data?.recentRecruiters || [];
  const recentTickets = data?.recentTickets || [];

  const cards = [
    {
      title: "Total Platform Users",
      value: metrics.totalUsers || 0,
      sub: `${metrics.totalCandidates || 0} Candidates · ${metrics.totalRecruiters || 0} Recruiters`,
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      tab: "candidates",
    },
    {
      title: "Active Jobs Posted",
      value: metrics.totalJobs || 0,
      sub: `${metrics.totalCompanies || 0} Companies Onboarded`,
      icon: Briefcase,
      gradient: "from-cyan-500 to-blue-600",
      tab: "jobs",
    },
    {
      title: "Total Applications",
      value: metrics.totalApplications || 0,
      sub: "Platform-wide submissions",
      icon: FileText,
      gradient: "from-violet-500 to-purple-600",
      tab: "candidates",
    },
    {
      title: "Pending Support Tickets",
      value: metrics.pendingTickets || 0,
      sub: `${metrics.resolvedTickets || 0} Resolved so far`,
      icon: LifeBuoy,
      gradient: metrics.pendingTickets > 0 ? "from-amber-500 to-red-500" : "from-emerald-500 to-teal-600",
      tab: "tickets",
      highlight: metrics.pendingTickets > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick System Health Bar */}
      <div 
        onClick={() => onSelectTab("health")}
        className="cursor-pointer group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition hover:bg-emerald-500/10 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">API Gateway & Database Status:</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                OPERATIONAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              MongoDB Atlas connected &bull; Express 5 active &bull; Click to open Real-time Health Telemetry
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition">
          <span>View Telemetry</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(card.tab)}
              className="dashboard-card relative p-5 cursor-pointer group hover:scale-[1.02] transition duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {card.sub}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {card.highlight && (
                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>Requires Admin Attention</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Candidates & Recent Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Support Tickets */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Support Requests
              </h4>
            </div>
            <button
              onClick={() => onSelectTab("tickets")}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recentTickets.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No support tickets found.</p>
            ) : (
              recentTickets.map((t) => (
                <div
                  key={t._id}
                  className="rounded-xl border border-slate-100 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/40 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-500 text-[11px]">{t.ticketId}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          t.status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : t.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                      {t.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {t.name} ({t.email})
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenTicketModal(t)}
                    className="shrink-0 rounded-lg bg-indigo-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400 transition"
                  >
                    {t.status === "resolved" ? "View" : "Resolve"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Registered Candidates */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Users className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Latest Candidate Registrations
              </h4>
            </div>
            <button
              onClick={() => onSelectTab("candidates")}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>Manage Candidates</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recentCandidates.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No candidates found.</p>
            ) : (
              recentCandidates.map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl border border-slate-100 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white uppercase">
                      {c.fullname?.[0] || "C"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {c.fullname}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{c.email}</p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      c.accountStatus === "suspended"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {c.accountStatus || "active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverviewTab;
