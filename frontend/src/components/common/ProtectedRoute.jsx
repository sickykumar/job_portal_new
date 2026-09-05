import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UniversalLoader from "./UniversalLoader";

/**
 * ProtectedRoute Component
 * Guards private routes from unauthorized access and enforces role-based permissions.
 * Redirects unauthenticated users to /login with return navigation intent.
 *
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string[]} allowedRoles - Optional array of roles: ['student', 'recruiter', 'admin']
 * @param {string} redirectTo - Fallback redirection path (default: '/login')
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for session authentication verification to avoid premature redirects
  if (loading) {
    return <UniversalLoader fullScreen={true} message="Verifying security credentials..." />;
  }

  // 2. Unauthenticated: Redirect to login and save the intended path
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3. Role Restriction Check
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || "").toLowerCase();
    const isAllowed = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);

    if (!isAllowed) {
      // Gracefully redirect user to their respective authorized home/dashboard
      if (userRole === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      if (userRole === "recruiter") {
        return <Navigate to="/recruiter-dashboard" replace />;
      }
      return <Navigate to="/candidate-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
