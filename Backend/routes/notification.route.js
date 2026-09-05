import express from "express";
import authenticateToken from "../middleware/isAuthenticated.middleware.js";
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/get", authenticateToken, getNotifications);
router.put("/read/:id", authenticateToken, markNotificationAsRead);
router.put("/read-all", authenticateToken, markAllAsRead);

export default router;
