import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Search, MapPin, Briefcase, DollarSign, Clock, 
  Sparkles, CheckCircle, ExternalLink, ChevronRight, X,
  Upload, Trash2, Edit3, UserCheck, FileText
} from "lucide-react";

const JobList = ({ onSelectJob, appliedJobIds = [] }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);

  // Selected Job for Drawer/Detail View
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Application Review Modal (pre-submission check)
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [modalFullname, setModalFullname] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalBio, setModalBio] = useState("");
  const [modalSkills, setModalSkills] = useState("");
  const [modalResumeFile, setModalResumeFile] = useState(null);
  const [modalResumeUrl, setModalResumeUrl] = useState("");
  const [modalResumeName, setModalResumeName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [updatingProfileBeforeApply, setUpdatingProfileBeforeApply] = useState(false);

  // AI Fit Evaluation
  const [aiMatching, setAiMatching] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const { user, updateUser } = useAuth();

  // Populate candidate application review data when opening apply modal
  const openApplyReviewModal = () => {
    if (!user) {
      alert("Please sign in as a candidate to apply for positions.");
      return;
    }
    setModalFullname(user.fullname || "");
    setModalEmail(user.email || "");
    setModalPhone(user.phoneNumber || "");
    setModalBio(user.profile?.bio || "");
    setModalSkills(user.profile?.skills?.join(", ") || "");
    setModalResumeUrl(user.profile?.resume || "");
    setModalResumeName(user.profile?.resumeOriginalname || "Uploaded_Resume.pdf");
    setModalResumeFile(null);
    setShowApplyModal(true);
    setApplyError("");
  };

  const [generatingBio, setGeneratingBio] = useState(false);

  const handleAiCraftBio = async () => {
    setGeneratingBio(true);
    try {
      const res = await api.post("/ai/generate-bio", {
        currentBio: modalBio,
        currentSkills: modalSkills,
      });
      if (res.data?.success) {
        if (res.data.bio) setModalBio(res.data.bio);
        if (res.data.skills) setModalSkills(res.data.skills);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleApplyFinal = async (e) => {
    if (e) e.preventDefault();
    if (!selectedJob) return;

    setApplying(true);
    setApplyError("");

    try {
      // 1. Sync updated profile info or new resume if edited
      const formData = new FormData();
      formData.append("fullname", modalFullname);
      formData.append("phoneNumber", modalPhone);
      formData.append("bio", modalBio);
      formData.append("skills", modalSkills);

      if (modalResumeFile) {
        formData.append("profilePhoto", modalResumeFile);
      } else if (!modalResumeUrl) {
        formData.append("removeResume", "true");
      }

      const profRes = await api.post("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (profRes.data?.success) {
        updateUser(profRes.data.user);
      }

      // 2. Submit Application
      const res = await api.post(`/application/apply/${selectedJob._id}`);
      if (res.data?.success) {
        setApplySuccess(true);
        setShowApplyModal(false);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;

      const res = await api.get("/job/get", { params });
      if (res.data?.success) {
        setJobs(res.data.jobs);
        setTotalJobs(res.data.totalJobs || res.data.jobs.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  const checkAiFit = async (jobId) => {
    if (!user) return;
    setAiMatching(true);
    try {
      const res = await api.post("/ai/match", { jobId });
      if (res.data?.success) {
        setAiResult(res.data);
      }
    } catch (err) {
      console.error("AI Match failed:", err);
    } finally {
      setAiMatching(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(99, 102, 241, 0.12)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: 30,
          padding: "6px 14px",
          color: "var(--accent-cyan)",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 16
        }}>
          <Sparkles size={16} /> AI-Powered Career Intelligence
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
          Discover Careers Matched to <span style={{
            background: "var(--gradient-brand)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Your Superpowers</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
          Explore curated roles at premier companies with automated skill-fit scoring and transparent compensation.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: 16, marginBottom: 36 }}>
        <form onSubmit={(e) => { e.preventDefault(); fetchJobs(); }} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) 120px",
          gap: 12,
          alignItems: "center"
        }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 14 }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: 42 }}
              placeholder="Role, skill, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div style={{ position: "relative" }}>
            <MapPin size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 14 }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: 42 }}
              placeholder="City or Remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <select 
              className="form-input"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="" style={{ background: "#0f172a" }}>All Work Arrangements</option>
              <option value="Full-Time" style={{ background: "#0f172a" }}>Full-Time</option>
              <option value="Part-Time" style={{ background: "#0f172a" }}>Part-Time</option>
              <option value="Remote" style={{ background: "#0f172a" }}>Remote</option>
              <option value="Contract" style={{ background: "#0f172a" }}>Contract</option>
              <option value="Internship" style={{ background: "#0f172a" }}>Internship</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ height: 44 }}>
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Job Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          Finding top opportunities...
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Briefcase size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px auto" }} />
          <h3 style={{ fontSize: 18, color: "#fff", marginBottom: 6 }}>No open positions found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Try adjusting your search criteria or keyword filters.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {jobs.map((job) => (
            <div 
              key={job._id}
              className="glass-panel glass-panel-interactive"
              onClick={() => {
                setSelectedJob(job);
                setAiResult(null);
                setApplySuccess(false);
                setApplyError("");
              }}
              style={{
                padding: 24,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                {/* Header: Company and Logo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {job.company?.logo ? (
                      <img 
                        src={job.company.logo} 
                        alt={job.company.companyName} 
                        style={{ width: 42, height: 42, borderRadius: 10, objectFit: "cover", background: "#fff", padding: 2 }}
                      />
                    ) : (
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: "rgba(99, 102, 241, 0.2)",
                        color: "var(--accent-cyan)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700
                      }}>
                        {job.company?.companyName?.charAt(0) || "C"}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        {job.company?.companyName || "Verified Employer"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} /> {job.location}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-role">{job.jobType}</span>
                </div>

                {/* Job Title */}
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                  {job.title}
                </h3>

                {/* Description Snippet */}
                <p style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  marginBottom: 16,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {job.description}
                </p>

                {/* Requirements Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {job.requirements?.slice(0, 3).map((req, i) => (
                    <span key={i} style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--text-secondary)",
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: 11
                    }}>
                      {req}
                    </span>
                  ))}
                  {job.requirements?.length > 3 && (
                    <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "center" }}>
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Salary and Action */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 16,
                borderTop: "1px solid var(--border-subtle)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-emerald)", fontWeight: 700, fontSize: 14 }}>
                  <DollarSign size={16} /> {job.salary}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent-cyan)", fontSize: 12, fontWeight: 600 }}>
                  View details <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Job Drawer Modal */}
      {selectedJob && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 100,
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 620,
            background: "var(--bg-secondary)",
            height: "100%",
            overflowY: "auto",
            padding: 32,
            borderLeft: "1px solid var(--border-subtle)",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }} className="animate-fade-in">
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  {selectedJob.company?.logo && (
                    <img 
                      src={selectedJob.company.logo} 
                      alt="" 
                      style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", background: "#fff", padding: 2 }}
                    />
                  )}
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                      {selectedJob.title}
                    </h2>
                    <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                      {selectedJob.company?.companyName} • {selectedJob.location}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Meta Stats */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                background: "rgba(0,0,0,0.25)",
                padding: 16,
                borderRadius: 12,
                marginBottom: 24
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Compensation</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-emerald)" }}>{selectedJob.salary}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Experience Required</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{selectedJob.experienceLevel} Years</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Open Positions</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{selectedJob.position}</div>
                </div>
              </div>

              {/* AI Match Button for Candidate */}
              {user && user.role === "student" && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                        <Sparkles size={16} color="var(--accent-cyan)" /> Gemini AI Match Analysis
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        Benchmark your profile & skills against this position
                      </div>
                    </div>
                    <button 
                      onClick={() => checkAiFit(selectedJob._id)}
                      disabled={aiMatching}
                      className="btn-primary"
                      style={{ padding: "6px 14px", fontSize: 12 }}
                    >
                      {aiMatching ? "Analyzing..." : "Analyze Fit"}
                    </button>
                  </div>

                  {aiResult && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: aiResult.matchPercentage >= 70 ? "var(--accent-emerald)" : "var(--accent-amber)"
                        }}>
                          {aiResult.matchPercentage}%
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{aiResult.summary}</div>
                      </div>

                      {aiResult.matchingSkills?.length > 0 && (
                        <div style={{ fontSize: 12, color: "var(--accent-emerald)", marginBottom: 4 }}>
                          ✓ Strengths: {aiResult.matchingSkills.join(", ")}
                        </div>
                      )}
                      {aiResult.missingSkills?.length > 0 && (
                        <div style={{ fontSize: 12, color: "var(--accent-rose)" }}>
                          ⚡ Gaps to address: {aiResult.missingSkills.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Job Description */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Job Description</h4>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {selectedJob.description}
                </div>
              </div>

              {/* Skills Requirements */}
              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Skills & Qualifications</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedJob.requirements?.map((req, index) => (
                    <span key={index} style={{
                      background: "rgba(99, 102, 241, 0.12)",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      color: "#c7d2fe",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 13
                    }}>
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
              {applySuccess ? (
                <div style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#86efac",
                  padding: "12px",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}>
                  <CheckCircle size={18} /> Application Successfully Submitted!
                </div>
              ) : applyError ? (
                <div style={{
                  background: "rgba(244, 63, 94, 0.15)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#fca5a5",
                  padding: "10px",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 13,
                  marginBottom: 12
                }}>
                  {applyError}
                </div>
              ) : null}

              {!applySuccess && (
                <button
                  disabled={user && user.role === "recruiter"}
                  onClick={openApplyReviewModal}
                  className="btn-primary"
                  style={{ width: "100%", height: 48, fontSize: 15 }}
                >
                  {user && user.role === "recruiter"
                    ? "Recruiters cannot apply"
                    : "Review Profile & Apply"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Review & Submission Modal */}
      {showApplyModal && selectedJob && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 120,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 680,
            maxHeight: "90vh",
            background: "var(--bg-secondary)",
            borderRadius: 20,
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }} className="animate-fade-in">
            {/* Modal Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(18, 26, 47, 0.5)"
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                  Confirm Application Details
                </h3>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Applying for: <strong>{selectedJob.title}</strong> at <strong>{selectedJob.company?.companyName}</strong>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 22 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleApplyFinal} style={{ padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--accent-cyan)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <UserCheck size={18} />
                <span>Your saved profile information has been prefilled. You can modify any details or update your resume before submitting.</span>
              </div>

              {applyError && (
                <div style={{
                  background: "rgba(244, 63, 94, 0.15)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#fca5a5",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13
                }}>
                  {applyError}
                </div>
              )}

              {/* Personal Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={modalFullname}
                    onChange={(e) => setModalFullname(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: 10,
                padding: "10px 14px"
              }}>
                <div style={{ fontSize: 13, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  <span>Let Gemini AI enhance your bio & extract top skills in clean plain text</span>
                </div>
                <button
                  type="button"
                  disabled={generatingBio}
                  onClick={handleAiCraftBio}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: "5px 12px" }}
                >
                  {generatingBio ? "Generating..." : "Enhance with AI"}
                </button>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Professional Summary / Bio (Editable)
                </label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Introduce yourself or tailor your summary for this role..."
                  value={modalBio}
                  onChange={(e) => setModalBio(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Your Key Skills (comma separated, editable)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Node.js, Python, MongoDB, AWS"
                  value={modalSkills}
                  onChange={(e) => setModalSkills(e.target.value)}
                />
              </div>

              {/* Drag and Drop Resume Upload Section */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                  Attached Resume (PDF or Word)
                </label>

                {/* Existing or New File Card */}
                {(modalResumeFile || modalResumeUrl) ? (
                  <div style={{
                    background: "rgba(18, 26, 47, 0.8)",
                    border: "1px solid var(--border-bright)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "rgba(99, 102, 241, 0.2)",
                        color: "var(--accent-cyan)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                          {modalResumeFile ? modalResumeFile.name : modalResumeName}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--accent-emerald)" }}>
                          {modalResumeFile ? "New file ready to upload" : "Current profile resume linked"}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setModalResumeFile(null);
                          setModalResumeUrl("");
                          setModalResumeName("");
                        }}
                        style={{
                          background: "rgba(244, 63, 94, 0.15)",
                          border: "1px solid rgba(244, 63, 94, 0.3)",
                          color: "#fca5a5",
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: 12,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                        title="Delete resume from application"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Drag and Drop Box */}
                {(!modalResumeFile && !modalResumeUrl) && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setModalResumeFile(e.dataTransfer.files[0]);
                      }
                    }}
                    style={{
                      border: `2px dashed ${isDragging ? "var(--accent-cyan)" : "var(--border-subtle)"}`,
                      background: isDragging ? "rgba(6, 182, 212, 0.08)" : "rgba(0, 0, 0, 0.2)",
                      borderRadius: 14,
                      padding: "24px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => document.getElementById("resume-input-modal").click()}
                  >
                    <Upload size={32} color={isDragging ? "var(--accent-cyan)" : "var(--text-muted)"} style={{ margin: "0 auto 10px auto" }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                      Drag & Drop your resume here, or <span style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}>browse files</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      Supports PDF, DOC, DOCX up to 10MB
                    </div>
                    <input
                      id="resume-input-modal"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setModalResumeFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 12,
                paddingTop: 16,
                borderTop: "1px solid var(--border-subtle)"
              }}>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn-secondary"
                  style={{ height: 44, padding: "0 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="btn-primary"
                  style={{ height: 44, padding: "0 28px", fontSize: 14 }}
                >
                  {applying ? "Submitting Application..." : "Confirm & Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
