import express from "express";
import authenticateToken, { authorizeRoles, optionalAuth } from "../middleware/isAuthenticated.middleware.js";
import {
  generateJobDescription,
  matchCandidateToJob,
  generateBioSkills,
  generateInterviewDetails,
  generateFeedback,
  calculateCareerDNA,
  rankCandidatesForJob,
  careerCoachAdvice,
  interviewPrepSimulator,
  salaryIntelligence,
  enhanceBroadcastMessage,
} from "../controllers/ai.controller.js";

const router = express.Router();

// Recruiter: enhance broadcast message with AI
router.post(
  "/enhance-broadcast",
  authenticateToken,
  authorizeRoles("recruiter", "admin"),
  enhanceBroadcastMessage
);

// Candidate: check job fit
router.post("/match", authenticateToken, matchCandidateToJob);

// Candidate: AI Auto-craft Bio & Skills
router.post("/generate-bio", authenticateToken, generateBioSkills);

// Candidate: AI Career DNA & Market Readiness
router.get("/career-dna", authenticateToken, calculateCareerDNA);

// Candidate & Guest (Freemium): Conversational Career Coach
router.post("/career-coach", optionalAuth, careerCoachAdvice);

// Candidate: AI Interview Prep Simulator
router.post("/interview-prep", authenticateToken, interviewPrepSimulator);

// Candidate: Salary & Negotiation Intelligence
router.post("/salary-insight", authenticateToken, salaryIntelligence);

// Recruiter: AI Rank candidates for specific job
router.post(
  "/rank-candidates",
  authenticateToken,
  authorizeRoles("recruiter"),
  rankCandidatesForJob
);

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


