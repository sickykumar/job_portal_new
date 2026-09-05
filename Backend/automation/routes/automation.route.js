import express from "express";
import {
  getAutomationOverview,
  getAutomationQueue,
  retryFailedJob,
  getFlaggedJobs,
  resolveJobModeration,
  getCandidateRecommendations,
  triggerAiSyncAll,
} from "../controllers/automationAdmin.controller.js";
import authenticateToken from "../../middleware/isAuthenticated.middleware.js";

const router = express.Router();

// Candidate personalized recommendations
router.route("/recommendations").get(authenticateToken, getCandidateRecommendations);

// Admin automation overview & metrics
router.route("/overview").get(authenticateToken, getAutomationOverview);

// Admin Gemini AI sync and expiry audit
router.route("/ai-sync-all").post(authenticateToken, triggerAiSyncAll);

// Admin background queue monitor
router.route("/queue").get(authenticateToken, getAutomationQueue);

// Admin retry failed background job
router.route("/retry/:id").post(authenticateToken, retryFailedJob);

// Admin flagged jobs queue & resolution
router.route("/flagged-jobs").get(authenticateToken, getFlaggedJobs);
router.route("/resolve-flagged/:id").post(authenticateToken, resolveJobModeration);

export default router;
