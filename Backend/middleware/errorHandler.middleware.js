/**
 * ============================================================================
 * 🚨 CENTRALIZED ERROR HANDLING MIDDLEWARE
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - Application me kahi bhi aane wale synchronous ya asynchronous errors ko ek central jagah catch karta hai.
 * - Controller me `try...catch` ke andar `next(error)` call karne par automatically yeh middleware trigger hota hai.
 * - Production environment me internal stack traces ko hide karta hai taaki security vulnerabilities leak na hon.
 * - Mongoose Duplicate Key (11000) aur Invalid ObjectId (CastError) ko user-friendly messages me format karta hai.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Is middleware ko `app.js` me **saare routes ke baad (sabse aakhri me)** lagana mandatory hai.
 * 2. Express error handler me 4 arguments hona zaroori hai: `(err, req, res, next)`.
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import errorHandler from "./middleware/errorHandler.middleware.js";
 * 
 * // app.js me sabse last line me:
 * app.use(errorHandler);
 * 
 * // Kisi bhi controller me error throw karna:
 * export const myController = async (req, res, next) => {
 *   try {
 *     const user = await User.findById(req.params.id);
 *     if (!user) {
 *       const error = new Error("User not found");
 *       error.statusCode = 404;
 *       return next(error);
 *     }
 *   } catch (err) {
 *     next(err); // Centralized error handler catches this!
 *   }
 * };
 * ```
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 1. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate entry: '${field}' already exists. Please choose a different value.`;
  }

  // 2. Mongoose Invalid ObjectId CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid identifier parameter '${err.value}'.`;
  }

  // 3. JWT Verification or Expiry Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid security token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  // Log server internal diagnostics
  if (statusCode === 500) {
    console.error("🔥 [Internal Server Error]:", err);
  } else {
    console.warn(`⚠️ [API ${statusCode}]:`, message);
  }

  const isProd = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};

export default errorHandler;
