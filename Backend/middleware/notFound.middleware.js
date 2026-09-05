/**
 * ============================================================================
 * 🔍 404 NOT FOUND CATCH-ALL MIDDLEWARE
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - Jab koi client kisi aise URL ya HTTP method par request bhejta hai jo server me exist nahi karta,
 *   to yeh middleware clean aur consistent JSON 404 response bhejta hai.
 * - Express 5 path-to-regexp v8 friendly hai (no regex/wildcard crashes).
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Isse saare registered API routes ke theek BAAD aur `errorHandler` se theek PEHLE lagayein.
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import notFoundHandler from "./middleware/notFound.middleware.js";
 * 
 * // Routes ke baad:
 * app.use("/api/users", userRoutes);
 * 
 * // 404 handler:
 * app.use(notFoundHandler);
 * 
 * // Error handler (aakhri me):
 * app.use(errorHandler);
 * ```
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found on this server.`,
  });
};

export default notFoundHandler;
