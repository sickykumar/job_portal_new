import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
 * ============================================================================
 * 🛡️ AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * 1. `authenticateToken`:
 *    - Request me aane wale JWT token ko check karta hai (Cookie ya Authorization Header se).
 *    - Token verify karke user fetch karta hai aur `req.user` & `req.id` me attach karta hai.
 *    - Invalid ya missing token par `401 Unauthorized` return karta hai.
 * 
 * 2. `authorizeRoles`:
 *    - Role-based Access Control (RBAC) guard.
 *    - Check karta hai ki user ke paas required role ('admin', 'recruiter', etc.) hai ya nahi.
 *    - Unauthorized user par `403 Forbidden` return karta hai.
 * 
 * 3. `optionalAuth`:
 *    - Guest/User hybrid routes ke liye. Token hai to `req.user` set karega, nahi to bina block kiye aage bhej dega.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Dependencies required:
 *    `npm install jsonwebtoken cookie-parser`
 * 2. Environment Variable (.env):
 *    `JWT_SECRET=your_super_secret_jwt_key`
 * 3. App Setup:
 *    `app.use(cookieParser())` in app.js
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import authenticateToken, { authorizeRoles, optionalAuth } from "./middleware/isAuthenticated.middleware.js";
 * 
 * // Route protect karna:
 * router.get("/profile", authenticateToken, getProfile);
 * 
 * // Role guard lagana:
 * router.post("/jobs", authenticateToken, authorizeRoles("recruiter", "admin"), createJob);
 * 
 * // Guest-friendly route:
 * router.get("/feed", optionalAuth, getFeed);
 * ```
 */

/**
 * Verify JWT token from cookie or Authorization header
 */
export const authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Support Bearer token in header for REST/mobile/Postman clients
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login to continue.",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ [isAuthenticated.middleware] JWT_SECRET missing in environment!");
      return res.status(500).json({
        success: false,
        message: "Internal server authentication configuration error.",
      });
    }

    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found or deactivated.",
      });
    }

    req.id = user._id.toString();
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles Allowed roles ('admin', 'recruiter', 'student', etc.)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before role verification.",
      });
    }

    const userRole = (req.user.role || "").toLowerCase();
    const normalizedRoles = roles.map((r) => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of roles: [${roles.join(", ")}]`,
      });
    }
    next();
  };
};

/**
 * Optional authentication middleware:
 * Populates req.user and req.id if valid token exists, but does not reject guest requests.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        if (decoded?.userId) {
          const user = await User.findById(decoded.userId).select("-password");
          if (user) {
            req.id = user._id.toString();
            req.user = user;
          }
        }
      }
    }
  } catch (error) {
    // Graceful guest continuation
    req.user = null;
    req.id = null;
  }
  next();
};

export default authenticateToken;
