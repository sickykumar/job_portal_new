import rateLimit from "express-rate-limit";

/**
 * ============================================================================
 * ⏱️ RATE LIMITER MIDDLEWARE (DDoS & Brute-Force Protection)
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - Specific time-window (e.g. 15 minutes) me ek IP address se aane wali requests ki count track karta hai.
 * - Limit cross hone par `429 Too Many Requests` status code return karta hai.
 * - Brute-force password guessing, credential stuffing, scraping aur DDoS attacks se protect karta hai.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Dependency required:
 *    `npm install express-rate-limit`
 * 2. Behind Reverse Proxy (Nginx, Cloudflare, Render, Heroku):
 *    `app.set("trust proxy", 1)` enable kare taaki client ka real IP detect ho sake.
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import { generalLimiter, authLimiter, createRateLimiter } from "./middleware/rateLimiter.middleware.js";
 * 
 * // Saari API routes par general limit (e.g. 300 req / 15 min):
 * app.use("/api/", generalLimiter);
 * 
 * // Sensitive Auth routes par strict limit (e.g. 30 req / 15 min):
 * app.use("/api/user/login", authLimiter);
 * app.use("/api/user/register", authLimiter);
 * 
 * // Custom limiter create karna (e.g. OTP resend: max 3 requests per 5 minutes):
 * const otpLimiter = createRateLimiter(5 * 60 * 1000, 3, "Too many OTP requests. Try after 5 mins.");
 * router.post("/send-otp", otpLimiter, sendOtpController);
 * ```
 */

/**
 * General API Limiter:
 * 300 requests per 15 minutes per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return standard RateLimit headers (RateLimit-Limit, RateLimit-Remaining)
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again after 15 minutes.",
  },
});

/**
 * Strict Auth Limiter:
 * 30 attempts per 15 minutes per IP for login/registration.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait 15 minutes before trying again.",
  },
});

/**
 * Custom Rate Limiter Factory:
 * @param {number} windowMs Time window in milliseconds
 * @param {number} max Maximum allowed requests within window
 * @param {string} customMessage Optional customized rejection message
 */
export const createRateLimiter = (
  windowMs = 15 * 60 * 1000,
  max = 50,
  customMessage = "Rate limit exceeded. Please slow down."
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: customMessage,
    },
  });
};

export default { generalLimiter, authLimiter, createRateLimiter };
