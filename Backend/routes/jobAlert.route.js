import express from "express";
import authenticateToken from "../middleware/isAuthenticated.middleware.js";
import {
  createJobAlert,
  getMyJobAlerts,
  toggleJobAlert,
  deleteJobAlert,
} from "../controllers/jobAlert.controller.js";

const router = express.Router();

/**
 * Standalone Job Alert Router
 * Plug-and-play for any project requiring automated candidate email alerts on new job postings.
 */

router.post("/create", authenticateToken, createJobAlert);
router.get("/my", authenticateToken, getMyJobAlerts);
router.put("/toggle/:id", authenticateToken, toggleJobAlert);
router.delete("/:id", authenticateToken, deleteJobAlert);

export default router;
