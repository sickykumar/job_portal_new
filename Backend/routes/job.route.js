import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.middleware.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  toggleSaveJob,
  getSavedJobs,
  getBroadcastPreview,
  broadcastJobAlert,
  toggleArchiveJob,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// Candidate bookmarked jobs
router.route("/saved").get(authenticateToken, getSavedJobs);
router.route("/save/:id").post(authenticateToken, toggleSaveJob);

// Recruiter: Broadcast Hiring Alert to matching candidates (2-3 skills match)
router
  .route("/broadcast-preview/:id")
  .get(authenticateToken, authorizeRoles("recruiter", "admin"), getBroadcastPreview);

router
  .route("/broadcast/:id")
  .post(authenticateToken, authorizeRoles("recruiter", "admin"), broadcastJobAlert);

// Recruiter: Archive/Reactivate and Delete Job
router
  .route("/:id/archive")
  .put(authenticateToken, authorizeRoles("recruiter", "admin"), toggleArchiveJob);

router
  .route("/:id")
  .delete(authenticateToken, authorizeRoles("recruiter", "admin"), deleteJob);

// Only recruiters can post jobs or view their posted admin jobs
router
  .route("/post")
  .post(authenticateToken, authorizeRoles("recruiter"), postJob);

router
  .route("/getadminjobs")
  .get(authenticateToken, authorizeRoles("recruiter"), getAdminJobs);

// Publicly searchable
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);

export default router;