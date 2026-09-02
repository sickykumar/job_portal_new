import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Sparkles, Building2, Plus, CheckCircle, AlertCircle } from "lucide-react";

const PostJob = ({ onJobCreated }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // AI JD Generator states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSkills, setAiSkills] = useState("");
  const [generatingJd, setGeneratingJd] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [experience, setExperience] = useState(1);
  const [position, setPosition] = useState(1);
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/company/get");
        if (res.data?.success) {
          setCompanies(res.data.companies);
          if (res.data.companies.length > 0) {
            setCompanyId(res.data.companies[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);

  const handleAiGenerate = async () => {
    if (!title) {
      setErrorMsg("Please enter a Job Title first so Gemini can craft a description.");
      return;
    }
    setGeneratingJd(true);
    setErrorMsg("");
    try {
      const res = await api.post("/ai/generate-jd", {
        title,
        keySkills: requirements,
        experienceLevel: experience
      });
      if (res.data?.success) {
        setDescription(res.data.description);
      }
    } catch (err) {
      setErrorMsg("AI Generation failed. Please type manually.");
    } finally {
      setGeneratingJd(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await api.post("/job/post", {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experience,
        position,
        companyId,
      });

      if (res.data?.success) {
        setSuccessMsg("Job opportunity posted successfully!");
        if (onJobCreated) onJobCreated();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Post a New Position
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          Publish open opportunities and leverage Gemini AI to auto-generate structured, compelling descriptions.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, textAlign: "center" }}>
          <Building2 size={48} color="var(--accent-amber)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: 18, color: "#fff", marginBottom: 8 }}>No Company Registered Yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
            Before posting a job, please register your company profile.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 32 }}>
          {errorMsg && (
            <div style={{
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fca5a5",
              padding: "12px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#86efac",
              padding: "12px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Associated Company
              </label>
              <select
                className="form-input"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id} style={{ background: "#0f172a" }}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Job Title
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Senior Full-Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Location
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. New York, NY or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Compensation / Salary
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. $140,000 - $170,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Job Type
              </label>
              <select
                className="form-input"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="Full-Time" style={{ background: "#0f172a" }}>Full-Time</option>
                <option value="Part-Time" style={{ background: "#0f172a" }}>Part-Time</option>
                <option value="Remote" style={{ background: "#0f172a" }}>Remote</option>
                <option value="Contract" style={{ background: "#0f172a" }}>Contract</option>
                <option value="Internship" style={{ background: "#0f172a" }}>Internship</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Min. Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Positions Open
              </label>
              <input
                type="number"
                min="1"
                required
                className="form-input"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
              Key Skills / Requirements (comma separated)
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. React, Node.js, TypeScript, MongoDB, GraphQL"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          {/* AI Generation Trigger */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#fff" }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span>Let Gemini AI generate the job description based on your title & skills</span>
            </div>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={generatingJd}
              className="btn-secondary"
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              {generatingJd ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
              Full Job Description
            </label>
            <textarea
              required
              rows={8}
              className="form-input"
              placeholder="Detailed responsibilities, expectations, qualifications, and benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", height: 48, fontSize: 15 }}
          >
            {loading ? "Publishing Role..." : "Publish Job Opportunity"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PostJob;
