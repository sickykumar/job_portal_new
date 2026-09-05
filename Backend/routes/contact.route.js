import express from "express";
import { submitContact } from "../controllers/contact.controller.js";

const router = express.Router();

router.route("/submit").post(submitContact);

export default router;
