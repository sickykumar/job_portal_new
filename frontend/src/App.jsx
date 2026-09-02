import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import JobList from "./components/JobList";
import AuthModal from "./components/AuthModal";
import AppliedJobs from "./components/AppliedJobs";
import PostJob from "./components/PostJob";
import RecruiterJobs from "./components/RecruiterJobs";
import Companies from "./components/Companies";
import Profile from "./components/Profile";

function MainContent() {
  const [currentTab, setCurrentTab] = useState("explore");
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main style={{ flex: 1 }}>
        {currentTab === "explore" && <JobList />}

        {currentTab === "auth" && (
          <AuthModal onSuccess={() => setCurrentTab("explore")} />
        )}

        {currentTab === "applied" && <AppliedJobs />}

        {currentTab === "post-job" && (
          <PostJob onJobCreated={() => setCurrentTab("recruiter-jobs")} />
        )}

        {currentTab === "recruiter-jobs" && <RecruiterJobs />}

        {currentTab === "companies" && <Companies />}

        {currentTab === "profile" && <Profile />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(9, 13, 22, 0.95)",
        padding: "32px 24px",
        marginTop: 60,
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="brand-font" style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
            Nex<span style={{ color: "var(--accent-cyan)" }}>Hire</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Engineered for high-performing candidates and visionary teams. Powered by Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
