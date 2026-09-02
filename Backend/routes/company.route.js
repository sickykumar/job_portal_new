import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Only recruiters can register/manage companies
router
  .route("/register")
  .post(authenticateToken, authorizeRoles("recruiter"), registerCompany);

router
  .route("/get")
  .get(authenticateToken, authorizeRoles("recruiter"), getAllCompanies);

router.route("/get/:id").get(authenticateToken, getCompanyById);

router
  .route("/update/:id")
  .put(
    authenticateToken,
    authorizeRoles("recruiter"),
    singleUpload,
    updateCompany
  );

export default router;