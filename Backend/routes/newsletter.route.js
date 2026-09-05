import express from "express";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "../controllers/newsletter.controller.js";

const router = express.Router();

router.route("/subscribe").post(subscribeNewsletter);
router.route("/unsubscribe").post(unsubscribeNewsletter);

export default router;
