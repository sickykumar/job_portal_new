import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UniversalLoader from "./UniversalLoader";

/**
 * PublicOnlyRoute Component
 * Restricts access to guest-only routes (such as /login and /register).
 * If user is already authenticated, redirects them directly to their role's dashboard.
 */
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <UniversalLoader fullScreen={true} message="Verifying session..." />;
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    }
    return <Navigate to="/candidate-dashboard" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
