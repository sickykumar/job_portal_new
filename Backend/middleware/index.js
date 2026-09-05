/**
 * ============================================================================
 * 🧰 ENTERPRISE MIDDLEWARE SUITE - MASTER INDEX
 * ============================================================================
 * Clean one-stop barrel export for all project middlewares.
 * You can easily copy the entire `middleware/` folder to ANY other Node.js/Express project!
 */

// 1. Authentication & Roles
export {
  authenticateToken,
  authorizeRoles,
  optionalAuth,
} from "./isAuthenticated.middleware.js";

// 2. Security & Rate Limiting
export { securityMiddleware } from "./security.middleware.js";
export { corsMiddleware, corsOptions } from "./cors.middleware.js";
export { generalLimiter, authLimiter, createRateLimiter } from "./rateLimiter.middleware.js";

// 3. File Uploads
export { singleUpload, multiUpload } from "./multer.middleware.js";

// 4. Request Validation
export { validate } from "./validate.middleware.js";

// 5. Error & 404 Handlers
export { errorHandler } from "./errorHandler.middleware.js";
export { notFoundHandler } from "./notFound.middleware.js";
