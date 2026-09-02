import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  downloadResume,
} from "../controllers/application.controller.js";

const router = express.Router();

// Candidate endpoints
router.post("/apply/:id", authenticateToken, applyJob);
router.get("/get", authenticateToken, getAppliedJobs);

// Recruiter endpoints
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