import React, { useState } from "react";
import { Search, Filter, CheckCircle2, Clock, LifeBuoy, AlertCircle, MessageSquare, ChevronDown } from "lucide-react";

const AdminTicketsTab = ({ tickets = [], onOpenResolveModal }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = tickets.filter((t) => {
    // Status filter
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    // Category filter
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    // Search
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.ticketId?.toLowerCase().includes(q) ||
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q)
    );
  });

  const pendingCount = tickets.filter((t) => t.status === "pending").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="space-y-4">
      {/* Filters & Search Header */}
      <div className="dashboard-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Support Desk & Tickets ({filtered.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review Contact Us submissions, write resolutions, and automatically notify users via email.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket ID, user, subject..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Status Filter Tabs & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All (${tickets.length})` },
              { id: "pending", label: `Pending (${pendingCount})`, badge: pendingCount > 0 },
              { id: "in_progress", label: `In Progress (${inProgressCount})` },
              { id: "resolved", label: `Resolved (${resolvedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === tab.id
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="bug_report">Bug Report</option>
              <option value="account_issue">Account Issue</option>
              <option value="feature_request">Feature Request</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="dashboard-card p-12 text-center text-slate-500">
            <LifeBuoy className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold">No tickets found</p>
            <p className="text-xs mt-0.5">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filtered.map((ticket) => {
            const isExpanded = expandedId === ticket._id;
            const isResolved = ticket.status === "resolved";
            const isInProgress = ticket.status === "in_progress";

            return (
              <div
                key={ticket._id}
                className="dashboard-card p-4 transition duration-200 hover:border-slate-300 dark:hover:border-slate-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                      {ticket.ticketId}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isResolved
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : isInProgress
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 capitalize">
                      {ticket.category?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Subject and User line */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    From: <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.name}</span> ({ticket.email})
                  </p>
                </div>

                {/* Message preview or full */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/40">
                  <p className={`text-slate-700 dark:text-slate-300 whitespace-pre-wrap ${!isExpanded ? "line-clamp-2" : ""}`}>
                    {ticket.message}
                  </p>
                  {ticket.message?.length > 120 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ticket._id)}
                      className="mt-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>{isExpanded ? "Show Less" : "Read Full Inquiry"}</span>
                      <ChevronDown className={`h-3 w-3 transition transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {/* Existing Resolution Note if present */}
                {ticket.resolutionNotes && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolution Response Sent:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap pl-5">
                      {ticket.resolutionNotes}
                    </p>
                    {ticket.resolvedAt && (
                      <p className="text-[10px] text-slate-400 pl-5 mt-1">
                        Resolved on {new Date(ticket.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Action button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => onOpenResolveModal(ticket)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition shadow-sm ${
                      isResolved
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20 hover:brightness-110"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{isResolved ? "Update Resolution" : "Resolve & Send Reply"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminTicketsTab;
