/**
 * ============================================================================
 * 📋 REQUEST VALIDATION MIDDLEWARE (Zod Schema Validator)
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - Request aane par incoming data (`req.body`, `req.query`, ya `req.params`) ko 
 *   ek predefined Zod schema ke according strictly validate karta hai.
 * - Controller me pahunchne se pehle hi invalid data, missing fields, ya wrong types ko block kar deta hai.
 * - Controller code clean rehta hai aur repetitive validation logic likhne ki zaroorat nahi padti.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Dependency required:
 *    `npm install zod`
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import { z } from "zod";
 * import validate from "./middleware/validate.middleware.js";
 * 
 * const userRegistrationSchema = z.object({
 *   fullname: z.string().min(2, "Name must be at least 2 characters"),
 *   email: z.string().email("Invalid email address"),
 *   password: z.string().min(6, "Password must be at least 6 characters"),
 * });
 * 
 * // Route me attach karein:
 * router.post("/register", validate(userRegistrationSchema, "body"), registerController);
 * ```
 */

/**
 * Request Validation Middleware Factory:
 * @param {import("zod").ZodSchema} schema Zod validation schema
 * @param {"body" | "query" | "params"} source Request property to validate (default: "body")
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse(req[source]);
      if (!parsed.success) {
        // Collect detailed error messages per field
        const errors = parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: errors[0]?.message || "Validation failed for request input.",
          errors,
        });
      }

      // Assign sanitized and parsed values back to request
      req[source] = parsed.data;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
