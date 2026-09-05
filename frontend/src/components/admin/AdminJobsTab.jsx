import React, { useState } from "react";
import { Search, Building2, MapPin, Briefcase, DollarSign, Trash2, AlertTriangle, Users } from "lucide-react";
import api from "../../services/api";

const AdminJobsTab = ({ jobs = [], onRefresh }) => {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");

  const filtered = jobs.filter((j) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      (j.company?.companyName || j.company?.name)?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.created_by?.fullname?.toLowerCase().includes(q)
    );
  });

  const handleDeleteJob = async (jobId) => {
    setDeletingId(jobId);
    setError("");

    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove job.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 dashboard-card p-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Job Listings Moderation ({filtered.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit job listings across all organizations and remove spam or non-compliant posts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company, location..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Jobs Table */}
      <div className="dashboard-card overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <th className="p-3.5 font-semibold">Job Title & Company</th>
              <th className="p-3.5 font-semibold">Posted By</th>
              <th className="p-3.5 font-semibold">Location & Type</th>
              <th className="p-3.5 font-semibold">Compensation</th>
              <th className="p-3.5 font-semibold text-center">Applicants</th>
              <th className="p-3.5 font-semibold text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No job postings match your search.
                </td>
              </tr>
            ) : (
              filtered.map((job) => {
                const isConfirming = confirmDeleteId === job._id;
                const applicantCount = job.applications?.length || 0;

                return (
                  <tr
                    key={job._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    {/* Title & Company */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        {job.company?.logo ? (
                          <img
                            src={job.company.logo}
                            alt={job.company?.companyName || job.company?.name || "Company"}
                            className="h-8 w-8 rounded-lg object-contain border border-slate-200 dark:border-slate-800 bg-white"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                            <Building2 className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {job.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {job.company?.companyName || job.company?.name || "Independent"} · Posted {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Posted by Recruiter */}
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {job.created_by?.fullname || "Unknown"}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {job.created_by?.email || "N/A"}
                      </p>
                    </td>

                    {/* Location & Type */}
                    <td className="p-3.5 space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Briefcase className="h-3 w-3 text-slate-400" />
                        <span>{job.jobType}</span>
                      </div>
                    </td>

                    {/* Compensation */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ₹{job.salary}
                      </span>
                    </td>

                    {/* Applicants */}
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        <Users className="h-3 w-3" />
                        <span>{applicantCount}</span>
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="p-3.5 text-right">
                      {isConfirming ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-[11px] text-red-500 font-semibold">Delete?</span>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            disabled={deletingId === job._id}
                            className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(job._id)}
                          title="Delete / Remove Job"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

export default AdminJobsTab;
