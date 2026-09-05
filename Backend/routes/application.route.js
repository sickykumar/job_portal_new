import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.middleware.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  downloadResume,
  getCandidateStats,
  getRecruiterStats,
  bulkUpdateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// Candidate endpoints
router.post("/apply/:id", authenticateToken, applyJob);
router.get("/get", authenticateToken, getAppliedJobs);
router.get("/stats", authenticateToken, getCandidateStats);

// Recruiter endpoints
router.get("/recruiter-stats", authenticateToken, authorizeRoles("recruiter"), getRecruiterStats);
router.post("/bulk-status", authenticateToken, authorizeRoles("recruiter"), bulkUpdateStatus);
router.get(
  "/applicants/:id",
  authenticateToken,
  authorizeRoles("recruiter"),
  getApplicants
);
router.get(
  "/download-resume/:id",
  authenticateToken,
  authorizeRoles("recruiter"),
  downloadResume
);
router.post(
  "/status/:id/update",
  authenticateToken,
  authorizeRoles("recruiter"),
  updateStatus
);

export default router;