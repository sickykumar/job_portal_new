import express from "express";
import { optionalAuth, authenticateToken } from "../middleware/isAuthenticated.middleware.js";
import {
  getQuizzes,
  submitQuiz,
  createQuiz,
  deleteQuiz,
  getMyQuizzes,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.get("/get", getQuizzes);
router.post("/submit", optionalAuth, submitQuiz);
router.post("/create", authenticateToken, createQuiz);
router.delete("/:id", authenticateToken, deleteQuiz);
router.get("/my-quizzes", authenticateToken, getMyQuizzes);

export default router;
