import cors from "cors";

/**
 * ============================================================================
 * 🌐 CORS CONFIGURATION MIDDLEWARE (Cross-Origin Resource Sharing)
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - Frontend application (e.g. React running on port 5173 or deployed on Vercel) ko 
 *   Backend API (e.g. Node running on port 5000) se baat karne ki permission deta hai.
 * - `credentials: true` ke saath cookies aur authorization headers ko securely allow karta hai.
 * - Pre-flight `OPTIONS` requests ko handle karta hai.
 * - Mobile apps, Postman, aur server-to-server calls (jinka koi browser origin nahi hota) ko allow karta hai.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Dependency required:
 *    `npm install cors`
 * 2. Environment Variable (.env):
 *    `CLIENT_URL=https://your-production-domain.com`
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import corsMiddleware from "./middleware/cors.middleware.js";
 * 
 * // app.js me directly lagayein:
 * app.use(corsMiddleware);
 * ```
 */

// Define allowed origins for local dev and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // In development mode, allow flexibly; in strict production, reject unknown origins
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(new Error(`CORS Policy: Origin ${origin} not allowed.`));
  },
  credentials: true, // Allow cookies & authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
