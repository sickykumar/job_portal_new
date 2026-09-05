import express from "express";
import authenticateToken from "../middleware/isAuthenticated.middleware.js";
import { singleUpload } from "../middleware/multer.middleware.js";
import {
  analyzeResumeATS,
  optimizeBulletPoint,
} from "../controllers/ats.controller.js";

const router = express.Router();

/**
 * Standalone ATS Router
 * Plug-and-play for any project requiring automated resume parsing and ATS auditing.
 */

// Analyze Resume ATS Score & Gaps
router.post("/analyze", authenticateToken, singleUpload, analyzeResumeATS);

// 1-Click Bullet Point Optimizer
router.post("/optimize-bullet", authenticateToken, optimizeBulletPoint);

export default router;
