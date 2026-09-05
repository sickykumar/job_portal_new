import helmet from "helmet";

/**
 * ============================================================================
 * 🛡️ SECURITY HEADERS MIDDLEWARE (Helmet Protection)
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - HTTP response headers ko securely set karta hai.
 * - `X-Powered-By: Express` header ko hide karta hai taaki attackers ko technology stack pata na chale.
 * - Clickjacking (Frameguard), XSS attacks, aur MIME-type sniffing se browser ko protect karta hai.
 * - Cross-Origin Resource Policy (CORP) ko cross-origin media files aur APIs ke liye configure karta hai.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Dependency required:
 *    `npm install helmet`
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import securityMiddleware from "./middleware/security.middleware.js";
 * 
 * // app.js me sabse pehle use karein:
 * app.use(securityMiddleware);
 * ```
 */
export const securityMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Set to true with custom directives if serving static server-side HTML
});

export default securityMiddleware;
