import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
 * Verify JWT token from cookie or Authorization header
 */
export const authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also support Bearer token in header for REST/mobile clients
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        message: "Invalid or expired token.",
        success: false,
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    req.id = user._id.toString();
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expired or invalid token.",
      success: false,
    });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles Allowed roles ('recruiter', 'student', etc.)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
        success: false,
      });
    }

    const userRole = (req.user.role || "").toLowerCase();
    const normalizedRoles = roles.map((r) => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Requires one of roles: [${roles.join(", ")}]`,
        success: false,
      });
    }
    next();
  };
};

export default authenticateToken;