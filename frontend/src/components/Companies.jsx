import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Building2, Plus, Globe, MapPin, CheckCircle, AlertCircle } from "lucide-react";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/company/get");
      if (res.data?.success) {
        setCompanies(res.data.companies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Register base company
      const regRes = await api.post("/company/register", { companyName });
      if (regRes.data?.success) {
        const newCompId = regRes.data.company._id;

        // 2. Update with logo, website, description if provided
        if (description || website || location || logoFile) {
          const formData = new FormData();
          if (description) formData.append("description", description);
          if (website) formData.append("website", website);
          if (location) formData.append("location", location);
          if (logoFile) formData.append("profilePhoto", logoFile);

          await api.put(`/company/update/${newCompId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        setShowModal(false);
        setCompanyName("");
        setDescription("");
        setWebsite("");
        setLocation("");
        setLogoFile(null);
        fetchCompanies();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to register company");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            My Companies
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Manage the employer profiles you represent when listing open positions.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Register Company
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          Loading your company profiles...
        </div>
      ) : companies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Building2 size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: 18, color: "#fff", marginBottom: 6 }}>No Companies Registered</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
            Register your company to post job listings and attract talent.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Register Company
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {companies.map((comp) => (
            <div key={comp._id} className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                {comp.logo ? (
                  <img
                    src={comp.logo}
                    alt={comp.companyName}
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
                    fontWeight: 700,
                    fontSize: 18
                  }}>
                    {comp.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{comp.companyName}</h3>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} /> {comp.location || "Headquarters Unspecified"}
                  </div>
                </div>
              </div>

              {comp.description && (
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                  {comp.description}
                </p>
              )}

              {comp.website && (
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: "var(--accent-cyan)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Globe size={14} /> Visit Website
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
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
            maxWidth: 520,
            background: "var(--bg-secondary)",
            borderRadius: 16,
            border: "1px solid var(--border-subtle)",
            padding: 32
          }} className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Register Company</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 20 }}>
                ✕
              </button>
            </div>

            {errorMsg && (
              <div style={{
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "#fca5a5",
                padding: "10px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCompany} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Acme Innovations"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Location / HQ
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Official Website
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://acme.io"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Company Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: 12 }}
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Company Overview
                </label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Tell candidates about your mission, product, and values..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: 10, height: 44 }}>
                {submitting ? "Registering..." : "Save Company Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
