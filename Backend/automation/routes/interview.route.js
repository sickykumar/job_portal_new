import express from "express";
import {
  scheduleInterview,
  getMyInterviews,
  rescheduleInterview,
  cancelInterview,
} from "../controllers/interview.controller.js";
import authenticateToken from "../../middleware/isAuthenticated.middleware.js";

const router = express.Router();

router.route("/schedule").post(authenticateToken, scheduleInterview);
router.route("/my-interviews").get(authenticateToken, getMyInterviews);
router.route("/:id/reschedule").post(authenticateToken, rescheduleInterview);
router.route("/:id/cancel").post(authenticateToken, cancelInterview);

export default router;
