import express from "express";
import { optionalAuth, authenticateToken } from "../middleware/isAuthenticated.middleware.js";
import {
  getHackathons,
  registerHackathon,
  createHackathon,
  deleteHackathon,
  getMyHackathons,
} from "../controllers/hackathon.controller.js";

const router = express.Router();

router.get("/get", getHackathons);
router.post("/register/:id", optionalAuth, registerHackathon);
router.post("/create", authenticateToken, createHackathon);
router.delete("/:id", authenticateToken, deleteHackathon);
router.get("/my-hackathons", authenticateToken, getMyHackathons);

export default router;
