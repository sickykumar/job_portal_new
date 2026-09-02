import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.js";
import {
  generateJobDescription,
  matchCandidateToJob,
  generateBioSkills,
  generateInterviewDetails,
  generateFeedback,
} from "../controllers/ai.controller.js";

const router = express.Router();

// Candidate: check job fit
router.post("/match", authenticateToken, matchCandidateToJob);

// Candidate: AI Auto-craft Bio & Skills
router.post("/generate-bio", authenticateToken, generateBioSkills);

// Recruiter: generate AI job description
router.post(
  "/generate-jd",
  authenticateToken,
  authorizeRoles("recruiter"),
  generateJobDescription
);

// Recruiter: generate AI interview schedule instructions
router.post(
  "/generate-interview",
  authenticateToken,
  authorizeRoles("recruiter"),
  generateInterviewDetails
);

// Recruiter: generate AI rejection or acceptance feedback
router.post(
  "/generate-feedback",
  authenticateToken,
  authorizeRoles("recruiter"),
  generateFeedback
);

export default router;
