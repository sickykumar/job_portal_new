import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

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