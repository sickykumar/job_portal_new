import express from "express";
import authenticateToken, { authorizeRoles } from "../middleware/isAuthenticated.middleware.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Only recruiters can register/manage companies
router
  .route("/register")
  .post(authenticateToken, authorizeRoles("recruiter", "admin"), singleUpload, registerCompany);

router
  .route("/get")
  .get(authenticateToken, authorizeRoles("recruiter", "admin"), getAllCompanies);

router.route("/get/:id").get(authenticateToken, getCompanyById);

router
  .route("/update/:id")
  .put(
    authenticateToken,
    authorizeRoles("recruiter", "admin"),
    singleUpload,
    updateCompany
  );

export default router;