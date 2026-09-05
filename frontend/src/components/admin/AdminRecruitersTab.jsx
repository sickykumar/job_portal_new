import React, { useState } from "react";
import { Search, Building2, Briefcase, Trash2, UserCheck, UserX, AlertTriangle, Globe } from "lucide-react";
import api from "../../services/api";

const AdminRecruitersTab = ({ recruiters = [], onRefresh }) => {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionError, setActionError] = useState("");

  const filtered = recruiters.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.fullname?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      (r.profile?.company?.companyName || r.profile?.company?.name)?.toLowerCase().includes(q)
    );
  });

  const handleToggleStatus = async (recruiter) => {
    const nextStatus = recruiter.accountStatus === "suspended" ? "active" : "suspended";
    setLoadingId(recruiter._id);
    setActionError("");

    try {
      await api.put(`/admin/recruiters/${recruiter._id}/status`, {
        accountStatus: nextStatus,
      });
      onRefresh();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update recruiter status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteRecruiter = async (recruiterId) => {
    setLoadingId(recruiterId);
    setActionError("");

    try {
      await api.delete(`/admin/recruiters/${recruiterId}`);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete recruiter.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 dashboard-card p-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Manage Recruiters ({filtered.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit hiring organizations, recruiters, and corporate permissions.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recruiter or company..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Recruiters Table */}
      <div className="dashboard-card overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <th className="p-3.5 font-semibold">Recruiter</th>
              <th className="p-3.5 font-semibold">Associated Company</th>
              <th className="p-3.5 font-semibold text-center">Jobs Posted</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No recruiters match your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const company = r.profile?.company;
                const isSuspended = r.accountStatus === "suspended";
                const isDeleting = deleteConfirmId === r._id;

                return (
                  <tr
                    key={r._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    {/* Recruiter Details */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white uppercase shadow-sm">
                          {r.fullname?.[0] || "R"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {r.fullname}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{r.email}</p>
                          <p className="text-[10px] text-slate-400">{r.phoneNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company Details */}
                    <td className="p-3.5">
                      {company ? (
                        <div className="flex items-center gap-2.5">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.companyName || company.name || "Company"}
                              className="h-7 w-7 rounded-lg object-contain border border-slate-200 dark:border-slate-800 bg-white"
                            />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                              <Building2 className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {company.companyName || company.name}
                            </p>
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
                              >
                                <Globe className="h-2.5 w-2.5" />
                                <span>{company.website.replace(/^https?:\/\//, "")}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No company linked</span>
                      )}
                    </td>

                    {/* Jobs Posted */}
                    <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                      {r.totalJobs || 0}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          isSuspended
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}
                      >
                        {r.accountStatus || "active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-2">
                      {isDeleting ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-[11px] text-red-500 font-semibold">Confirm?</span>
                          <button
                            onClick={() => handleDeleteRecruiter(r._id)}
                            disabled={loadingId === r._id}
                            className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-lg bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleStatus(r)}
                            disabled={loadingId === r._id}
                            title={isSuspended ? "Reactivate Recruiter" : "Suspend Recruiter"}
                            className={`rounded-lg p-1.5 transition ${
                              isSuspended
                                ? "text-emerald-600 hover:bg-emerald-500/10"
                                : "text-amber-600 hover:bg-amber-500/10"
                            }`}
                          >
                            {isSuspended ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(r._id)}
                            title="Delete Recruiter"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRecruitersTab;
