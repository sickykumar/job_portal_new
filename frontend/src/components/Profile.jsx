import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, FileText, Upload, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.skills?.join(", ") || "");
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAiCraftBio = async () => {
    setGeneratingBio(true);
    try {
      const res = await api.post("/ai/generate-bio", {
        currentBio: bio,
        currentSkills: skills,
      });
      if (res.data?.success) {
        if (res.data.bio) setBio(res.data.bio);
        if (res.data.skills) setSkills(res.data.skills);
        setSuccessMsg("AI generated professional bio & extracted skills in plain text! You can edit them below.");
      }
    } catch (err) {
      setErrorMsg("Failed to generate AI bio at this moment.");
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("bio", bio);
      formData.append("skills", skills);
      if (resumeFile) {
        formData.append("profilePhoto", resumeFile); // controller takes singleUpload named profilePhoto
      }

      const res = await api.post("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        updateUser(res.data.user);
        setSuccessMsg("Profile and resume successfully updated!");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Candidate Profile & Credentials
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          Keep your skills and resume up-to-date so our Gemini AI algorithm can accurately match you to relevant roles.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 32 }}>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Phone Number
              </label>
              <input
                type="tel"
                required
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                Registered Role
              </label>
              <input
                type="text"
                disabled
                className="form-input"
                value={user?.role?.toUpperCase()}
                style={{ opacity: 0.6, cursor: "not-allowed" }}
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
                  <span>Let Gemini AI generate your bio & skills in clean plain text</span>
                </div>
                <button
                  type="button"
                  disabled={generatingBio}
                  onClick={handleAiCraftBio}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: "5px 12px" }}
                >
                  {generatingBio ? "Generating..." : "Generate with AI"}
                </button>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Professional Bio / Summary (Plain Text, Editable)
                </label>
                <textarea
              rows={3}
              className="form-input"
              placeholder="Brief summary of your background, experience, and interests..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
              Technical Skills (comma separated)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, Node.js, Python, TypeScript, Docker"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div style={{
            background: "rgba(0,0,0,0.25)",
            padding: 20,
            borderRadius: 12,
            border: "1px dashed var(--border-subtle)"
          }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
              Upload Resume (PDF / Word)
            </label>
            {user?.profile?.resume && (
              <div style={{ fontSize: 13, color: "var(--accent-cyan)", marginBottom: 12 }}>
                Current Resume:{" "}
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}
                >
                  {user.profile.resumeOriginalname || "View Uploaded Resume"}
                </a>
              </div>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="form-input"
              style={{ fontSize: 12 }}
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: 10, height: 48, fontSize: 15 }}
          >
            {loading ? "Updating Profile..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
