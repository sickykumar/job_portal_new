import React from "react";
import { useAuth } from "../context/AuthContext";
import { Briefcase, User, LogOut, PlusCircle, BookmarkCheck, Sparkles } from "lucide-react";

const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(9, 13, 22, 0.85)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "16px 24px"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab("explore")}
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--gradient-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}>
            <Briefcase size={20} color="#fff" />
          </div>
          <div>
            <span className="brand-font" style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
              Nex<span style={{ color: "var(--accent-cyan)" }}>Hire</span>
            </span>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Next-Gen Talent Platform
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button 
            onClick={() => setCurrentTab("explore")}
            className={currentTab === "explore" ? "btn-primary" : "btn-secondary"}
            style={{ padding: "8px 14px", fontSize: 13 }}
          >
            Find Jobs
          </button>

          {user && user.role === "student" && (
            <button 
              onClick={() => setCurrentTab("applied")}
              className={currentTab === "applied" ? "btn-primary" : "btn-secondary"}
              style={{ padding: "8px 14px", fontSize: 13 }}
            >
              <BookmarkCheck size={16} /> My Applications
            </button>
          )}

          {user && user.role === "recruiter" && (
            <>
              <button 
                onClick={() => setCurrentTab("recruiter-jobs")}
                className={currentTab === "recruiter-jobs" ? "btn-primary" : "btn-secondary"}
                style={{ padding: "8px 14px", fontSize: 13 }}
              >
                <Briefcase size={16} /> Posted Jobs
              </button>
              <button 
                onClick={() => setCurrentTab("post-job")}
                className={currentTab === "post-job" ? "btn-primary" : "btn-secondary"}
                style={{ padding: "8px 14px", fontSize: 13 }}
              >
                <PlusCircle size={16} /> Post Job
              </button>
              <button 
                onClick={() => setCurrentTab("companies")}
                className={currentTab === "companies" ? "btn-primary" : "btn-secondary"}
                style={{ padding: "8px 14px", fontSize: 13 }}
              >
                Companies
              </button>
            </>
          )}

          {/* Profile / Auth Button */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 12 }}>
              <button
                onClick={() => setCurrentTab("profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: currentTab === "profile" ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 24,
                  padding: "4px 12px 4px 6px",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                {user.profile?.profilePhoto ? (
                  <img 
                    src={user.profile.profilePhoto} 
                    alt={user.fullname} 
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} 
                  />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} />
                  </div>
                )}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{user.fullname?.split(" ")[0]}</span>
                <span className="badge badge-role" style={{ fontSize: 10, padding: "2px 6px" }}>
                  {user.role}
                </span>
              </button>
              <button 
                onClick={logout}
                title="Logout"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 6
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab("auth")}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: 13, marginLeft: 8 }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
