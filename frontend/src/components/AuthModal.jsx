import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, User, Phone, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { formatIndianPhone, formatIndianAadhaar, formatIndianPAN } from "../utils/indianFormat";

const AuthModal = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [adharcard, setAdharcard] = useState("");
  const [pancard, setPancard] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/user/login", { email, password, role });
        if (res.data?.success) {
          login(res.data.user, res.data.token);
          if (onSuccess) onSuccess();
        }
      } else {
        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("password", password);
        if (role === "recruiter") {
          formData.append("adharcard", adharcard.replace(/\s+/g, "").trim());
          formData.append("pancard", pancard.toUpperCase().trim());
        }
        formData.append("role", role);
        if (file) {
          formData.append("profilePhoto", file);
        }

        const res = await api.post("/user/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          setSuccessMsg("Account created! Please sign in.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "40px auto",
      padding: 32,
    }} className="glass-panel animate-fade-in">
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          {isLogin ? "Welcome Back" : "Join PathKhojo"}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          {isLogin 
            ? "Sign in to access curated opportunities and track applications" 
            : "Create your account to start discovering or hiring elite talent"}
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        background: "rgba(0,0,0,0.3)",
        padding: 4,
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <button
          type="button"
          onClick={() => setRole("student")}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: role === "student" ? "var(--accent-indigo)" : "transparent",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Candidate / Jobseeker
        </button>
        <button
          type="button"
          onClick={() => setRole("recruiter")}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: role === "recruiter" ? "var(--accent-indigo)" : "transparent",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Employer / Recruiter
        </button>
      </div>

      {error && (
        <div style={{
          background: "rgba(244, 63, 94, 0.15)",
          border: "1px solid rgba(244, 63, 94, 0.3)",
          color: "#fca5a5",
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 13,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {successMsg && (
        <div style={{
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#86efac",
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 13,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!isLogin && (
          <>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Johnathan Vance"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Phone Number (India +91)
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{
                    padding: "10px 10px",
                    backgroundColor: "var(--bg-card-hover)",
                    border: "1px solid var(--border-subtle)",
                    borderRight: "none",
                    borderRadius: "12px 0 0 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                  }}>
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    style={{ borderRadius: "0 12px 12px 0" }}
                    placeholder="98765 43210"
                    value={phoneNumber.replace(/^\+91\s*/, "")}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9\s]/g, "").slice(0, 11);
                      setPhoneNumber(val ? `+91 ${val.trim()}` : "");
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Profile Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: 12 }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            {role === "recruiter" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Aadhaar Number (12-Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    className="form-input"
                    placeholder="e.g. 5432 1098 7654"
                    value={adharcard}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);
                      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setAdharcard(formatted);
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                    PAN Card (10-Char) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. ABCDE1234F"
                    value={pancard}
                    onChange={(e) => setPancard(e.target.value.toUpperCase().slice(0, 10))}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
            Email Address
          </label>
          <input
            type="email"
            required
            className="form-input"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            required
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 8, height: 44 }}>
          {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      {/* Switch Form Type */}
      <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
        {isLogin ? "Don't have an account yet? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccessMsg("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-cyan)",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          {isLogin ? "Register now" : "Sign in here"}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
