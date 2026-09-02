import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Users, Briefcase, ChevronRight, Check, X, Mail, Phone, Calendar, Download, Sparkles } from "lucide-react";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Applicant Review Drawer
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Status & Feedback Modal
  const [feedbackModal, setFeedbackModal] = useState(null); // { app, targetStatus, feedback: '', date: '', time: '', meetingLink: '' }

  const fetchRecruiterJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/job/getadminjobs");
      if (res.data?.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (app, targetStatus) => {
    setFeedbackModal({
      app,
      targetStatus,
      feedback: app.feedback || "",
      date: app.interviewDetails?.date || "",
      time: app.interviewDetails?.time || "",
      meetingLink: app.interviewDetails?.meetingLink || "",
      notes: app.interviewDetails?.notes || "",
    });
  };

  const [generatingAiDecision, setGeneratingAiDecision] = useState(false);

  const handleAiGenerateDecision = async () => {
    if (!feedbackModal) return;
    setGeneratingAiDecision(true);
    try {
      if (feedbackModal.targetStatus === "interview") {
        const res = await api.post("/ai/generate-interview", {
          candidateName: feedbackModal.app.applicant?.fullname,
          jobTitle: selectedJob?.title,
        });
        if (res.data?.success && res.data.notes) {
          setFeedbackModal((prev) => ({ ...prev, feedback: res.data.notes }));
        }
      } else {
        const res = await api.post("/ai/generate-feedback", {
          status: feedbackModal.targetStatus,
          candidateName: feedbackModal.app.applicant?.fullname,
          jobTitle: selectedJob?.title,
          optionalReason: feedbackModal.feedback,
        });
        if (res.data?.success && res.data.feedback) {
          setFeedbackModal((prev) => ({ ...prev, feedback: res.data.feedback }));
        }
      }
    } catch (err) {
      console.error("AI Decision note error:", err);
    } finally {
      setGeneratingAiDecision(false);
    }
  };

  const submitStatusWithFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackModal) return;

    const { app, targetStatus, feedback, date, time, meetingLink, notes } = feedbackModal;
    setUpdatingId(app._id);

    try {
      const payload = {
        status: targetStatus,
        feedback,
      };

      if (targetStatus === "interview" || date || meetingLink) {
        payload.interviewDetails = { date, time, meetingLink, notes };
      }

      const res = await api.post(`/application/status/${app._id}/update`, payload);
      if (res.data?.success) {
        setApplicants((prev) =>
          prev.map((item) =>
            item._id === app._id
              ? {
                  ...item,
                  status: targetStatus,
                  feedback,
                  interviewDetails: payload.interviewDetails,
                }
              : item
          )
        );
        setFeedbackModal(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const openApplicantsDrawer = async (job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/application/applicants/${job._id}`);
      if (res.data?.success) {
        setApplicants(res.data.job?.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applicants", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const res = await api.post(`/application/status/${applicationId}/update`, {
        status: newStatus,
      });
      if (res.data?.success) {
        // Update local state
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = async (appId, candidateName) => {
    try {
      const res = await api.get(`/application/download-resume/${appId}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.headers["content-type"] || "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(candidateName || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download resume. The candidate may not have uploaded one yet.");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Recruitment Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          Manage your active job listings and review candidate submissions with pipeline actions.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          Loading your posted positions...
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: 18, color: "#fff", marginBottom: 6 }}>No jobs posted yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Create and publish your first job listing to start receiving qualified applicants.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {jobs.map((job) => (
            <div 
              key={job._id}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                    {job.title}
                  </h3>
                  <span className="badge badge-role">{job.jobType}</span>
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 13, display: "flex", gap: 12 }}>
                  <span>{job.company?.companyName}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                  <span>•</span>
                  <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.06)",
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff"
                }}>
                  <Users size={16} color="var(--accent-cyan)" />
                  <span>{job.applications?.length || 0} Candidates</span>
                </div>

                <button
                  onClick={() => openApplicantsDrawer(job)}
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: 13 }}
                >
                  Review Pipeline <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicants Review Modal / Drawer */}
      {selectedJob && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(6px)",
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 800,
            maxHeight: "90vh",
            background: "var(--bg-secondary)",
            borderRadius: 16,
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }} className="animate-fade-in">
            {/* Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                  Applicants for {selectedJob.title}
                </h3>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {applicants.length} Total Applications Submitted
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 20 }}
              >
                ✕
              </button>
            </div>

            {/* Applicant Cards List */}
            <div style={{ padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              {loadingApplicants ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                  Retrieving candidate submissions...
                </div>
              ) : applicants.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                  No candidates have applied to this role yet.
                </div>
              ) : (
                applicants.map((app) => {
                  const candidate = app.applicant;
                  return (
                    <div 
                      key={app._id}
                      style={{
                        background: "rgba(18, 26, 47, 0.6)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 12,
                        padding: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                        flexWrap: "wrap"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                            {candidate?.fullname || "Anonymous Candidate"}
                          </h4>
                          <span className={`badge badge-${app.status}`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 10 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Mail size={14} /> {candidate?.email}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Phone size={14} /> {candidate?.phoneNumber}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Candidate Skills */}
                        {candidate?.profile?.skills?.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {candidate.profile.skills.map((skill, idx) => (
                              <span key={idx} style={{
                                background: "rgba(255,255,255,0.06)",
                                padding: "2px 8px",
                                borderRadius: 4,
                                fontSize: 11,
                                color: "var(--text-secondary)"
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Feedback or Interview preview if available */}
                      {app.feedback && (
                        <div style={{
                          width: "100%",
                          background: "rgba(0,0,0,0.2)",
                          borderLeft: `3px solid ${app.status === 'rejected' ? 'var(--accent-rose)' : 'var(--accent-emerald)'}`,
                          padding: "8px 12px",
                          borderRadius: 6,
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          marginTop: 8
                        }}>
                          <strong>Recruiter Note:</strong> {app.feedback}
                        </div>
                      )}

                      {app.interviewDetails?.date && (
                        <div style={{
                          width: "100%",
                          background: "rgba(99, 102, 241, 0.1)",
                          border: "1px solid rgba(99, 102, 241, 0.25)",
                          padding: "8px 12px",
                          borderRadius: 6,
                          fontSize: 12,
                          color: "#c7d2fe",
                          marginTop: 6
                        }}>
                          📅 <strong>Interview Scheduled:</strong> {app.interviewDetails.date} {app.interviewDetails.time && `at ${app.interviewDetails.time}`}
                          {app.interviewDetails.meetingLink && (
                            <span style={{ marginLeft: 8 }}>
                              • <a href={app.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}>Join Meeting</a>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        {candidate?.profile?.resume && (
                          <button
                            onClick={() => handleDownloadResume(app._id, candidate?.fullname)}
                            className="btn-secondary"
                            style={{ padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
                            title="Download Resume"
                          >
                            <Download size={14} /> Resume
                          </button>
                        )}

                        <button
                          onClick={() => openStatusModal(app, "interview")}
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                            color: "#93c5fd",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          📅 Schedule Interview
                        </button>

                        <button
                          onClick={() => openStatusModal(app, "hired")}
                          style={{
                            background: "rgba(16, 185, 129, 0.2)",
                            border: "1px solid rgba(16, 185, 129, 0.4)",
                            color: "#86efac",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <Check size={14} /> Hire / Accept
                        </button>

                        <button
                          onClick={() => openStatusModal(app, "rejected")}
                          style={{
                            background: "rgba(244, 63, 94, 0.2)",
                            border: "1px solid rgba(244, 63, 94, 0.4)",
                            color: "#fca5a5",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <X size={14} /> Reject with Reason
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decision / Feedback / Interview Modal */}
      {feedbackModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 110,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 540,
            background: "var(--bg-secondary)",
            borderRadius: 16,
            border: "1px solid var(--border-subtle)",
            padding: 32
          }} className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                  {feedbackModal.targetStatus === "interview"
                    ? "Schedule Interview"
                    : feedbackModal.targetStatus === "hired"
                    ? "Confirm Offer / Hiring Decision"
                    : "Reject Candidate with Feedback"}
                </h3>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Candidate: <strong>{feedbackModal.app.applicant?.fullname}</strong>
                </div>
              </div>
              <button
                onClick={() => setFeedbackModal(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 20 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitStatusWithFeedback} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {feedbackModal.targetStatus === "interview" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                        Interview Date
                      </label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={feedbackModal.date}
                        onChange={(e) => setFeedbackModal({ ...feedbackModal, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                        Interview Time (with timezone)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3:00 PM IST"
                        required
                        className="form-input"
                        value={feedbackModal.time}
                        onChange={(e) => setFeedbackModal({ ...feedbackModal, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                      Virtual Meeting Link (Google Meet, Zoom, Teams)
                    </label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/xyz-abc-def"
                      className="form-input"
                      value={feedbackModal.meetingLink}
                      onChange={(e) => setFeedbackModal({ ...feedbackModal, meetingLink: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {feedbackModal.targetStatus === "rejected"
                      ? "Constructive Feedback / Rejection Reason (visible to candidate) *"
                      : "Notes / Next Steps Instructions"}
                  </label>
                  <button
                    type="button"
                    disabled={generatingAiDecision}
                    onClick={handleAiGenerateDecision}
                    style={{
                      background: "rgba(99, 102, 241, 0.15)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "var(--accent-cyan)",
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <Sparkles size={12} /> {generatingAiDecision ? "Writing Note..." : "AI Auto-Draft Note (Plain Text)"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  required={feedbackModal.targetStatus === "rejected"}
                  className="form-input"
                  placeholder={
                    feedbackModal.targetStatus === "rejected"
                      ? "e.g., Strong background in frontend, but currently seeking candidates with 4+ years of hands-on Kubernetes experience. We encourage applying for future junior roles."
                      : "e.g., Congratulations! We are thrilled with your background and are moving to the final round / offer discussion."
                  }
                  value={feedbackModal.feedback}
                  onChange={(e) => setFeedbackModal({ ...feedbackModal, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setFeedbackModal(null)}
                  className="btn-secondary"
                  style={{ height: 42 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingId === feedbackModal.app._id}
                  className="btn-primary"
                  style={{
                    height: 42,
                    background:
                      feedbackModal.targetStatus === "rejected"
                        ? "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
                        : "var(--gradient-brand)"
                  }}
                >
                  {updatingId === feedbackModal.app._id ? "Saving..." : "Confirm & Send to Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
