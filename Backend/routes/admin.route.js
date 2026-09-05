import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.middleware.js";
import {
  getAdminOverview,
  getAllCandidates,
  toggleUserStatus,
  deleteCandidate,
  getAllRecruiters,
  deleteRecruiter,
  getAllJobsForAdmin,
  deleteJobByAdmin,
  getAllTickets,
  resolveTicket,
  getSystemHealthStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require authentication and STRICT admin role privileges
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

// Platform Metrics & Overview
router.get("/overview", getAdminOverview);
router.get("/health", getSystemHealthStatus);

// Candidate Management
router.get("/candidates", getAllCandidates);
router.put("/candidates/:id/status", toggleUserStatus);
router.delete("/candidates/:id", deleteCandidate);

// Recruiter Management
router.get("/recruiters", getAllRecruiters);
router.put("/recruiters/:id/status", toggleUserStatus);
router.delete("/recruiters/:id", deleteRecruiter);

// Job Moderation
router.get("/jobs", getAllJobsForAdmin);
router.delete("/jobs/:id", deleteJobByAdmin);

// Support Tickets Desk & Resolution
router.get("/tickets", getAllTickets);
router.put("/tickets/:id/resolve", resolveTicket);

export default router;
