import React, { useState } from "react";
import { Search, UserCheck, UserX, Trash2, FileText, ExternalLink, AlertTriangle } from "lucide-react";
import api from "../../services/api";

const AdminCandidatesTab = ({ candidates = [], onRefresh }) => {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionError, setActionError] = useState("");

  const filtered = candidates.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.fullname?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phoneNumber?.includes(q)
    );
  });

  const handleToggleStatus = async (candidate) => {
    const nextStatus = candidate.accountStatus === "suspended" ? "active" : "suspended";
    setLoadingId(candidate._id);
    setActionError("");

    try {
      await api.put(`/admin/candidates/${candidate._id}/status`, {
        accountStatus: nextStatus,
      });
      onRefresh();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update account status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    setLoadingId(candidateId);
    setActionError("");

    try {
      await api.delete(`/admin/candidates/${candidateId}`);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete candidate.");
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
            Manage Candidates ({filtered.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review registered job seekers, resume credentials, and manage account access.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
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

      {/* Candidates Table */}
      <div className="dashboard-card overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <th className="p-3.5 font-semibold">Candidate</th>
              <th className="p-3.5 font-semibold">Contact & IDs</th>
              <th className="p-3.5 font-semibold">Skills / Resume</th>
              <th className="p-3.5 font-semibold text-center">Applications</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No candidates match your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const isSuspended = c.accountStatus === "suspended";
                const isDeleting = deleteConfirmId === c._id;

                return (
                  <tr
                    key={c._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    {/* Candidate Name & Avatar */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white uppercase shadow-sm">
                          {c.fullname?.[0] || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {c.fullname}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Joined {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email, Phone & Aadhaar */}
                    <td className="p-3.5 space-y-0.5">
                      <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                        {c.email}
                      </p>
                      <p className="text-slate-500 text-[11px]">{c.phoneNumber}</p>
                      <p className="text-[10px] text-slate-400">
                        Aadhaar: {c.adharcard || "N/A"} · PAN: {c.pancard || "N/A"}
                      </p>
                    </td>

                    {/* Skills & Resume */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs mb-1.5">
                        {c.profile?.skills?.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {c.profile?.skills?.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{c.profile.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {c.profile?.resume ? (
                        <a
                          href={c.profile.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          <span>View Resume PDF</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No resume attached</span>
                      )}
                    </td>

                    {/* Applications Count */}
                    <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                      {c.totalApplications}
                    </td>

                    {/* Account Status */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          isSuspended
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}
                      >
                        {c.accountStatus || "active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-2">
                      {isDeleting ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-[11px] text-red-500 font-semibold">Confirm?</span>
                          <button
                            onClick={() => handleDeleteCandidate(c._id)}
                            disabled={loadingId === c._id}
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
                            onClick={() => handleToggleStatus(c)}
                            disabled={loadingId === c._id}
                            title={isSuspended ? "Reactivate Account" : "Suspend Account"}
                            className={`rounded-lg p-1.5 transition ${
                              isSuspended
                                ? "text-emerald-600 hover:bg-emerald-500/10"
                                : "text-amber-600 hover:bg-amber-500/10"
                            }`}
                          >
                            {isSuspended ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(c._id)}
                            title="Delete Candidate"
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

export default AdminCandidatesTab;
