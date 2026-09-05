import multer from "multer";

/**
 * ============================================================================
 * 📁 MULTER FILE UPLOAD MIDDLEWARE
 * ============================================================================
 * 
 * 📌 PURPOSE / KYA KARTA HAI:
 * - Incoming multipart/form-data request se files ko memory buffer me receive karta hai.
 * - Files ko disk par temporarily likhne ke bajaye direct RAM memory buffer (`req.file.buffer`) 
 *   me rakhta hai jo Cloudinary / AWS S3 upload ke liye fastest aur cleanest approach hai.
 * - `singleUpload` kisi bhi field name ('file', 'resume', 'avatar', 'logo') se file capture kar leta hai.
 * - 10MB maximum file size limit enforce karta hai.
 * 
 * ⚙️ PREREQUISITES / DUSRE PROJECT ME USE KARNE KE LIYE:
 * 1. Dependency: `npm install multer`
 * 2. Client side form me: `enctype="multipart/form-data"` or FormData object in JS/Axios.
 * 
 * 🚀 HOW TO USE / KAISE USE KAREIN:
 * ```javascript
 * import { singleUpload, multiUpload } from "./middleware/multer.middleware.js";
 * 
 * // Route me single file upload:
 * router.post("/update-profile", singleUpload, updateProfileController);
 * 
 * // Multiple files upload (up to 5):
 * router.post("/documents", multiUpload(5), uploadDocsController);
 * ```
 */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * Universal single file upload middleware.
 * Captures the uploaded file and sets `req.file` regardless of field name
 * (e.g. "profilePhoto", "file", "resume", "logo").
 */
export const singleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error. Max limit is 10MB.",
      });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

/**
 * Multiple files upload middleware.
 */
export const multiUpload = (maxCount = 5) => {
  return (req, res, next) => {
    upload.array("files", maxCount)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || `File upload error. Max ${maxCount} files allowed.`,
        });
      }
      next();
    });
  };
};

export default singleUpload;
