import React, { useState, useEffect } from "react";
import api from "../services/api";
import { BookmarkCheck, Clock, Building2, MapPin, ExternalLink, AlertCircle } from "lucide-react";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await api.get("/application/get");
        if (res.data?.success) {
          setApplications(res.data.application);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplied();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          My Applications
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          Track the live review status and timelines of your submitted job applications.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          Loading your applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
          <BookmarkCheck size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: 18, color: "#fff", marginBottom: 6 }}>No applications yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Explore open jobs and apply to roles matching your skillset.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {applications.map((app) => (
            <div 
              key={app._id} 
              className="glass-panel"
              style={{
                padding: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap"
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {app.job?.company?.logo ? (
                  <img 
                    src={app.job.company.logo} 
                    alt="" 
                    style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", background: "#fff", padding: 2 }}
                  />
                ) : (
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "rgba(99, 102, 241, 0.2)",
                    color: "var(--accent-cyan)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700
                  }}>
                    <Building2 size={24} />
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                    {app.job?.title || "Position No Longer Available"}
                  </h3>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, display: "flex", gap: 12 }}>
                    <span>{app.job?.company?.companyName}</span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={12} /> {app.job?.location}
                    </span>
                    <span>•</span>
                    <span>{app.job?.salary}</span>
                  </div>
                </div>
              </div>

              {/* Recruiter Feedback / Rejection reason */}
              {app.feedback && (
                <div style={{
                  width: "100%",
                  background: app.status === 'rejected' ? "rgba(244, 63, 94, 0.08)" : "rgba(16, 185, 129, 0.08)",
                  border: `1px solid ${app.status === 'rejected' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginTop: 12
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: app.status === 'rejected' ? '#fca5a5' : '#86efac',
                    marginBottom: 4
                  }}>
                    {app.status === 'rejected' ? 'Feedback from Recruiter:' : 'Hiring Team Note:'}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
                    {app.feedback}
                  </div>
                </div>
              )}

              {/* Interview Details if Scheduled */}
              {app.interviewDetails?.date && (
                <div style={{
                  width: "100%",
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                      📅 Interview Scheduled: {app.interviewDetails.date} {app.interviewDetails.time && `at ${app.interviewDetails.time}`}
                    </div>
                    {app.interviewDetails.notes && (
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                        {app.interviewDetails.notes}
                      </div>
                    )}
                  </div>

                  {app.interviewDetails.meetingLink && (
                    <a
                      href={app.interviewDetails.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: 12, textDecoration: "none" }}
                    >
                      Join Interview Meeting
                    </a>
                  )}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 24, alignSelf: "flex-end", marginTop: 8 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <span className={`badge badge-${app.status}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
